import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Alert from '../../components/common/Alert';
import { UpdateUserForm, UserRoleManagement } from '../forms';

// Import our new components and types
import UserProfileView from './userManagement/UserProfileView';
import UserTable from './userManagement/UserTable';
import PasswordResetModal from './userManagement/PasswordResetModal';
import type { User, UserStatus, UserManagementProps } from './userManagement/types';
import { 
  fetchAllUsers,
  fetchUserStatus,
  activateUser,
  deactivateUser,
  resetUserPassword
} from './userManagement/api';

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

  // Fetch all users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userData = await fetchAllUsers();
        setUsers(userData);
        setFilteredUsers(userData);
        setError(null);
        
        // If we're viewing a specific user, fetch their status immediately
        if (viewingUser) {
          await handleFetchUserStatus(viewingUser.user_id);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.detail || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
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
      const userData = await fetchAllUsers();
      setUsers(userData);
      setFilteredUsers(userData);
      
      // If we were viewing a user before, find the updated user and set it as the viewing user
      if (selectedUser) {
        const updatedUser = userData.find(
          (u: User) => u.user_id === selectedUser.user_id
        );
        if (updatedUser) {
          setViewingUser(updatedUser);
          // Also refresh the user's status
          await handleFetchUserStatus(updatedUser.user_id);
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
    await handleFetchUserStatus(user.user_id);
  };
  
  // Toggle user status (activate/deactivate)
  const handleToggleUserStatus = async (userId: string) => {
    const currentStatus = userStatus[userId];
    
    try {
      if (currentStatus?.is_active) {
        // User is active, deactivate them
        const newStatus = await deactivateUser(userId);
        setUserStatus(prev => ({ ...prev, [userId]: newStatus }));
      } else {
        // User is inactive, activate them
        const newStatus = await activateUser(userId);
        setUserStatus(prev => ({ ...prev, [userId]: newStatus }));
      }
      setError(null);
    } catch (err: any) {
      console.error(`Error toggling status for user ${userId}:`, err);
      setError(err.response?.data?.detail || 'Failed to update user status');
    }
  };
  
  // Fetch user status helper
  const handleFetchUserStatus = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoadingStatus(prev => ({ ...prev, [userId]: true }));
      const status = await fetchUserStatus(userId);
      setUserStatus(prev => ({ ...prev, [userId]: status }));
    } catch (err: any) {
      console.error(`Error fetching status for user ${userId}:`, err);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Open password reset modal
  const handleOpenPasswordResetModal = () => {
    setShowPasswordResetModal(true);
  };
  
  // Close password reset modal
  const handleClosePasswordResetModal = () => {
    setShowPasswordResetModal(false);
  };
  
  // Handle password reset submission
  const handlePasswordResetSubmit = async (password: string) => {
    if (!viewingUser) return { success: false, message: 'No user selected' };
    
    try {
      setLoading(true);
      const result = await resetUserPassword(viewingUser.username, password);
      if (!result.success) {
        setError(result.message);
      } else {
        setError(null);
      }
      return result;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to reset password';
      setError(message);
      return { success: false, message };
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

  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      {error && <Alert type="error">{error}</Alert>}
      
      {/* Show user details when a user is selected for viewing */}
      {viewingUser ? (
        <UserProfileView
          user={viewingUser}
          userStatus={userStatus[viewingUser.user_id]}
          isLoadingStatus={!!loadingStatus[viewingUser.user_id]}
          onClose={handleCloseViewDetails}
          onUpdate={handleUpdateClick}
          onManageRoles={handleManageRoles}
          onToggleStatus={handleToggleUserStatus}
          onResetPassword={handleOpenPasswordResetModal}
        />
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
      ) : (
        <UserTable
          users={users}
          filteredUsers={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onViewUser={handleViewClick}
          loading={loading}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordResetModal && viewingUser && (
        <PasswordResetModal
          username={viewingUser.username}
          onClose={handleClosePasswordResetModal}
          onSubmit={handlePasswordResetSubmit}
        />
      )}
    </div>
  );
};

export default UserManagement;