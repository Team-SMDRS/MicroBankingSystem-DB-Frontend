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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Assign Branch</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Branch assigned successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Assigning branch for: <span className="font-medium">{user.first_name} {user.last_name}</span>
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                Select Branch
              </label>
              <select
                id="branch"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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