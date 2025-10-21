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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 w-full max-w-md animate-slide-in-right">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Reset Password</h3>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-textSecondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {resetSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary">Password Reset Successful</h3>
            <p className="mt-2 text-sm text-textSecondary">
              The password for {username} has been reset successfully.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-textSecondary mb-4">
                Enter a new password for user <span className="font-medium text-primary">{username}</span>
              </p>
              <div className="mb-4">
                <label htmlFor="newPassword" className="label-text">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="button-primary"
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