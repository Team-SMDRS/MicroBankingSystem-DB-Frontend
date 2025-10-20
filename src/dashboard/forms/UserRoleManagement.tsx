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
    <div className="bg-white shadow-md rounded-2xl p-8 border border-borderLight animate-slide-in-right">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary">Manage User Roles</h3>
        <p className="text-sm text-secondary">Assign roles to {user.first_name} {user.last_name}</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="mb-6 p-4 bg-secondary/10 border border-borderLight rounded-2xl">
        <p className="text-sm text-secondary">
          <strong>Instructions:</strong> Click on the role boxes below to select or deselect permissions for this user. 
          Selected roles will appear in the "Selected Roles" section. If you want to remove all roles from this user, 
          deselect all roles and click "Remove All Roles".
        </p>
      </div>

      {fetchingRoles ? (
        <div className="py-4 text-center">
          <p className="text-tertiary">Loading roles...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-primary mb-4">Available Roles:</h4>
            
            {/* Group roles into categories */}
            <div className="space-y-6">
              {/* Account Management Roles */}
              <div className="mb-4">
                <h5 className="text-xs uppercase tracking-wider text-secondary mb-2 border-b border-borderLight pb-2">Account Management</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allRoles.filter(role => role.role_name.includes('account')).map((role) => {
                    const isSelected = selectedRoles.includes(role.role_id);
                    return (
                      <div 
                        key={role.role_id} 
                        className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-secondary/10 border-secondary shadow-sm' 
                            : 'border-borderLight hover:bg-background'
                        }`}
                        onClick={() => handleRoleToggle(role.role_id)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            id={`role-${role.role_id}`}
                            type="checkbox"
                            className="h-5 w-5 text-secondary focus:ring-secondary border-borderLight rounded cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleRoleToggle(role.role_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <label 
                          htmlFor={`role-${role.role_id}`} 
                          className="ml-3 flex-grow block text-sm font-medium capitalize cursor-pointer text-primary"
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
                <h5 className="text-xs uppercase tracking-wider text-secondary mb-2 border-b border-borderLight pb-2">Transaction Management</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allRoles.filter(role => 
                    ['deposit', 'withdrawal', 'transaction'].some(term => role.role_name.includes(term))
                  ).map((role) => {
                    const isSelected = selectedRoles.includes(role.role_id);
                    return (
                      <div 
                        key={role.role_id} 
                        className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-secondary/10 border-secondary shadow-sm' 
                            : 'border-borderLight hover:bg-background'
                        }`}
                        onClick={() => handleRoleToggle(role.role_id)}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            id={`role-${role.role_id}`}
                            type="checkbox"
                            className="h-5 w-5 text-secondary focus:ring-secondary border-borderLight rounded cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleRoleToggle(role.role_id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <label 
                          htmlFor={`role-${role.role_id}`} 
                          className="ml-3 flex-grow block text-sm font-medium capitalize cursor-pointer text-primary"
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
                <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Other Roles</h5>
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
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'border-gray-200 hover:bg-gray-50'
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
              <h4 className="text-sm font-medium text-gray-700">Selected Roles:</h4>
              {selectedRoles.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            
            {selectedRoles.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((roleId) => (
                    <span key={roleId} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {getRoleName(roleId).replace(/-/g, ' ')}
                      <button
                        type="button"
                        onClick={() => handleRoleToggle(roleId)}
                        className="ml-2 h-5 w-5 rounded-full inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200"
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
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                <p className="text-sm text-amber-700">
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
              <p className="text-xs text-center text-amber-600">
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