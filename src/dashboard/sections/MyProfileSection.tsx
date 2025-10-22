import { useState, useEffect } from 'react';
import { User, Lock, History, Loader, Calendar, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { authApi } from '../../api/auth';
import Alert from '../../components/common/Alert';

interface UserData {
  user_id: string;
  nic: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  dob: string;
  email: string;
  username: string;
  branch_name: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  transaction_id: string;
  amount: number;
  acc_id: string;
  type: string;
  description: string;
  created_at: string;
  reference_no: number;
}

interface TodayTransactionSummary {
  total_transactions: number;
  total_amount: number;
  total_withdrawal: number;
  total_deposit: number;
  total_banktransfer_in: number;
  total_banktransfer_out: number;
  sum_of_all_value: number;
  numeric_sum: number;
}

const MyProfileSection = ({ activeSubTab, setActiveSubTab }: { activeSubTab: string; setActiveSubTab: (tab: string) => void }) => {
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [todaySummary, setTodaySummary] = useState<TodayTransactionSummary | null>(null);
  const [dateRangeTransactions, setDateRangeTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [changePasswordForm, setChangePasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [dateRangeForm, setDateRangeForm] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  interface SubTab {
    id: string;
    label: string;
    icon: LucideIcon;
  }

  const subTabs: SubTab[] = [
    { id: 'details', label: 'My Details', icon: User },
    { id: 'transactions', label: 'My Transactions', icon: History },
    { id: 'today', label: "Today's Transactions", icon: Calendar },
    { id: 'report', label: 'Transaction Report', icon: BarChart3 },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  useEffect(() => {
    if (activeSubTab === 'details' || activeSubTab === 'transactions') {
      fetchUserData();
    } else if (activeSubTab === 'today') {
      fetchTodayTransactions();
    } else if (activeSubTab === 'report') {
      fetchTransactionsByDateRange();
    }
  }, [activeSubTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await authApi.getUserData();
      setUserDetails(userData);

      if (activeSubTab === 'transactions') {
        const txnData = await authApi.getUserTransactions();
        setTransactions(txnData.transactions || []);
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load user data'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayTransactions = async () => {
    try {
      setLoading(true);
      const data = await authApi.getTodayTransactions();
      if (data.transactions && data.transactions.transactions) {
        setTodayTransactions(data.transactions.transactions);
      }
      if (data.transactions && data.transactions.summary) {
        setTodaySummary(data.transactions.summary);
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load today transactions'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsByDateRange = async () => {
    try {
      setLoading(true);
      const data = await authApi.getTransactionsByDateRange(dateRangeForm.startDate, dateRangeForm.endDate);
      setDateRangeTransactions(data.transactions || []);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load transactions'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTodayReport = async () => {
    try {
      setLoading(true);
      const blob = await authApi.downloadTodayTransactionReport();

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'today_report.pdf');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setAlert({
        type: 'success',
        message: 'Report downloaded successfully'
      });
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to download report'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAllTransactionsReport = async () => {
    try {
      setLoading(true);
      const blob = await authApi.downloadAllTransactionsReport();

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setAlert({
        type: 'success',
        message: 'Report downloaded successfully'
      });
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to download report'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!changePasswordForm.old_password || !changePasswordForm.new_password || !changePasswordForm.confirm_password) {
      setAlert({ type: 'error', message: 'All fields are required' });
      return;
    }

    if (changePasswordForm.new_password !== changePasswordForm.confirm_password) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (changePasswordForm.new_password.length < 6) {
      setAlert({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      await authApi.updatePassword({
        old_password: changePasswordForm.old_password,
        new_password: changePasswordForm.new_password
      });
      setAlert({ type: 'success', message: 'Password changed successfully' });
      setChangePasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-textSecondary" />
        </div>
      );
    }

    switch (activeSubTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {userDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-highlight/10 to-highlight/5 p-6 rounded-2xl border border-borderLight hover:shadow-md transition-all">
                  <h3 className="text-sm font-bold text-primary mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Full Name</p>
                      <p className="font-semibold text-primary">{userDetails.first_name} {userDetails.last_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">NIC Number</p>
                      <p className="font-semibold text-primary font-mono">{userDetails.nic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Date of Birth</p>
                      <p className="font-semibold text-primary">{new Date(userDetails.dob).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Address</p>
                      <p className="font-semibold text-primary">{userDetails.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-2xl border border-borderLight hover:shadow-md transition-all">
                  <h3 className="text-sm font-bold text-primary mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Username</p>
                      <p className="font-semibold text-primary">{userDetails.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Email</p>
                      <p className="font-semibold text-primary">{userDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Phone Number</p>
                      <p className="font-semibold text-primary">{userDetails.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary font-medium mb-1">Branch</p>
                      <p className="font-semibold text-primary">{userDetails.branch_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            {transactions.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleDownloadAllTransactionsReport}
                  disabled={loading}
                  className="button-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {loading ? 'Downloading...' : 'Download Report'}
                </button>
              </div>
            )}
            {transactions.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-borderLight">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background border-b border-borderLight">
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                        <td className="px-6 py-3 text-sm text-textSecondary font-medium">{new Date(txn.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${txn.type === 'Deposit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-primary">Rs. {txn.amount.toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm text-textSecondary">{txn.description}</td>
                        <td className="px-6 py-3 text-sm text-tertiary">{txn.reference_no}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-tertiary font-medium">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        );

      case 'today':
        return (
          <div className="space-y-4">
            {todaySummary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-5 rounded-xl border border-borderLight hover:shadow-md transition-all">
                  <p className="text-xs text-textSecondary font-bold mb-2">Total Transactions</p>
                  <p className="text-3xl font-bold text-primary">{todaySummary.total_transactions}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                  <p className="text-xs text-emerald-700 font-bold mb-2">Total Deposits</p>
                  <p className="text-3xl font-bold text-emerald-900">Rs. {todaySummary.total_deposit.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-5 rounded-xl border border-red-200 hover:shadow-md transition-all">
                  <p className="text-xs text-red-700 font-bold mb-2">Total Withdrawals</p>
                  <p className="text-3xl font-bold text-red-900">Rs. {todaySummary.total_withdrawal.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                  <p className="text-xs text-purple-700 font-bold mb-2">Bank Transfer In</p>
                  <p className="text-3xl font-bold text-purple-900">Rs. {todaySummary.total_banktransfer_in.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                  <p className="text-xs text-orange-700 font-bold mb-2">Bank Transfer Out</p>
                  <p className="text-3xl font-bold text-orange-900">Rs. {todaySummary.total_banktransfer_out.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-borderLight to-borderLight/50 p-5 rounded-xl border border-borderLight hover:shadow-md transition-all">
                  <p className="text-xs text-textSecondary font-bold mb-2">Net Change</p>
                  <p className={`text-3xl font-bold ${todaySummary.numeric_sum >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    Rs. {todaySummary.numeric_sum.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            {todayTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="mb-4">
                  <button
                    onClick={handleDownloadTodayReport}
                    disabled={loading}
                    className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {loading ? 'Downloading...' : 'Download Report'}
                  </button>
                </div>
                <div className="rounded-2xl border border-borderLight overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-background border-b border-borderLight">
                        <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayTransactions.map((txn) => (
                        <tr key={txn.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                          <td className="px-6 py-3 text-sm text-textSecondary font-medium">{new Date(txn.created_at).toLocaleTimeString()}</td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${txn.type === 'Deposit' ? 'bg-emerald-100 text-emerald-700' :
                                txn.type === 'Withdrawal' ? 'bg-red-100 text-red-700' :
                                  txn.type === 'BankTransfer-In' ? 'bg-purple-100 text-purple-700' :
                                    'bg-orange-100 text-orange-700'
                              }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-primary">Rs. {txn.amount.toFixed(2)}</td>
                          <td className="px-6 py-3 text-sm text-textSecondary">{txn.description}</td>
                          <td className="px-6 py-3 text-sm text-tertiary">{txn.reference_no}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-tertiary font-medium">
                <p>No transactions today</p>
              </div>
            )}
          </div>
        );

      case 'report':
        return (
          <div className="space-y-4">
            <div className="bg-background p-6 rounded-2xl border border-borderLight mb-6">
              <h3 className="text-sm font-bold text-primary mb-4">Select Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-textSecondary mb-2 uppercase">Start Date</label>
                  <input
                    type="date"
                    value={dateRangeForm.startDate}
                    onChange={(e) => setDateRangeForm({ ...dateRangeForm, startDate: e.target.value })}
                    className="input-field w-full"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-textSecondary mb-2 uppercase">End Date</label>
                  <input
                    type="date"
                    value={dateRangeForm.endDate}
                    onChange={(e) => setDateRangeForm({ ...dateRangeForm, endDate: e.target.value })}
                    className="input-field w-full"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={fetchTransactionsByDateRange}
                    disabled={loading}
                    className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? 'Loading...' : 'Search'}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const blob = await authApi.downloadTransactionsReportByDateRange(dateRangeForm.startDate, dateRangeForm.endDate);
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `transaction_report_${dateRangeForm.startDate}_to_${dateRangeForm.endDate}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode?.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        setAlert({ type: 'success', message: 'Report downloaded successfully' });
                      } catch (error: any) {
                        setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to download report' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="button-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? 'Downloading...' : 'Download Report'}
                  </button>
                </div>
              </div>
            </div>

            {dateRangeTransactions.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-borderLight">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background border-b border-borderLight">
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateRangeTransactions.map((txn) => (
                      <tr key={txn.transaction_id} className="border-b border-borderLight hover:bg-background transition-colors">
                        <td className="px-6 py-3 text-sm text-textSecondary font-medium">{new Date(txn.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${txn.type === 'Deposit' ? 'bg-emerald-100 text-emerald-700' :
                              txn.type === 'Withdrawal' ? 'bg-red-100 text-red-700' :
                                txn.type === 'BankTransfer-In' ? 'bg-purple-100 text-purple-700' :
                                  'bg-orange-100 text-orange-700'
                            }`}>
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-primary">Rs. {txn.amount.toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm text-textSecondary">{txn.description}</td>
                        <td className="px-6 py-3 text-sm text-tertiary">{txn.reference_no}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-tertiary font-medium">
                <p>No transactions found for the selected date range</p>
              </div>
            )}
          </div>
        );

      case 'password':
        return (
          <div className="max-w-md">
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="label-text">
                  Current Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.old_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, old_password: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter your current password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label-text">
                  New Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.new_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, new_password: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter new password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label-text">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.confirm_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirm_password: e.target.value })}
                  className="input-field w-full"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="My Profile" description="Manage your account settings and view your information" />

        {alert && (
          <div className="mb-6 animate-slide-down">
            <Alert type={alert.type}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{alert.message}</span>
                <button onClick={() => setAlert(null)} className="text-lg font-bold opacity-70 hover:opacity-100 ml-4">
                  ×
                </button>
              </div>
            </Alert>
          </div>
        )}

        <SubTabGrid subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />

        <div className="bg-white rounded-2xl border border-borderLight p-8 animate-slide-in-right">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MyProfileSection;
