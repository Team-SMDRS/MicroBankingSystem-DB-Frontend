import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface PasswordResetModalProps {
  username: string;
  onClose: () => void;
  onSubmit: (password: string) => Promise<{success: boolean; message: string}>;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ username, onClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (!newPassword.trim()) return;
    
    const result = await onSubmit(newPassword.trim());
    if (result?.success) {
      setResetSuccess(true);
      // Reset form after success
      setNewPassword('');
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {resetSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
            <p className="mt-2 text-sm text-gray-500">
              The password for {username} has been reset successfully.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Enter a new password for user <span className="font-medium">{username}</span>
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
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
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
  );
};

export default PasswordResetModal;