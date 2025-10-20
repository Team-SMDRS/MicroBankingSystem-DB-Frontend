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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fdAccountNo" className="block text-sm font-semibold text-slate-700 mb-2">
            Fixed Deposit Account Number
          </label>
          <input
            type="text"
            id="fdAccountNo"
            value={fdAccountNo}
            onChange={(e) => setFdAccountNo(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            required
            placeholder="Enter fixed deposit account number"
          />
        </div>

        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            Warning: Closing a fixed deposit before maturity may result in reduced interest earnings.
            Please confirm that you want to proceed with closing this fixed deposit account.
          </p>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !fdAccountNo}
            className="w-full py-3 rounded-lg font-medium text-white text-lg bg-red-600 hover:bg-red-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Closing Fixed Deposit...' : 'Close Fixed Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export { CloseFDForm };