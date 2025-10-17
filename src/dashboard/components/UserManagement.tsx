import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, X, Search } from 'lucide-react';
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

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/auth/api/all_users');
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.detail || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
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

  // Format date to a more readable form
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle click on update button
  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
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
      // Close the update form
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error refreshing users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Close update form
  const handleCloseUpdateForm = () => {
    setSelectedUser(null);
  };

  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      {error && <Alert type="error">{error}</Alert>}
      
      {/* Show update form when a user is selected */}
      {selectedUser ? (
        <div className="p-4">
          <div className="mb-4 flex justify-end">
            <button 
              onClick={handleCloseUpdateForm}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <UpdateUserForm 
              key={selectedUser.user_id} // Force re-render on user change
              user={selectedUser}
              onUpdateSuccess={handleUpdateSuccess} 
            />
            <UserRoleManagement 
              user={selectedUser}
              onRolesUpdated={handleUpdateSuccess}
            />
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
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone_number || '-'}</div>
                      {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles && user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.role_id}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                              {role.role_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No roles</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateClick(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        <Pencil size={16} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;