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
      
      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
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
      
      // Format dates as YYYY-MM-DD
      const formatDateStr = (date: Date) => date.toISOString().split('T')[0];
      
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
      <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#2A9D8F] overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b border-[#E9ECEF]">
          <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#2A9D8F]" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-[#264653]">Branch Summary</h3>
            <p className="text-sm text-[#6C757D]">Enter branch ID to view transaction statistics (Last 30 Days)</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-[#F8F9FA]">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter branch ID (e.g., BR001, b5c3a0d2-...)"
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238579] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
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
            <div className="mt-3 flex items-center gap-2 text-[#E63946] bg-[#E63946] bg-opacity-5 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Branch Details Section */}
      {branchDetails && (
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#264653] overflow-hidden">
          <div className="p-6 border-b border-[#E9ECEF]">
            <h3 className="text-xl font-semibold text-[#264653]">Branch Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#6C757D]">Branch Name</p>
              <p className="text-lg font-medium text-[#264653]">{branchDetails.branch_name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6C757D]">Branch ID</p>
              <p className="text-lg font-medium text-[#264653]">{branchDetails.branch_id}</p>
            </div>
            {branchDetails.branch_code && (
              <div>
                <p className="text-sm text-[#6C757D]">Branch Code</p>
                <p className="text-lg font-medium text-[#264653]">{branchDetails.branch_code}</p>
              </div>
            )}
            {branchDetails.city && (
              <div>
                <p className="text-sm text-[#6C757D]">City</p>
                <p className="text-lg font-medium text-[#264653]">{branchDetails.city}</p>
              </div>
            )}
            {branchDetails.address && (
              <div>
                <p className="text-sm text-[#6C757D]">Address</p>
                <p className="text-lg font-medium text-[#264653]">{branchDetails.address}</p>
              </div>
            )}
            {branchDetails.contact_number && (
              <div>
                <p className="text-sm text-[#6C757D]">Contact</p>
                <p className="text-lg font-medium text-[#264653]">{branchDetails.contact_number}</p>
              </div>
            )}
            {branchDetails.manager_name && (
              <div>
                <p className="text-sm text-[#6C757D]">Manager</p>
                <p className="text-lg font-medium text-[#264653]">{branchDetails.manager_name}</p>
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
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#38B000] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#38B000] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#38B000]" />
                </div>
                <span className="text-xs font-medium text-[#38B000] bg-[#38B000] bg-opacity-10 px-3 py-1 rounded-lg">
                  Deposits
                </span>
              </div>
              <p className="text-2xl font-semibold text-[#264653] mb-1">
                {formatAmount(branchReport.total_deposits)}
              </p>
              <p className="text-sm text-[#6C757D]">Total Deposits</p>
            </div>

            {/* Total Withdrawals Card */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#E63946] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#E63946] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-[#E63946]" />
                </div>
                <span className="text-xs font-medium text-[#E63946] bg-[#E63946] bg-opacity-10 px-3 py-1 rounded-lg">
                  Withdrawals
                </span>
              </div>
              <p className="text-2xl font-semibold text-[#264653] mb-1">
                {formatAmount(branchReport.total_withdrawals)}
              </p>
              <p className="text-sm text-[#6C757D]">Total Withdrawals</p>
            </div>

            {/* Total Transfers Card */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#2A9D8F] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-[#2A9D8F]" />
                </div>
                <span className="text-xs font-medium text-[#2A9D8F] bg-[#2A9D8F] bg-opacity-10 px-3 py-1 rounded-lg">
                  Transfers
                </span>
              </div>
              <p className="text-2xl font-semibold text-[#264653] mb-1">
                {formatAmount(branchReport.total_transfers)}
              </p>
              <p className="text-sm text-[#6C757D]">Total Transfers</p>
            </div>

            {/* Transaction Count Card */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#264653] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#264653] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#264653]" />
                </div>
                <span className="text-xs font-medium text-[#264653] bg-[#264653] bg-opacity-10 px-3 py-1 rounded-lg">
                  Count
                </span>
              </div>
              <p className="text-2xl font-semibold text-[#264653] mb-1">
                {branchReport.transaction_count.toLocaleString()}
              </p>
              <p className="text-sm text-[#6C757D]">Total Transactions</p>
            </div>
          </div>

          {/* Net Amount Card */}
          <div className={`rounded-xl shadow-lg border-t-4 p-6 bg-white ${
            (branchReport.net_amount ?? 0) >= 0 
              ? 'border-[#38B000]' 
              : 'border-[#E63946]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${
                  (branchReport.net_amount ?? 0) >= 0 ? 'text-[#38B000]' : 'text-[#E63946]'
                }`}>
                  Net Amount (Last 30 Days)
                </p>
                <p className={`text-3xl font-semibold text-[#264653]`}>
                  {branchReport.net_amount !== null && branchReport.net_amount !== undefined && !isNaN(branchReport.net_amount)
                    ? formatAmount(branchReport.net_amount)
                    : formatAmount(0)
                  }
                </p>
                <p className="text-sm text-[#6C757D] mt-2">
                  {branchReport.date_range.start_date} to {branchReport.date_range.end_date}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                (branchReport.net_amount ?? 0) >= 0 
                ? 'bg-[#38B000] bg-opacity-10' 
                : 'bg-[#E63946] bg-opacity-10'
              }`}>
                {(branchReport.net_amount ?? 0) >= 0 ? (
                  <TrendingUp className={`w-8 h-8 text-[#38B000]`} />
                ) : (
                  <TrendingDown className={`w-8 h-8 text-[#E63946]`} />
                )}
              </div>
            </div>
          </div>

          {/* Top Accounts Section */}
          {branchReport.all_accounts && branchReport.all_accounts.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#2A9D8F] overflow-hidden">
              <div className="p-6 border-b border-[#E9ECEF]">
                <h3 className="text-xl font-semibold text-[#264653]">All Active Accounts</h3>
                <p className="text-sm text-[#6C757D]">All active accounts in this branch (Last 30 Days)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8F9FA] border-b border-[#E9ECEF]">
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Account Holder</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Account ID</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Transactions</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D]">Total Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchReport.all_accounts.map((account) => (
                      <tr key={account.acc_id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#264653]">
                          {account.acc_holder_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6C757D] font-mono">
                          {account.acc_id}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[#264653] bg-opacity-10 text-[#264653]">
                            {account.transaction_count} transactions
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleAccountClick(account.acc_id, account.acc_holder_name || 'N/A')}
                            className="text-sm font-medium text-[#2A9D8F] hover:text-[#238579] hover:underline flex items-center gap-2 transition-colors cursor-pointer"
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
