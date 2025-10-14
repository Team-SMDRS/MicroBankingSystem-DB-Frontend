import { useState, useEffect } from 'react';
import { getMaturedFixedDeposits, formatDate, formatCurrency } from '../../api/fd';
import Alert from '../common/Alert';

const MaturedFixedDepositList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maturedFDs, setMaturedFDs] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaturedFDs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fds = await getMaturedFixedDeposits();
        setMaturedFDs(fds);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch matured fixed deposits');
      } finally {
        setLoading(false);
      }
    };

    fetchMaturedFDs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading matured fixed deposits...</div>;
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  if (maturedFDs.length === 0) {
    return <Alert type="info">No matured fixed deposits found.</Alert>;
  }

  return (
    <div className="space-y-4">
      {maturedFDs.map((fd) => (
        <div
          key={fd.fd_account_no}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-md"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">FD Account Number</p>
              <p className="font-medium">{fd.fd_account_no}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Balance</p>
              <p className="font-medium">{formatCurrency(fd.balance)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Opening Date</p>
              <p className="font-medium">{formatDate(fd.opened_date)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Maturity Date</p>
              <p className="font-medium">{formatDate(fd.maturity_date)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Interest Rate</p>
              <p className="font-medium">{fd.plan_interest_rate}%</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Duration</p>
              <p className="font-medium">{fd.plan_duration} months</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Branch</p>
              <p className="font-medium">{fd.branch_name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Linked Account</p>
              <p className="font-medium">{fd.account_no}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-md"
              onClick={() => {
                // TODO: Implement withdrawal functionality
                alert('Withdrawal functionality coming soon!');
              }}
            >
              Withdraw to Savings Account
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaturedFixedDepositList;