import { useState } from 'react';
import { Building2, Search, Loader2, AlertCircle, TrendingUp, TrendingDown, ArrowRightLeft, X, ExternalLink } from 'lucide-react';
import { branchApi, type BranchDetails, type BranchTransactionReport } from '../../api/branches';
import { transactionApi } from '../../api/transactions';

interface TransactionDetail {
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

const BranchSummary = () => {
  const [branchId, setBranchId] = useState('');
  const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(null);
  const [branchReport, setBranchReport] = useState<BranchTransactionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for transaction details
  const [selectedAccount, setSelectedAccount] = useState<{
    acc_id: string;
    acc_holder_name: string;
  } | null>(null);
  const [accountTransactions, setAccountTransactions] = useState<TransactionDetail[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!branchId.trim()) {
      setError('Please enter a branch ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch branch details
      const details = await branchApi.getById(branchId);
      setBranchDetails(details);
      
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
      
      // Fetch branch transaction report for last 30 days
      const report = await branchApi.getBranchTransactionReport(branchId, {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      });
      
      setBranchReport(report);
    } catch (err: any) {
      console.error('Error fetching branch data:', err);
      setError(err.response?.data?.detail || 'Failed to load branch data. Please check the branch ID.');
      setBranchDetails(null);
      setBranchReport(null);
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
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle account click to view transactions
  const handleAccountClick = async (accId: string, accHolderName: string) => {
    try {
      setLoadingTransactions(true);
      setSelectedAccount({ acc_id: accId, acc_holder_name: accHolderName });
      
      // Calculate date 30 days ago
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Format dates as YYYY-MM-DD (local timezone)
      const formatDateStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      // Fetch transactions for the account
      const response = await transactionApi.getAllTransactions({
        acc_id: accId,
        start_date: formatDateStr(startDate),
        end_date: formatDateStr(endDate),
        per_page: 100
      });
      
      setAccountTransactions(response.transactions || []);
    } catch (err: any) {
      console.error('Error fetching account transactions:', err);
      alert('Failed to load transaction details');
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedAccount(null);
    setAccountTransactions([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Branch Summary</h3>
            <p className="text-sm text-slate-500">Enter branch ID to view transaction statistics (Last 30 Days)</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-slate-50">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter branch ID (e.g., BR001, b5c3a0d2-...)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
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
            <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Branch Details Section */}
      {branchDetails && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-xl font-bold text-slate-800">Branch Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500">Branch Name</p>
              <p className="text-lg font-semibold text-slate-800">{branchDetails.branch_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Branch ID</p>
              <p className="text-lg font-semibold text-slate-800">{branchDetails.branch_id}</p>
            </div>
            {branchDetails.branch_code && (
              <div>
                <p className="text-sm text-slate-500">Branch Code</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.branch_code}</p>
              </div>
            )}
            {branchDetails.city && (
              <div>
                <p className="text-sm text-slate-500">City</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.city}</p>
              </div>
            )}
            {branchDetails.address && (
              <div>
                <p className="text-sm text-slate-500">Address</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.address}</p>
              </div>
            )}
            {branchDetails.contact_number && (
              <div>
                <p className="text-sm text-slate-500">Contact</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.contact_number}</p>
              </div>
            )}
            {branchDetails.manager_name && (
              <div>
                <p className="text-sm text-slate-500">Manager</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.manager_name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Statistics Section */}
      {branchReport && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Deposits Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-200 px-2 py-1 rounded-full">
                  Deposits
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-900 mb-1">
                {formatAmount(branchReport.total_deposits)}
              </p>
              <p className="text-sm text-emerald-700">Total Deposits</p>
            </div>

            {/* Total Withdrawals Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg border border-red-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-red-700 bg-red-200 px-2 py-1 rounded-full">
                  Withdrawals
                </span>
              </div>
              <p className="text-2xl font-bold text-red-900 mb-1">
                {formatAmount(branchReport.total_withdrawals)}
              </p>
              <p className="text-sm text-red-700">Total Withdrawals</p>
            </div>

            {/* Total Transfers Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                  Transfers
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mb-1">
                {formatAmount(branchReport.total_transfers)}
              </p>
              <p className="text-sm text-blue-700">Total Transfers</p>
            </div>

            {/* Transaction Count Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                  Count
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mb-1">
                {branchReport.transaction_count.toLocaleString()}
              </p>
              <p className="text-sm text-purple-700">Total Transactions</p>
            </div>
          </div>

          {/* Net Amount Card */}
          <div className={`rounded-2xl shadow-xl border p-6 ${
            (branchReport.net_amount ?? 0) >= 0 
              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${
                  (branchReport.net_amount ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  Net Amount (Last 30 Days)
                </p>
                <p className={`text-3xl font-bold ${
                  (branchReport.net_amount ?? 0) >= 0 ? 'text-emerald-900' : 'text-red-900'
                }`}>
                  {branchReport.net_amount !== null && branchReport.net_amount !== undefined && !isNaN(branchReport.net_amount)
                    ? formatAmount(branchReport.net_amount)
                    : formatAmount(0)
                  }
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {branchReport.date_range.start_date} to {branchReport.date_range.end_date}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                (branchReport.net_amount ?? 0) >= 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {(branchReport.net_amount ?? 0) >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-white" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Top Accounts Section */}
          {branchReport.all_accounts && branchReport.all_accounts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="text-xl font-bold text-slate-800">All Active Accounts</h3>
                <p className="text-sm text-slate-500">All active accounts in this branch (Last 30 Days)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account Holder</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Transactions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchReport.all_accounts.map((account) => (
                      <tr key={account.acc_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {account.acc_holder_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                          {account.acc_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {account.transaction_count} transactions
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleAccountClick(account.acc_id, account.acc_holder_name || 'N/A')}
                            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            {formatAmount(account.total_volume)}
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transaction Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Transaction Details</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedAccount.acc_holder_name} • Account: {selectedAccount.acc_id}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingTransactions ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-slate-600">Loading transactions...</span>
                </div>
              ) : accountTransactions.length === 0 ? (
                <div className="flex items-center justify-center p-12 text-slate-500">
                  <p>No transactions found for this account in the last 30 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-700 mb-1">Total Transactions</p>
                      <p className="text-2xl font-bold text-blue-900">{accountTransactions.length}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-sm text-emerald-700 mb-1">Total Deposits</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        {formatAmount(
                          accountTransactions
                            .filter(t => t.type === 'Deposit')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-red-700 mb-1">Total Withdrawals</p>
                      <p className="text-2xl font-bold text-red-900">
                        {formatAmount(
                          accountTransactions
                            .filter(t => t.type === 'Withdrawal')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Date & Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountTransactions.map((transaction) => (
                          <tr key={transaction.transaction_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-xs text-slate-600">
                              {formatDate(transaction.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'Deposit' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : transaction.type === 'Withdrawal'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-xs font-semibold ${
                              transaction.type === 'Deposit' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'Deposit' ? '+' : '-'}
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">
                              {transaction.description || '-'}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                              {transaction.reference_no || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSummary;
