import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, X } from 'lucide-react';
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
  created_at: string;
  roles: Role[];
}

interface UserManagementProps {
  onSelectUserToUpdate?: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onSelectUserToUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
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
    <div className="overflow-hidden bg-white shadow-lg rounded-xl border-t-4 border-[#2A9D8F]">
      {error && <Alert type="error">{error}</Alert>}
      
      {/* Show update form when a user is selected */}
      {selectedUser ? (
        <div className="p-4">
          <div className="mb-4 flex justify-end">
            <button 
              onClick={handleCloseUpdateForm}
              className="text-[#6C757D] hover:text-[#264653] p-1 rounded-full hover:bg-[#F8F9FA]"
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
          <p className="text-[#6C757D]">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E9ECEF]">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  NIC
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6C757D] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E9ECEF]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-[#6C757D]">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-[#F8F9FA]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-[#264653]">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#264653]">{user.nic || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#264653]">{user.phone_number || '-'}</div>
                      {user.email && <div className="text-sm text-[#6C757D]">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles && user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.role_id}
                              className="px-2 py-1 text-xs font-medium rounded-lg bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F]"
                            >
                              {role.role_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-[#6C757D]">No roles</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6C757D]">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateClick(user)}
                        className="text-[#2A9D8F] hover:text-[#238579] flex items-center gap-1 bg-[#2A9D8F] bg-opacity-5 hover:bg-opacity-10 px-3 py-1 rounded-lg transition-colors"
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
      )}
    </div>
  );
};

export default UserManagement;