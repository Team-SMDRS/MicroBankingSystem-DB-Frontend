import { useState, useEffect } from 'react';
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
  const [branches, setBranches] = useState<BranchDetails[]>([]);
  const [branchId, setBranchId] = useState('');
  const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(null);
  const [branchReport, setBranchReport] = useState<BranchTransactionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for transaction details
  const [selectedAccount, setSelectedAccount] = useState<{
    acc_id: string;
    acc_holder_name: string;
  } | null>(null);
  const [accountTransactions, setAccountTransactions] = useState<TransactionDetail[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Fetch all branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const branchList = await branchApi.getAll();
        console.log('Branches loaded:', branchList);
        setBranches(branchList);
      } catch (err: any) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches');
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

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
      <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
        <div className="flex items-center gap-3 p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
          <div className="w-12 h-12 bg-gradient-to-br from-highlight/10 to-highlight/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-highlight" />
          </div>
          <div>
            <h3 className="section-header text-primary">Branch Summary</h3>
            <p className="text-sm text-textSecondary">Select a branch to view transaction statistics (Last 30 Days)</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-background">
          <div className="flex gap-3">
            <div className="flex-1">
              {loadingBranches ? (
                <div className="flex items-center justify-center py-3 bg-white border border-borderLight rounded-xl">
                  <Loader2 className="w-5 h-5 text-textSecondary animate-spin mr-2" />
                  <span className="text-textSecondary font-medium">Loading branches...</span>
                </div>
              ) : (
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full input-field text-base font-medium"
                  style={{ 
                    color: '#001F5B',
                    backgroundColor: '#fff',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  <option value="" style={{ color: '#001F5B', backgroundColor: '#fff', fontSize: '16px', fontWeight: '500' }}>
                    -- Select a branch --
                  </option>
                  {branches.map((branch) => (
                    <option 
                      key={branch.branch_id} 
                      value={branch.branch_id}
                      style={{ color: '#001F5B', backgroundColor: '#fff', fontSize: '16px', fontWeight: '500', padding: '10px' }}
                    >
                      {branch.branch_name || branch.name || 'Unnamed Branch'} {branch.branch_code ? `(${branch.branch_code})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !branchId}
              className="button-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Load Data</span>
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

      {/* Branch Details Section */}
      {branchDetails && (
        <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
          <div className="p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
            <h3 className="text-xl font-bold text-primary">Branch Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="label-text">Branch Name</p>
              <p className="text-lg font-semibold text-primary">{branchDetails.branch_name}</p>
            </div>
            <div>
              <p className="label-text">Branch ID</p>
              <p className="text-lg font-semibold text-primary">{branchDetails.branch_id}</p>
            </div>
            {branchDetails.branch_code && (
              <div>
                <p className="label-text">Branch Code</p>
                <p className="text-lg font-semibold text-primary">{branchDetails.branch_code}</p>
              </div>
            )}
            {branchDetails.city && (
              <div>
                <p className="label-text">City</p>
                <p className="text-lg font-semibold text-primary">{branchDetails.city}</p>
              </div>
            )}
            {branchDetails.address && (
              <div>
                <p className="label-text">Address</p>
                <p className="text-lg font-semibold text-primary">{branchDetails.address}</p>
              </div>
            )}
            {branchDetails.contact_number && (
              <div>
                <p className="label-text">Contact</p>
                <p className="text-lg font-semibold text-primary">{branchDetails.contact_number}</p>
              </div>
            )}
            {branchDetails.manager_name && (
              <div>
                <p className="label-text">Manager</p>
                <p className="text-lg font-semibold text-primary">{branchDetails.manager_name}</p>
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
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl shadow-md border border-emerald-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Deposits
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-900 mb-1">
                {formatAmount(branchReport.total_deposits)}
              </p>
              <p className="text-sm text-emerald-700 font-medium">Total Deposits</p>
            </div>

            {/* Total Withdrawals Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl shadow-md border border-red-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full uppercase">
                  Withdrawals
                </span>
              </div>
              <p className="text-2xl font-bold text-red-900 mb-1">
                {formatAmount(branchReport.total_withdrawals)}
              </p>
              <p className="text-sm text-red-700 font-medium">Total Withdrawals</p>
            </div>

            {/* Total Transfers Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl shadow-md border border-blue-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase">
                  Transfers
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mb-1">
                {formatAmount(branchReport.total_transfers)}
              </p>
              <p className="text-sm text-blue-700 font-medium">Total Transfers</p>
            </div>

            {/* Transaction Count Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl shadow-md border border-purple-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase">
                  Count
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mb-1">
                {branchReport.transaction_count.toLocaleString()}
              </p>
              <p className="text-sm text-purple-700 font-medium">Total Transactions</p>
            </div>
          </div>

          {/* Net Amount Card */}
          <div className={`rounded-2xl shadow-md border p-6 ${
            (branchReport.net_amount ?? 0) >= 0 
              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold mb-2 uppercase ${
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
                <p className="text-sm text-textSecondary font-medium mt-2">
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
            <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden animate-slide-in-right">
              <div className="p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
                <h3 className="text-xl font-bold text-primary">All Active Accounts</h3>
                <p className="text-sm text-textSecondary">All active accounts in this branch (Last 30 Days)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background border-b border-borderLight">
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Account Holder</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Account ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Transactions</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary uppercase">Total Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchReport.all_accounts.map((account) => (
                      <tr key={account.acc_id} className="border-b border-borderLight hover:bg-background transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-primary">
                          {account.acc_holder_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-textSecondary font-mono">
                          {account.acc_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-textSecondary">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            {account.transaction_count} transactions
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleAccountClick(account.acc_id, account.acc_holder_name || 'N/A')}
                            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-2 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-pop">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-borderLight bg-gradient-to-r from-background to-white">
              <div>
                <h3 className="text-2xl font-bold text-primary">Transaction Details</h3>
                <p className="text-sm text-textSecondary mt-1 font-medium">
                  {selectedAccount.acc_holder_name} • Account: {selectedAccount.acc_id}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-background hover:bg-borderLight flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-textSecondary" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingTransactions ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-textSecondary" />
                  <span className="ml-3 text-textSecondary font-medium">Loading transactions...</span>
                </div>
              ) : accountTransactions.length === 0 ? (
                <div className="flex items-center justify-center p-12 text-textSecondary font-medium">
                  <p>No transactions found for this account in the last 30 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-borderLight">
                      <p className="text-sm text-textSecondary font-bold mb-1 uppercase">Total Transactions</p>
                      <p className="text-2xl font-bold text-primary">{accountTransactions.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200">
                      <p className="text-sm text-emerald-700 font-bold mb-1 uppercase">Total Deposits</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        {formatAmount(
                          accountTransactions
                            .filter(t => t.type === 'Deposit')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200">
                      <p className="text-sm text-red-700 font-bold mb-1 uppercase">Total Withdrawals</p>
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
                  <div className="border border-borderLight rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-background border-b border-borderLight">
                          <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Date & Time</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountTransactions.map((transaction) => (
                          <tr key={transaction.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                            <td className="px-4 py-3 text-xs text-textSecondary font-medium">
                              {formatDate(transaction.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                transaction.type === 'Deposit' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : transaction.type === 'Withdrawal'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-xs font-bold ${
                              ['Deposit', 'Interest', 'BankTransfer-In'].includes(transaction.type) ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {['Deposit', 'Interest', 'BankTransfer-In'].includes(transaction.type) ? '+' : '-'}
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="px-4 py-3 text-xs text-textSecondary">
                              {transaction.description || '-'}
                            </td>
                            <td className="px-4 py-3 text-xs text-tertiary font-mono">
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
            <div className="p-6 border-t border-borderLight bg-background flex justify-end">
              <button
                onClick={closeModal}
                className="button-secondary"
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