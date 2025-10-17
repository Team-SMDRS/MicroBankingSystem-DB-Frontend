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
    <div className="w-full">
      {!result ? (
        <>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#264653] mb-1">Account Number</label>
              <input
                type="number"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="w-full p-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-30"
                placeholder="Enter account number"
                disabled={loading || confirming}
              />
            </div>
            {!confirming && (
              <button
                onClick={() => setConfirming(true)}
                className="px-4 py-2 bg-[#E63946] text-white rounded-lg h-[42px] hover:bg-opacity-90 transition-colors"
                disabled={!accountNo || loading}
              >
                Close Account
              </button>
            )}
          </div>
          {confirming && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#E63946]">Are you sure?</span>
              <button
                onClick={handleCloseAccount}
                className="px-3 py-1 bg-[#E63946] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                disabled={loading}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-3 py-1 border border-[#DEE2E6] rounded-lg text-[#264653] hover:bg-[#F8F9FA] transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
          {error && <div className="mt-3 text-[#E63946] text-sm">{error}</div>}
        </>
      ) : (
        <div className="bg-[#2A9D8F] bg-opacity-5 border border-[#2A9D8F] border-opacity-20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-[#264653] mb-2">{result.msg}</h4>
          <div className="mb-1"><span className="font-medium text-[#264653]">Account Number:</span> <span className="font-mono text-[#2A9D8F]">{result.account_no}</span></div>
          <div className="mb-1"><span className="font-medium text-[#264653]">Previous Balance:</span> <span className="text-[#38B000]">Rs. {result.previous_balance}</span></div>
          <div className="mb-1"><span className="font-medium text-[#264653]">Savings Plan:</span> <span className="text-[#264653]">{result.savings_plan_name}</span></div>
          <div className="mb-1"><span className="font-medium text-[#264653]">Status:</span> <span className="capitalize text-[#E63946]">{result.status}</span></div>
          <div className="mb-1"><span className="font-medium text-[#264653]">Closed At:</span> <span className="text-[#264653]">{new Date(result.updated_at).toLocaleString()}</span></div>
          <button className="mt-4 px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238579] transition-colors" onClick={() => { setResult(null); setAccountNo(''); }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CloseAccountAction;
