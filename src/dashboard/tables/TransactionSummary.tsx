import { useEffect, useState } from 'react';
import { TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { transactionApi } from '../../api/transactions';
import { formatTransactionType, getTransactionTypeColor, formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionData {
  transaction_id: string;
  amount: number;
  acc_id: string;
  type: string;
  description: string;
  reference_no: string;
  created_at: string;
  created_by: string;
  balance_after: number;
  account_no: string;
  username: string;
}

const TransactionSummary = () => {
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calculate date 30 days ago
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        
        const response = await transactionApi.getAllTransactions({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          per_page: 100
        });
        
        setTransactionData(response.transactions || []);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.response?.data?.detail || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#2A9D8F] overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b border-[#E9ECEF]">
          <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#2A9D8F]" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-[#264653]">Transaction Summary</h3>
            <p className="text-sm text-[#6C757D]">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#2A9D8F] animate-spin" />
          <span className="ml-3 text-[#6C757D]">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#2A9D8F] overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b border-[#E9ECEF]">
          <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#2A9D8F]" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-[#264653]">Transaction Summary</h3>
            <p className="text-sm text-[#6C757D]">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12 text-[#E63946]">
          <AlertCircle className="w-8 h-8" />
          <span className="ml-3">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#2A9D8F] overflow-hidden">
      <div className="flex items-center gap-4 p-6 border-b border-[#E9ECEF]">
        <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-[#2A9D8F]" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#264653]">Transaction Summary</h3>
          <p className="text-sm text-[#6C757D]">Recent transaction history (Last 30 Days)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactionData.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-[#6C757D]">
            <p>No transactions found in the last 30 days</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E9ECEF]">
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Date</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Type</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">From Account</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">To Account</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Amount</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Description</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Created by</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr key={transaction.transaction_id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#264653]">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {formatTransactionType(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#264653]">
                    {transaction.type === 'Deposit' || transaction.type === 'BankTransfer-In' ? '-' : transaction.account_no}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#264653]">
                    {transaction.type === 'Withdrawal' || transaction.type === 'BankTransfer-Out' ? '-' : transaction.account_no}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#38B000]">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#264653]">
                    {transaction.description || transaction.reference_no || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#264653]">
                    {transaction.username || transaction.created_by || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;
