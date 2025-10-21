import React, { useState, useEffect } from 'react';
import { ArrowLeft, Pencil, XCircle, CheckCircle, Key, Building2 as Building } from 'lucide-react';
import type { User, UserStatus } from './types';
import { authApi } from '../../../api/auth';
import AssignBranchModal from './AssignBranchModal';

interface UserProfileViewProps {
  user: User;
  userStatus: UserStatus | undefined;
  isLoadingStatus: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
  onManageRoles: (user: User) => void;
  onToggleStatus: (userId: string) => void;
  onResetPassword: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  userStatus,
  isLoadingStatus,
  onClose,
  onUpdate,
  onManageRoles,
  onToggleStatus,
  onResetPassword
}) => {
  const [branchName, setBranchName] = useState<string>("");
  const [isLoadingBranch, setIsLoadingBranch] = useState<boolean>(false);
  const [showAssignBranchModal, setShowAssignBranchModal] = useState<boolean>(false);

  const fetchBranchInfo = async () => {
    if (user && user.user_id) {
      setIsLoadingBranch(true);
      try {
        const branchInfo = await authApi.getUserBranch(user.user_id);
        setBranchName(branchInfo.branch_name);
      } catch (error) {
        console.error("Error fetching branch information:", error);
      } finally {
        setIsLoadingBranch(false);
      }
    }
  };

  useEffect(() => {
    fetchBranchInfo();
  }, [user]);

  const handleAssignBranchSuccess = () => {
    // Refresh branch information after assignment
    fetchBranchInfo();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">User Profile</h2>
        <button 
          onClick={onClose}
          className="text-tertiary hover:text-textSecondary p-1 rounded-full hover:bg-background flex items-center transition-colors"
          title="Back to list"
        >
          <ArrowLeft size={20} />
          <span className="ml-1">Back</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - User profile card */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-borderLight p-6">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-tertiary mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary text-2xl font-bold">
                  {user.first_name[0]}{user.last_name[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-primary">{user.first_name} {user.last_name}</h3>
              <p className="text-textSecondary text-sm">@{user.username}</p>
              <p className="text-textSecondary text-sm mt-1">
                User since {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
              </p>
            </div>
            
            <div className="mt-6">
              {/* User Status */}
              <div className="mb-4 text-center">
                <p className="text-sm text-textSecondary mb-1">Status</p>
                {isLoadingStatus ? (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-background text-textSecondary">
                      Loading...
                    </span>
                  </div>
                ) : userStatus?.is_active ? (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span
                      key={role.role_id}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-tertiary text-primary"
                    >
                      {role.role_name}
                    </span>
                  ))
                ) : (
                  <span className="text-textSecondary">No roles assigned</span>
                )}
              </div>
              
              <div className="space-y-2 mt-6">
                <button
                  onClick={() => onUpdate(user)}
                  className="w-full bg-secondary text-white hover:bg-primary py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Pencil size={16} />
                  <span>Update User Details</span>
                </button>
                
                <button
                  onClick={() => onManageRoles(user)}
                  className="w-full bg-secondary text-white hover:bg-primary py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <span>Manage User Roles</span>
                </button>
                
                {!isLoadingStatus && userStatus?.is_active && (
                  <button
                    onClick={() => onToggleStatus(user.user_id)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                    disabled={isLoadingStatus}
                  >
                    <XCircle size={16} />
                    <span>{isLoadingStatus ? 'Processing...' : 'Deactivate User'}</span>
                  </button>
                )}
                
                {!isLoadingStatus && userStatus && !userStatus.is_active && (
                  <button
                    onClick={() => onToggleStatus(user.user_id)}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                    disabled={isLoadingStatus}
                  >
                    <CheckCircle size={16} />
                    <span>{isLoadingStatus ? 'Processing...' : 'Activate User'}</span>
                  </button>
                )}
                
                <button
                  onClick={onResetPassword}
                  className="w-full bg-highlight hover:bg-highlightHover text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
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
          <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-background border-b border-borderLight">
              <h3 className="text-lg leading-6 font-semibold text-primary">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-textSecondary">Personal details and user information.</p>
            </div>
            <div className="border-t border-borderLight">
              <dl>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Full name</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.first_name} {user.last_name}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Username</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.username}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">NIC</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.nic || '-'}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Email address</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.email || '-'}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Phone number</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.phone_number || '-'}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Address</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">{user.address || '-'}</dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Date of birth</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 font-medium">
                    {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                  </dd>
                </div>
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-borderLight">
                  <dt className="text-sm font-medium text-textSecondary">Branch</dt>
                  <dd className="mt-1 text-sm text-primary sm:mt-0 sm:col-span-2 flex justify-between items-center font-medium">
                    <span>
                      {isLoadingBranch ? (
                        <span className="text-textSecondary">Loading...</span>
                      ) : (
                        branchName || '-'
                      )}
                    </span>
                    <button
                      onClick={() => setShowAssignBranchModal(true)}
                      className="text-sm bg-secondary text-white hover:bg-primary py-1 px-2 rounded-lg flex items-center gap-1 transition-colors"
                      title={branchName ? "Update Branch" : "Assign Branch"}
                    >
                      <Building size={14} />
                      <span>{branchName ? "Update Branch" : "Assign Branch"}</span>
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Assignment Modal */}
      {showAssignBranchModal && (
        <AssignBranchModal 
          user={user}
          onClose={() => setShowAssignBranchModal(false)}
          onSuccess={handleAssignBranchSuccess}
        />
      )}
    </div>
  );
};

export default UserProfileView;