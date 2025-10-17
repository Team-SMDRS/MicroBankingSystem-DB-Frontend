import { useState } from 'react';
import { FileText, Search, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { accountApi, type AccountDetails } from '../../api/accounts';
import { transactionApi } from '../../api/transactions';

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

interface AccountTransactionData {
  acc_id: string;
  transactions: TransactionData[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  current_balance: number;
}

const AccountSummary = () => {
  const [accountNo, setAccountNo] = useState('');
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [transactions, setTransactions] = useState<AccountTransactionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search
  const handleSearch = async () => {
    if (!accountNo.trim()) {
      setError('Please enter an account number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch account details
      const accDetails = await accountApi.getDetails(Number(accountNo));
      setAccountDetails(accDetails);
      
      // Calculate date 30 days ago
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      // Fetch transactions for the account
      const response = await transactionApi.getAllTransactions({
        acc_id: accDetails.account_id,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        per_page: 100
      });
      
      // Calculate balance_after for each transaction if not provided
      if (response.transactions && response.transactions.length > 0) {
        const currentBalance = accDetails.balance;
        const sortedTransactions = [...response.transactions].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        // Calculate balance backwards from current balance
        let runningBalance = currentBalance;
        for (let i = sortedTransactions.length - 1; i >= 0; i--) {
          const transaction = sortedTransactions[i];
          if (!transaction.balance_after || transaction.balance_after === 0) {
            // If balance_after is not provided, calculate it
            transaction.balance_after = runningBalance;
          }
          // Update running balance for next transaction (going backwards)
          if (transaction.type === 'Deposit') {
            runningBalance -= transaction.amount;
          } else if (transaction.type === 'Withdrawal') {
            runningBalance += transaction.amount;
          }
        }
        
        // Sort back to descending order (newest first)
        response.transactions = sortedTransactions.reverse();
      }
      
      setTransactions(response);
    } catch (err: any) {
      console.error('Error fetching account data:', err);
      setError(err.response?.data?.detail || 'Failed to load account data');
      setAccountDetails(null);
      setTransactions(null);
    } finally {
      setLoading(false);
    }
  };

  // Format amount to LKR currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#2A9D8F] overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-[#DEE2E6] bg-gradient-to-r from-[#F8F9FA] to-white">
          <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#2A9D8F]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#264653]">Account Summary</h3>
            <p className="text-sm text-[#6C757D]">Enter account number to view details and transactions (Last 30 Days)</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-[#F8F9FA]">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter account number (e.g. 123456789)"
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#264653] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-[#E63946] bg-[#E63946]/10 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Details Section */}
      {accountDetails && (
        <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#2A9D8F] overflow-hidden">
          <div className="p-6 border-b border-[#DEE2E6] bg-gradient-to-r from-[#F8F9FA] to-white">
            <h3 className="text-xl font-bold text-[#264653]">Account Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[#6C757D]">Account Number</p>
              <p className="text-lg font-semibold text-[#264653]">{accountDetails.account_no}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Account Type</p>
              <p className="text-lg font-semibold text-[#264653]">{accountDetails.account_type}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Account Holder</p>
              <p className="text-lg font-semibold text-[#264653]">{accountDetails.customer_names}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Balance</p>
              <p className="text-lg font-semibold text-[#38B000]">{formatAmount(accountDetails.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Branch</p>
              <p className="text-lg font-semibold text-[#264653]">{accountDetails.branch_name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                accountDetails.status.toLowerCase() === 'active' 
                  ? 'bg-[#38B000]/20 text-[#38B000]' 
                  : 'bg-[#E63946]/20 text-[#E63946]'
              }`}>
                {accountDetails.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Created Date</p>
              <p className="text-lg font-semibold text-[#264653]">{formatDate(accountDetails.created_date)}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Phone</p>
              <p className="text-lg font-semibold text-[#264653]">{accountDetails.customer_phone_numbers || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      {transactions && (
        <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#2A9D8F] overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-[#DEE2E6] bg-gradient-to-r from-[#F8F9FA] to-white">
            <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#2A9D8F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#264653]">Transaction History</h3>
              <p className="text-sm text-[#6C757D]">Last 30 days • {transactions.total_count} transactions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {transactions.transactions.length === 0 ? (
              <div className="flex items-center justify-center p-12 text-[#6C757D]">
                <p>No transactions found in the last 30 days</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Balance After</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#264653]">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.transactions.map((transaction) => (
                    <tr key={transaction.transaction_id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#264653]">{formatDate(transaction.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Deposit' 
                            ? 'bg-[#38B000]/20 text-[#38B000]' 
                            : transaction.type === 'Withdrawal'
                            ? 'bg-[#E63946]/20 text-[#E63946]'
                            : 'bg-[#2A9D8F]/20 text-[#2A9D8F]'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${
                        transaction.type === 'Deposit' ? 'text-[#38B000]' : 'text-[#E63946]'
                      }`}>
                        {transaction.type === 'Deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#264653]">
                        {transaction.balance_after !== undefined && transaction.balance_after !== null
                          ? formatAmount(transaction.balance_after)
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-[#264653]">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6C757D]">
                        {transaction.reference_no || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSummary;
