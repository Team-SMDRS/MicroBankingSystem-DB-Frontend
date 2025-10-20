import React, { useState } from 'react';
import { closeFixedDeposit, type CloseFDResponse } from '../../api/fd';

interface CloseFDFormProps {
  onSuccess: (response: CloseFDResponse) => void;
  onError: (error: string) => void;
}

const CloseFDForm = ({ onSuccess, onError }: CloseFDFormProps) => {
  const [fdAccountNo, setFdAccountNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fdAccountNo) return;

    setLoading(true);
    try {
      const response = await closeFixedDeposit(fdAccountNo);
      onSuccess(response);
      setFdAccountNo('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to close fixed deposit';
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fdAccountNo" className="label-text">
            Fixed Deposit Account Number
          </label>
          <input
            type="text"
            id="fdAccountNo"
            value={fdAccountNo}
            onChange={(e) => setFdAccountNo(e.target.value)}
            className="input-field w-full"
            required
            placeholder="Enter fixed deposit account number"
          />
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-amber-800 font-medium">
            Warning: Closing a fixed deposit before maturity may result in reduced interest earnings.
            Please confirm that you want to proceed with closing this fixed deposit account.
          </p>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !fdAccountNo}
            className="button-primary w-full py-3"
          >
            {loading ? 'Closing Fixed Deposit...' : 'Close Fixed Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export { CloseFDForm };