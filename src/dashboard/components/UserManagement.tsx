import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, X, Search, Eye, ArrowLeft, CheckCircle, XCircle, Key } from 'lucide-react';
import Alert from '../../components/common/Alert';
// Ensuring we're using the updated form component
import { UpdateUserForm, UserRoleManagement } from '../forms';

interface Role {
  role_id: string;
  role_name: string;
}

interface User {
  user_id: string;
  nic: string | null;
  first_name: string;
  last_name: string;
  address: string | null;
  phone_number: string | null;
  dob: string | null;
  email: string | null;
  username: string;
  created_at: string;
  roles: Role[];
}

interface UserStatus {
  user_id: string;
  status: 'active' | 'inactive';
  is_active: boolean;
}

interface UserManagementProps {
  onSelectUserToUpdate?: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onSelectUserToUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isManagingRoles, setIsManagingRoles] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<{[key: string]: UserStatus}>({});
  const [loadingStatus, setLoadingStatus] = useState<{[key: string]: boolean}>({});
  const [showPasswordResetModal, setShowPasswordResetModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false);

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/auth/api/all_users');
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setError(null);
        
        // If we're viewing a specific user, fetch their status immediately
        if (viewingUser) {
          await fetchUserStatus(viewingUser.user_id);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.detail || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [viewingUser?.user_id]);
  
  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const username = user.username.toLowerCase();
        return fullName.includes(lowercaseSearchTerm) || username.includes(lowercaseSearchTerm);
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // We're now formatting dates inline in the view details

  // Handle click on update button from the table
  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setViewingUser(null);
    if (onSelectUserToUpdate) {
      onSelectUserToUpdate(user);
    }
  };

  // Handle user update success
  const handleUpdateSuccess = async () => {
    // Refresh the user list
    try {
      setLoading(true);
      const response = await api.get('/api/auth/api/all_users');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
      
      // If we were viewing a user before, find the updated user and set it as the viewing user
      if (selectedUser) {
        const updatedUser = response.data.users.find(
          (u: User) => u.user_id === selectedUser.user_id
        );
        if (updatedUser) {
          setViewingUser(updatedUser);
          // Also refresh the user's status
          await fetchUserStatus(updatedUser.user_id);
        }
      }
      
      // Close the update form
      setSelectedUser(null);
      setIsManagingRoles(false);
    } catch (err: any) {
      console.error('Error refreshing users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Close update form or role management
  const handleCloseUpdateForm = () => {
    const currentUser = selectedUser;
    
    // Reset the form states
    setSelectedUser(null);
    setIsManagingRoles(false);
    
    // If we came from viewing a user, go back to viewing that user
    if (currentUser && (viewingUser?.user_id === currentUser.user_id || !viewingUser)) {
      // Refresh the user data before showing the profile again
      const refreshedUser = users.find(u => u.user_id === currentUser.user_id);
      if (refreshedUser) {
        setViewingUser(refreshedUser);
      }
    }
  };
  
  // Handle click on view button
  const handleViewClick = async (user: User) => {
    setViewingUser(user);
    setSelectedUser(null);
    setIsManagingRoles(false);
    
    // Fetch user status when viewing a user
    await fetchUserStatus(user.user_id);
  };
  
  // Toggle user status (activate/deactivate)
  const handleToggleUserStatus = async (userId: string) => {
    const currentStatus = userStatus[userId];
    
    if (currentStatus?.is_active) {
      // User is active, deactivate them
      await deactivateUser(userId);
    } else {
      // User is inactive, activate them
      await activateUser(userId);
    }
  };
  
  // Reset user password
  const resetUserPassword = async (username: string, newPassword: string) => {
    if (!username) return;
    
    try {
      setLoading(true);
      await api.post('/api/auth/users_password_reset', {
        username: username,
        new_password: newPassword
      });
      
      // Show success message
      setError(null);
      return { success: true, message: "Password reset successfully" };
    } catch (err: any) {
      console.error(`Error resetting password for user ${username}:`, err);
      setError(err.response?.data?.detail || 'Failed to reset password');
      return { success: false, message: err.response?.data?.detail || 'Failed to reset password' };
    } finally {
      setLoading(false);
    }
  };
  
  // Close view details
  const handleCloseViewDetails = () => {
    setViewingUser(null);
    setSelectedUser(null);
    setIsManagingRoles(false);
  };
  
  // Handle click on manage roles button
  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setViewingUser(null); // Clear viewing user to show the role management UI
    setIsManagingRoles(true);
  };
  
  // Open password reset modal
  const handleOpenPasswordResetModal = () => {
    setNewPassword('');
    setResetPasswordSuccess(false);
    setShowPasswordResetModal(true);
  };
  
  // Close password reset modal
  const handleClosePasswordResetModal = () => {
    setShowPasswordResetModal(false);
  };
  
  // Handle password reset submission
  const handlePasswordResetSubmit = async () => {
    if (!viewingUser || !newPassword.trim()) return;
    
    const result = await resetUserPassword(viewingUser.username, newPassword.trim());
    if (result?.success) {
      setResetPasswordSuccess(true);
      // Reset form after success
      setNewPassword('');
      // Close modal after short delay
      setTimeout(() => {
        setShowPasswordResetModal(false);
        setResetPasswordSuccess(false);
      }, 1500);
    }
  };
  
  // Fetch user status
  const fetchUserStatus = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoadingStatus(prev => ({ ...prev, [userId]: true }));
      const response = await api.get(`/api/auth/user/status/${userId}`);
      setUserStatus(prev => ({ ...prev, [userId]: response.data }));
      return response.data;
    } catch (err: any) {
      console.error(`Error fetching status for user ${userId}:`, err);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Activate user
  const activateUser = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoadingStatus(prev => ({ ...prev, [userId]: true }));
      await api.put('/api/auth/user/activate', { user_id: userId });
      // Update status after activation
      const newStatus = await fetchUserStatus(userId);
      
      // Show success message
      setError(null);
      return newStatus;
    } catch (err: any) {
      console.error(`Error activating user ${userId}:`, err);
      setError(err.response?.data?.detail || 'Failed to activate user');
    } finally {
      setLoadingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Deactivate user
  const deactivateUser = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoadingStatus(prev => ({ ...prev, [userId]: true }));
      await api.put('/api/auth/user/deactivate', { user_id: userId });
      // Update status after deactivation
      const newStatus = await fetchUserStatus(userId);
      
      // Show success message
      setError(null);
      return newStatus;
    } catch (err: any) {
      console.error(`Error deactivating user ${userId}:`, err);
      setError(err.response?.data?.detail || 'Failed to deactivate user');
    } finally {
      setLoadingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      {error && <Alert type="error">{error}</Alert>}
      
      {/* Show user details when a user is selected for viewing */}
      {viewingUser ? (
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">User Profile</h2>
            <button 
              onClick={handleCloseViewDetails}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex items-center"
              title="Back to list"
            >
              <ArrowLeft size={20} />
              <span className="ml-1">Back</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - User profile card */}
            <div className="col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-blue-600 text-2xl font-bold">
                      {viewingUser.first_name[0]}{viewingUser.last_name[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{viewingUser.first_name} {viewingUser.last_name}</h3>
                  <p className="text-gray-500 text-sm">@{viewingUser.username}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    User since {viewingUser.created_at ? new Date(viewingUser.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
                
                <div className="mt-6">
                  {/* User Status */}
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    {loadingStatus[viewingUser.user_id] ? (
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-500">
                          Loading...
                        </span>
                      </div>
                    ) : userStatus[viewingUser.user_id]?.is_active ? (
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {viewingUser.roles && viewingUser.roles.length > 0 ? (
                      viewingUser.roles.map((role) => (
                        <span
                          key={role.role_id}
                          className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {role.role_name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No roles assigned</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <button
                      onClick={() => handleUpdateClick(viewingUser)}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <Pencil size={16} />
                      <span>Update User Details</span>
                    </button>
                    
                    <button
                      onClick={() => handleManageRoles(viewingUser)}
                      className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Manage User Roles</span>
                    </button>
                    
                    {!loadingStatus[viewingUser.user_id] && userStatus[viewingUser.user_id]?.is_active && (
                      <button
                        onClick={() => handleToggleUserStatus(viewingUser.user_id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                        disabled={loadingStatus[viewingUser.user_id]}
                      >
                        <XCircle size={16} />
                        <span>{loadingStatus[viewingUser.user_id] ? 'Processing...' : 'Deactivate User'}</span>
                      </button>
                    )}
                    
                    {!loadingStatus[viewingUser.user_id] && userStatus[viewingUser.user_id] && !userStatus[viewingUser.user_id].is_active && (
                      <button
                        onClick={() => handleToggleUserStatus(viewingUser.user_id)}
                        className="w-full bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                        disabled={loadingStatus[viewingUser.user_id]}
                      >
                        <CheckCircle size={16} />
                        <span>{loadingStatus[viewingUser.user_id] ? 'Processing...' : 'Activate User'}</span>
                      </button>
                    )}
                    
                    <button
                      onClick={handleOpenPasswordResetModal}
                      className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <Key size={16} />
                      <span>Reset Password</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - User details */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and user information.</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.first_name} {viewingUser.last_name}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.username}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">NIC</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.nic || '-'}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.email || '-'}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.phone_number || '-'}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewingUser.address || '-'}</dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {viewingUser.dob ? new Date(viewingUser.dob).toLocaleDateString() : '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : selectedUser ? (
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              {isManagingRoles ? "Manage User Roles" : "Update User"}
            </h2>
            <button 
              onClick={handleCloseUpdateForm}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex items-center"
              title="Close"
            >
              {users.some(u => u.user_id === selectedUser.user_id) ? (
                <>
                  <ArrowLeft size={20} />
                  <span className="ml-1">Back to Profile</span>
                </>
              ) : (
                <X size={20} />
              )}
            </button>
          </div>
          <div className="space-y-6">
            {!isManagingRoles ? (
              <UpdateUserForm 
                key={`update-${selectedUser.user_id}`} // Force re-render on user change
                user={selectedUser}
                onUpdateSuccess={handleUpdateSuccess} 
              />
            ) : (
              <UserRoleManagement 
                key={`roles-${selectedUser.user_id}`}
                user={selectedUser}
                onRolesUpdated={handleUpdateSuccess}
              />
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : (
        <div>
          <div className="p-4 bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIC
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {users.length === 0 ? 'No users found' : 'No users match your search'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.nic || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(user)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                        >
                          <Eye size={16} />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordResetModal && viewingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
              <button
                onClick={handleClosePasswordResetModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {resetPasswordSuccess ? (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
                <p className="mt-2 text-sm text-gray-500">
                  The password for {viewingUser.username} has been reset successfully.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Enter a new password for user <span className="font-medium">{viewingUser.username}</span>
                  </p>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClosePasswordResetModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordResetSubmit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!newPassword.trim()}
                  >
                    Reset Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;