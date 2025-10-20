import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { authApi } from '../../../api/auth';
import { branchApi } from '../../../api/branches';
import type { User } from './types';

interface AssignBranchModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

// Use the BranchDetails interface from the API
import type { BranchDetails } from '../../../api/branches';

const AssignBranchModal: React.FC<AssignBranchModalProps> = ({ user, onClose, onSuccess }) => {
  const [branches, setBranches] = useState<BranchDetails[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch all branches and the user's current branch when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchesData = await branchApi.getAll();
        setBranches(branchesData);
        
        // Fetch user's current branch
        try {
          const userBranchInfo = await authApi.getUserBranch(user.user_id);
          if (userBranchInfo && userBranchInfo.branch_id) {
            setSelectedBranchId(userBranchInfo.branch_id);
          }
        } catch (branchError) {
          // If user doesn't have a branch assigned, just continue
          console.log("User might not have a branch assigned yet");
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setError('Failed to load branches. Please try again later.');
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) {
      setError('Please select a branch');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.assignBranchToUser(user.user_id, selectedBranchId);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error assigning branch:', error);
      setError('Failed to assign branch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 w-full max-w-md animate-slide-in-right">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">Assign Branch</h2>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-secondary transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
            Branch assigned successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-secondary mb-2">
                Assigning branch for: <span className="font-medium text-primary">{user.first_name} {user.last_name}</span>
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="branch" className="label-text">
                Select Branch
              </label>
              <select
                id="branch"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="input-field w-full"
                disabled={isLoading}
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name || branch.branch_name || 'Unknown Branch'} ({branch.address || 'No address'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="button-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Assigning...' : 'Assign Branch'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignBranchModal;