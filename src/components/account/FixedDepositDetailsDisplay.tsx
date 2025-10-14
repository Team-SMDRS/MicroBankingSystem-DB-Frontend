import { useEffect, useState } from 'react';
import { getFixedDeposit, getFDSavingsAccount, formatDate, formatCurrency } from '../../api/fd';
import Alert from '../common/Alert';
import LoadingState from '../common/LoadingState';

interface FixedDepositDetailsDisplayProps {
  fdAccountNo: number;
}

const FixedDepositDetailsDisplay = ({ fdAccountNo }: FixedDepositDetailsDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fdDetails, setFDDetails] = useState<any>(null);
  const [savingsDetails, setSavingsDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both FD and linked savings account details
        const [fdData, savingsData] = await Promise.all([
          getFixedDeposit(fdAccountNo),
          getFDSavingsAccount(fdAccountNo)
        ]);
        
        setFDDetails(fdData);
        setSavingsDetails(savingsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch fixed deposit details');
      } finally {
        setLoading(false);
      }
    };

    if (fdAccountNo) {
      fetchDetails();
    }
  }, [fdAccountNo]);

  return (
    <LoadingState
      loading={loading}
      error={error}
      loadingMessage="Loading fixed deposit details..."
    >
      {!fdDetails ? (
        <Alert type="warning">No fixed deposit details found</Alert>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Fixed Deposit Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">FD Account Number</p>
              <p className="font-medium">{fdDetails.fd_account_no}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Balance</p>
              <p className="font-medium">{formatCurrency(fdDetails.balance)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Opening Date</p>
              <p className="font-medium">{formatDate(fdDetails.opened_date)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Maturity Date</p>
              <p className="font-medium">{formatDate(fdDetails.maturity_date)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Interest Rate</p>
              <p className="font-medium">{fdDetails.plan_interest_rate}%</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Duration (Months)</p>
              <p className="font-medium">{fdDetails.plan_duration}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Branch</p>
              <p className="font-medium">{fdDetails.branch_name}</p>
            </div>
          </div>

          {savingsDetails && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3">Linked Savings Account</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Account Number</p>
                  <p className="font-medium">{savingsDetails.account_no}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Balance</p>
                  <p className="font-medium">{formatCurrency(savingsDetails.balance)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium capitalize">{savingsDetails.status}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Opening Date</p>
                  <p className="font-medium">{formatDate(savingsDetails.opened_date)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </LoadingState>
  );
};

export default FixedDepositDetailsDisplay;