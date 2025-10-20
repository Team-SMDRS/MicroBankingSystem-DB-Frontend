import React from 'react';
import { accountApi } from '../../api/accounts';

const CloseAccountAction: React.FC = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [confirming, setConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCloseAccount = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await accountApi.closeAccount(Number(accountNo));
      setResult(res);
    } catch (err: any) {
      const errorDetail = err?.response?.data?.detail;
      if (errorDetail === "Account is already closed") {
        setError("This account is already closed");
      } else if (errorDetail === "Cannot close account because it has an active fixed deposit linked to it") {
        setError("Cannot close account because it has an active fixed deposit linked to it");
      } else {
        setError(err?.response?.data?.msg || err?.response?.data?.detail || 'Failed to close account');
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      {!result ? (
        <>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="label-text">Account Number</label>
              <input
                type="number"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="input-field w-full"
                placeholder="Enter account number"
                disabled={loading || confirming}
              />
            </div>
            {!confirming && (
              <button
                onClick={() => setConfirming(true)}
                className="button-primary px-4 py-2 h-[42px]"
                disabled={!accountNo || loading}
              >
                Close Account
              </button>
            )}
          </div>
          {confirming && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-700">Are you sure?</span>
              <button
                onClick={handleCloseAccount}
                className="button-primary px-3 py-1"
                disabled={loading}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="button-secondary px-3 py-1"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
          {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
        </>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-emerald-700 mb-2">{result.msg}</h4>
          <div className="mb-1"><span className="font-semibold text-primary">Account Number:</span> <span className="font-mono text-secondary">{result.account_no}</span></div>
          <div className="mb-1"><span className="font-semibold text-primary">Previous Balance:</span> <span className="text-secondary">Rs. {result.previous_balance}</span></div>
          <div className="mb-1"><span className="font-semibold text-primary">Savings Plan:</span> <span className="text-secondary">{result.savings_plan_name}</span></div>
          <div className="mb-1"><span className="font-semibold text-primary">Status:</span> <span className="capitalize text-secondary">{result.status}</span></div>
          <div className="mb-1"><span className="font-semibold text-primary">Closed At:</span> <span className="text-secondary">{new Date(result.updated_at).toLocaleString()}</span></div>
          <button className="button-primary mt-4 px-4 py-2" onClick={() => { setResult(null); setAccountNo(''); }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CloseAccountAction;
