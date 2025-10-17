import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

interface Role {
  role_id: string;
  role_name: string;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  roles: Role[];
}

interface UserRoleManagementProps {
  user: User;
  onRolesUpdated?: () => void;
}

const UserRoleManagement: React.FC<UserRoleManagementProps> = ({ user, onRolesUpdated }) => {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setFetchingRoles(true);
        const response = await api.get('/api/auth/api/all_roles');
        setAllRoles(response.data.roles || []);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setError(err.response?.data?.detail || 'Failed to fetch roles');
      } finally {
        setFetchingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Set initial selected roles based on user's current roles
  useEffect(() => {
    if (user && user.roles) {
      setSelectedRoles(user.roles.map(role => role.role_id));
    }
  }, [user]);

  // Handle role checkbox change
  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Submit role changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/api/auth/user/manage_roles', {
        user_id: user.user_id,
        role_ids: selectedRoles
      });

      setSuccess('User roles updated successfully');
      
      if (onRolesUpdated) {
        onRolesUpdated();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update user roles');
    } finally {
      setLoading(false);
    }
  };

  // Get role name by ID for display
  const getRoleName = (roleId: string): string => {
    const role = allRoles.find(r => r.role_id === roleId);
    return role ? role.role_name : 'Unknown Role';
  };
  
  // We don't need this function since we're filtering roles directly in the JSX
  // Removing to resolve unused function warning

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-[#DEE2E6] border-t-4 border-t-[#2A9D8F]">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-[#264653]">Manage User Roles</h3>
        <p className="text-sm text-[#6C757D]">Assign roles to {user.first_name} {user.last_name}</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="mb-4 p-4 bg-[#2A9D8F] bg-opacity-5 border border-[#2A9D8F] border-opacity-20 rounded-lg">
        <p className="text-sm text-[#264653]">
          <strong>Instructions:</strong> Click on the role boxes below to select or deselect permissions for this user. 
          Selected roles will appear in the "Selected Roles" section. If you want to remove all roles from this user, 
          deselect all roles and click "Remove All Roles".
        </p>
      </div>

      {fetchingRoles ? (
        <div className="py-4 text-center">
          <p className="text-[#6C757D]">Loading roles...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#264653] mb-3">Available Roles:</h4>
            
            {/* Group roles into categories */}
            <div className="space-y-6">
              {/* Account Management Roles */}
              <div className="mb-4">
                <h5 className="text-xs uppercase tracking-wider text-[#6C757D] mb-2 border-b border-[#E9ECEF] pb-1">Account Management</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allRoles.filter(role => role.role_name.includes('account')).map((role) => {
                    const isSelected = selectedRoles.includes(role.role_id);
                    return (
                      <div 
                        key={role.role_id} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#2A9D8F] bg-opacity-5 border-[#2A9D8F] border-opacity-30 shadow-sm' 
                            : 'border-[#DEE2E6] hover:bg-[#F8F9FA]'
                        }`}
                        onClick={() => handleRoleToggle(role.role_id)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            id={`role-${role.role_id}`}
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleRoleToggle(role.role_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <label 
                          htmlFor={`role-${role.role_id}`} 
                          className="ml-3 flex-grow block text-sm font-medium capitalize cursor-pointer"
                        >
                          {role.role_name.replace(/-/g, ' ')}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Transaction Roles */}
              <div className="mb-4">
                <h5 className="text-xs uppercase tracking-wider text-[#6C757D] mb-2 border-b border-[#E9ECEF] pb-1">Transaction Management</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allRoles.filter(role => 
                    ['deposit', 'withdrawal', 'transaction'].some(term => role.role_name.includes(term))
                  ).map((role) => {
                    const isSelected = selectedRoles.includes(role.role_id);
                    return (
                      <div 
                        key={role.role_id} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#2A9D8F] bg-opacity-5 border-[#2A9D8F] border-opacity-30 shadow-sm' 
                            : 'border-[#DEE2E6] hover:bg-[#F8F9FA]'
                        }`}
                        onClick={() => handleRoleToggle(role.role_id)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            id={`role-${role.role_id}`}
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleRoleToggle(role.role_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <label 
                          htmlFor={`role-${role.role_id}`} 
                          className="ml-3 flex-grow block text-sm font-medium capitalize cursor-pointer"
                        >
                          {role.role_name.replace(/-/g, ' ')}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Other Roles */}
              <div className="mb-4">
                <h5 className="text-xs uppercase tracking-wider text-[#6C757D] mb-2 border-b border-[#E9ECEF] pb-1">Other Roles</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allRoles.filter(role => 
                    !role.role_name.includes('account') && 
                    !['deposit', 'withdrawal', 'transaction'].some(term => role.role_name.includes(term))
                  ).map((role) => {
                    const isSelected = selectedRoles.includes(role.role_id);
                    return (
                      <div 
                        key={role.role_id} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#2A9D8F] bg-opacity-5 border-[#2A9D8F] border-opacity-30 shadow-sm' 
                            : 'border-[#DEE2E6] hover:bg-[#F8F9FA]'
                        }`}
                        onClick={() => handleRoleToggle(role.role_id)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            id={`role-${role.role_id}`}
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleRoleToggle(role.role_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <label 
                          htmlFor={`role-${role.role_id}`} 
                          className="ml-3 flex-grow block text-sm font-medium capitalize cursor-pointer"
                        >
                          {role.role_name.replace(/-/g, ' ')}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#264653]">Selected Roles:</h4>
              {selectedRoles.length > 0 && (
                <span className="text-xs bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] py-1 px-2 rounded-full">
                  {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            
            {selectedRoles.length > 0 ? (
              <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#DEE2E6]">
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((roleId) => (
                    <span key={roleId} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#2A9D8F] bg-opacity-10 text-[#264653] border border-[#2A9D8F] border-opacity-20">
                      {getRoleName(roleId).replace(/-/g, ' ')}
                      <button
                        type="button"
                        onClick={() => handleRoleToggle(roleId)}
                        className="ml-2 h-5 w-5 rounded-full inline-flex items-center justify-center text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F] hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                        title="Remove role"
                      >
                        <span className="sr-only">Remove {getRoleName(roleId)}</span>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#E63946] bg-opacity-5 p-4 rounded-lg border border-[#E63946] border-opacity-20 text-center">
                <p className="text-sm text-[#E63946]">
                  <strong>Warning:</strong> No roles selected. Submitting will remove all roles from this user.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="mt-4">
              <SubmitButton isSubmitting={loading} disabled={loading || fetchingRoles}>
                {selectedRoles.length === 0 ? 'Remove All Roles' : 'Update Roles'}
              </SubmitButton>
            </div>
            {selectedRoles.length === 0 && (
              <p className="text-xs text-center text-[#E63946]">
                No roles selected. Submitting will remove all roles from this user.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default UserRoleManagement;