import { useState, useEffect } from 'react';
import { getSavingsAccountFDs } from '../../api/fd';
import Alert from '../common/Alert';

interface FixedDepositListProps {
  savingsAccountNo: number;
  onSelectFD: (fdAccountNo: number) => void;
}

const FixedDepositList = ({ savingsAccountNo, onSelectFD }: FixedDepositListProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixedDeposits, setFixedDeposits] = useState<any[]>([]);

  useEffect(() => {
    const fetchFDs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fds = await getSavingsAccountFDs(savingsAccountNo);
        setFixedDeposits(fds);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch fixed deposits');
      } finally {
        setLoading(false);
      }
    };

    if (savingsAccountNo) {
      fetchFDs();
    }
  }, [savingsAccountNo]);

  if (loading) {
    return <div className="p-4">Loading fixed deposits...</div>;
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  if (fixedDeposits.length === 0) {
    return <Alert type="info">No fixed deposits found for this savings account.</Alert>;
  }

  return (
    <div className="grid gap-4">
      {fixedDeposits.map((fd) => (
        <button
          key={fd.fd_account_no}
          onClick={() => onSelectFD(fd.fd_account_no)}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all text-left"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-800">FD Account: {fd.fd_account_no}</p>
              <p className="text-sm text-slate-600">Balance: {fd.balance}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Interest Rate: {fd.plan_interest_rate}%</p>
              <p className="text-xs text-slate-400">Duration: {fd.plan_duration} months</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FixedDepositList;