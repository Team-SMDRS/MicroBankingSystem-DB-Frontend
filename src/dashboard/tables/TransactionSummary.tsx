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
        
        // Format dates as YYYY-MM-DD (local timezone)
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
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
      <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
        <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-highlight" />
          </div>
          <div>
            <h3 className="section-header text-primary">Transaction Summary</h3>
            <p className="text-sm text-textSecondary">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-textSecondary" />
          <span className="ml-3 text-textSecondary font-medium">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
        <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-highlight" />
          </div>
          <div>
            <h3 className="section-header text-primary">Transaction Summary</h3>
            <p className="text-sm text-textSecondary">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12 text-red-600 font-medium">
          <AlertCircle className="w-8 h-8" />
          <span className="ml-3">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
      <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
        <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-highlight" />
        </div>
        <div>
          <h3 className="section-header text-primary">Transaction Summary</h3>
          <p className="text-sm text-textSecondary">Recent transaction history (Last 30 Days)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactionData.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-textSecondary font-medium">
            <p>No transactions found in the last 30 days</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-borderLight">
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">From Account</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">To Account</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Description</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Created by</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr key={transaction.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-sm text-textSecondary font-medium">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTransactionTypeColor(transaction.type)}`}>
                      {formatTransactionType(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {transaction.type === 'Deposit' || transaction.type === 'BankTransfer-In' ? '-' : transaction.account_no}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {transaction.type === 'Withdrawal' || transaction.type === 'BankTransfer-Out' ? '-' : transaction.account_no}
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${
                    transaction.type === 'Withdrawal' || transaction.type === 'BankTransfer-Out' 
                      ? 'text-red-700' 
                      : 'text-emerald-700'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {transaction.description || transaction.reference_no || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
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
