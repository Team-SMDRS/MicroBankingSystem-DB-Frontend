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
      
      // Format dates as YYYY-MM-DD (local timezone)
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
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
      <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
        <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-highlight" />
          </div>
          <div>
            <h3 className="section-header text-primary">Account Summary</h3>
            <p className="text-sm text-secondary">Enter account number to view details and transactions (Last 30 Days)</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-background">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter account number (e.g. 123456789)"
                className="input-field w-full"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="button-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
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
            <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Details Section */}
      {accountDetails && (
        <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
          <div className="p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
            <h3 className="text-xl font-bold text-primary">Account Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="label-text">Account Number</p>
              <p className="text-lg font-semibold text-primary">{accountDetails.account_no}</p>
            </div>
            <div>
              <p className="label-text">Account Type</p>
              <p className="text-lg font-semibold text-primary">{accountDetails.account_type}</p>
            </div>
            <div>
              <p className="label-text">Account Holder</p>
              <p className="text-lg font-semibold text-primary">{accountDetails.customer_names}</p>
            </div>
            <div>
              <p className="label-text">Balance</p>
              <p className="text-lg font-semibold text-emerald-600">{formatAmount(accountDetails.balance)}</p>
            </div>
            <div>
              <p className="label-text">Branch</p>
              <p className="text-lg font-semibold text-primary">{accountDetails.branch_name}</p>
            </div>
            <div>
              <p className="label-text">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                accountDetails.status.toLowerCase() === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {accountDetails.status}
              </span>
            </div>
            <div>
              <p className="label-text">Created Date</p>
              <p className="text-lg font-semibold text-primary">{formatDate(accountDetails.created_date)}</p>
            </div>
            <div>
              <p className="label-text">Phone</p>
              <p className="text-lg font-semibold text-primary">{accountDetails.customer_phone_numbers || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      {transactions && (
        <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
          <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
            <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-highlight" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Transaction History</h3>
              <p className="text-sm text-secondary">Last 30 days • {transactions.total_count} transactions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {transactions.transactions.length === 0 ? (
              <div className="flex items-center justify-center p-12 text-secondary font-medium">
                <p>No transactions found in the last 30 days</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-background border-b border-borderLight">
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Balance After</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.transactions.map((transaction) => (
                    <tr key={transaction.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                      <td className="px-6 py-4 text-sm text-secondary font-medium">{formatDate(transaction.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.type === 'Deposit' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : transaction.type === 'Withdrawal'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold ${
                        ['Deposit', 'Interest', 'BankTransfer-In'].includes(transaction.type) ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {['Deposit', 'Interest', 'BankTransfer-In'].includes(transaction.type) ? '+' : '-'}{formatAmount(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {transaction.balance_after !== undefined && transaction.balance_after !== null
                          ? formatAmount(transaction.balance_after)
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
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
