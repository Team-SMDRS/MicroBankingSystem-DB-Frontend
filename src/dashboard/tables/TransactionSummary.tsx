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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Transaction Summary</h3>
            <p className="text-sm text-slate-500">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-slate-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Transaction Summary</h3>
            <p className="text-sm text-slate-500">Recent transaction history (Last 30 Days)</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12 text-red-600">
          <AlertCircle className="w-8 h-8" />
          <span className="ml-3">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Transaction Summary</h3>
          <p className="text-sm text-slate-500">Recent transaction history (Last 30 Days)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactionData.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <p>No transactions found in the last 30 days</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">From Account</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">To Account</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr key={transaction.transaction_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {formatTransactionType(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {transaction.type === 'Deposit' || transaction.type === 'BankTransfer-In' ? '-' : transaction.acc_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {transaction.type === 'Withdrawal' || transaction.type === 'BankTransfer-Out' ? '-' : transaction.acc_id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {transaction.description || transaction.reference_no || '-'}
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
