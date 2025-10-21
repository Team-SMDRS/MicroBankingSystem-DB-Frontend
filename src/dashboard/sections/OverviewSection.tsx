import { Building2, Users, BarChart3, Loader2, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { overviewApi, type BranchOverviewResponse, type CustomerOverviewResponse } from '../../api/overview';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const OverviewSection = ({ activeSubTab, setActiveSubTab }: { activeSubTab: string; setActiveSubTab: (tab: string) => void }) => {
  const [branchData, setBranchData] = useState<BranchOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bank System Overview states
  const [branchComparison, setBranchComparison] = useState<any>(null);
  const [selectedBranchData, setSelectedBranchData] = useState<BranchOverviewResponse | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [loadingSelectedBranch, setLoadingSelectedBranch] = useState(false);
  const [systemError, setSystemError] = useState<string | null>(null);

  // Customer Overview states
  const [nicInput, setNicInput] = useState('');
  const [customerData, setCustomerData] = useState<CustomerOverviewResponse | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  const subTabs: SubTab[] = [
    { id: 'my-branch', label: 'My Branch', icon: Building2 },
    { id: 'customer-overview', label: 'Enter NIC', icon: Users },
    { id: 'all-bank-system', label: 'All Bank System', icon: BarChart3 },
  ];

  useEffect(() => {
    if (activeSubTab === 'my-branch') {
      fetchUserBranchData();
    } else if (activeSubTab === 'all-bank-system') {
      fetchBranchComparison();
    }
  }, [activeSubTab]);

  const fetchUserBranchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewApi.getUserBranchOverview();
      setBranchData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load branch overview data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchComparison = async () => {
    try {
      setLoadingComparison(true);
      setSystemError(null);
      const data = await overviewApi.getBranchComparison();
      setBranchComparison(data);
    } catch (err: any) {
      setSystemError(err.response?.data?.message || 'Failed to load branch comparison data');
    } finally {
      setLoadingComparison(false);
    }
  };

  const fetchSelectedBranchData = async (branchId: string) => {
    try {
      setLoadingSelectedBranch(true);
      setSystemError(null);
      const data = await overviewApi.getSelectedBranchOverview(branchId);
      setSelectedBranchData(data);
    } catch (err: any) {
      setSystemError(err.response?.data?.message || 'Failed to load branch data');
    } finally {
      setLoadingSelectedBranch(false);
    }
  };

  const fetchCustomerOverview = async (nic: string) => {
    if (!nic.trim()) {
      setCustomerError('Please enter a valid NIC');
      return;
    }

    try {
      setLoadingCustomer(true);
      setCustomerError(null);

      // Step 1: Get customer profile by NIC
      const customerProfile = await overviewApi.getCustomerProfileByNIC(nic);
      
      // Step 2: Get complete customer details using customer_id
      const completeData = await overviewApi.getCustomerCompleteDetails(customerProfile.customer_id);
      
      setCustomerData(completeData);
    } catch (err: any) {
      setCustomerError(err.response?.data?.message || 'Failed to load customer overview data');
      setCustomerData(null);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderMyBranchContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
          <span className="text-slate-600">Loading branch data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-red-600 mt-1">⚠️</div>
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!branchData) {
      return <p className="text-slate-600">No data available</p>;
    }

    const { branch, account_statistics, accounts_by_plan, daily_transactions, transaction_types, top_accounts, monthly_trend, weekly_interest } = branchData;

    return (
      <div className="space-y-8">
        {/* Branch Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">{branch.name} Branch</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Total Accounts</p>
              <p className="text-2xl font-bold text-blue-600">{account_statistics.total_accounts}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Accounts</p>
              <p className="text-2xl font-bold text-emerald-600">{account_statistics.active_accounts}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Balance</p>
              <p className="text-lg font-bold text-slate-800">{formatAmount(account_statistics.total_balance)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Average Balance</p>
              <p className="text-lg font-bold text-slate-800">{formatAmount(account_statistics.average_balance)}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts by Plan - Pie Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Accounts by Plan</h4>
            <div className="flex justify-center">
              <PieChart
                series={[
                  {
                    data: accounts_by_plan.map((plan) => ({
                      label: plan.plan_name,
                      value: plan.count,
                    })),
                    valueFormatter: (value) => `${value} accounts`,
                  },
                ]}
                width={400}
                height={300}
              />
            </div>
          </div>

          {/* Transaction Types - Pie Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Transaction Types Distribution</h4>
            <div className="flex justify-center">
              <PieChart
                series={[
                  {
                    data: transaction_types.map((type) => ({
                      label: type.type,
                      value: type.count,
                    })),
                    valueFormatter: (value) => `${value} transactions`,
                  },
                ]}
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Top Accounts - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Top 10 Accounts by Balance</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: top_accounts.map((acc) => acc.balance),
                  label: 'Account Balance',
                  color: '#3b82f6',
                },
              ]}
              xAxis={[
                {
                  data: top_accounts.map((acc) => acc.account_no.slice(-4)),
                  scaleType: 'band',
                  label: 'Account Number (Last 4 digits)',
                },
              ]}
              width={800}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
            />
          </div>
        </div>

        {/* Monthly Trend - Line Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Monthly Transaction Trend</h4>
          <div className="flex justify-center overflow-x-auto">
            <LineChart
              series={[
                {
                  data: monthly_trend.map((m) => m.transaction_count),
                  label: 'Transaction Count',
                  color: '#10b981',
                },
              ]}
              xAxis={[
                {
                  data: monthly_trend.map((m) => `${m.month}/${m.year}`),
                  scaleType: 'point',
                  label: 'Month',
                },
              ]}
              width={800}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
            />
          </div>
        </div>

        {/* Weekly Interest - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Weekly Interest Distribution</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: weekly_interest.map((w) => w.total_interest),
                  label: 'Total Interest',
                  color: '#f59e0b',
                },
              ]}
              xAxis={[
                {
                  data: weekly_interest.map((w) => w.week_start),
                  scaleType: 'band',
                  label: 'Week Starting',
                },
              ]}
              width={800}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
            />
          </div>
        </div>

        {/* Daily Transactions Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Daily Transactions</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Count</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {daily_transactions.slice(0, 10).map((day, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{day.date}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{day.count}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatAmount(day.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderBankSystemContent = () => {
    if (loadingComparison && !branchComparison) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
          <span className="text-slate-600">Loading bank system data...</span>
        </div>
      );
    }

    if (systemError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-red-600 mt-1">⚠️</div>
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{systemError}</p>
          </div>
        </div>
      );
    }

    if (!branchComparison) {
      return <p className="text-slate-600">No data available</p>;
    }

    const branches = branchComparison.branches || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Bank System Overview</h3>
            <p className="text-slate-600">Comparison of all branches in the banking system</p>
          </div>
        </div>

        {/* Branch Comparison - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Total Balance by Branch</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: branches.map((b: any) => b.total_balance),
                  label: 'Total Balance',
                  color: '#a855f7',
                },
              ]}
              xAxis={[
                {
                  data: branches.map((b: any) => b.branch_name),
                  scaleType: 'band',
                  label: 'Branch Name',
                },
              ]}
              width={900}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 80 }}
            />
          </div>
        </div>

        {/* Transactions by Branch - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Total Transactions by Branch</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: branches.map((b: any) => b.total_transactions),
                  label: 'Transaction Count',
                  color: '#06b6d4',
                },
              ]}
              xAxis={[
                {
                  data: branches.map((b: any) => b.branch_name),
                  scaleType: 'band',
                  label: 'Branch Name',
                },
              ]}
              width={900}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 80 }}
            />
          </div>
        </div>

        {/* Accounts by Branch - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Total Accounts by Branch</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: branches.map((b: any) => b.total_accounts),
                  label: 'Account Count',
                  color: '#f59e0b',
                },
              ]}
              xAxis={[
                {
                  data: branches.map((b: any) => b.branch_name),
                  scaleType: 'band',
                  label: 'Branch Name',
                },
              ]}
              width={900}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 80 }}
            />
          </div>
        </div>

        {/* Interest by Branch - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Total Interest by Branch</h4>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              series={[
                {
                  data: branches.map((b: any) => b.total_interest),
                  label: 'Interest Amount',
                  color: '#10b981',
                },
              ]}
              xAxis={[
                {
                  data: branches.map((b: any) => b.branch_name),
                  scaleType: 'band',
                  label: 'Branch Name',
                },
              ]}
              width={900}
              height={400}
              margin={{ left: 60, right: 20, top: 10, bottom: 80 }}
            />
          </div>
        </div>

        {/* Branch Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Branch Comparison Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Branch Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Total Accounts</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Active Accounts</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Total Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Transactions</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Interest</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch: any) => (
                  <tr key={branch.branch_id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{branch.branch_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{branch.total_accounts}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{branch.active_accounts}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatAmount(branch.total_balance)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{branch.total_transactions}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatAmount(branch.total_interest)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => fetchSelectedBranchData(branch.branch_id)}
                        disabled={loadingSelectedBranch}
                        className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Branch Details */}
        {selectedBranchData && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              {selectedBranchData.branch.name} - Detailed Overview
            </h4>
            
            {loadingSelectedBranch ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-2" />
                <span className="text-slate-600">Loading branch details...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Branch Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-700">Total Accounts</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedBranchData.account_statistics.total_accounts}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-sm text-emerald-700">Active Accounts</p>
                    <p className="text-2xl font-bold text-emerald-900">{selectedBranchData.account_statistics.active_accounts}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-700">Total Balance</p>
                    <p className="text-lg font-bold text-purple-900">{formatAmount(selectedBranchData.account_statistics.total_balance)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-orange-700">Average Balance</p>
                    <p className="text-lg font-bold text-orange-900">{formatAmount(selectedBranchData.account_statistics.average_balance)}</p>
                  </div>
                </div>

                {/* Charts for Selected Branch */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Accounts by Plan */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <h5 className="text-base font-semibold text-slate-800 mb-4">Accounts by Plan</h5>
                    <div className="flex justify-center">
                      <PieChart
                        series={[
                          {
                            data: selectedBranchData.accounts_by_plan.map((plan) => ({
                              label: plan.plan_name,
                              value: plan.count,
                            })),
                            valueFormatter: (value) => `${value} accounts`,
                          },
                        ]}
                        width={350}
                        height={250}
                      />
                    </div>
                  </div>

                  {/* Transaction Types */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <h5 className="text-base font-semibold text-slate-800 mb-4">Transaction Types</h5>
                    <div className="flex justify-center">
                      <PieChart
                        series={[
                          {
                            data: selectedBranchData.transaction_types.map((type) => ({
                              label: type.type,
                              value: type.count,
                            })),
                            valueFormatter: (value) => `${value} transactions`,
                          },
                        ]}
                        width={350}
                        height={250}
                      />
                    </div>
                  </div>
                </div>

                {/* Top Accounts */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h5 className="text-base font-semibold text-slate-800 mb-4">Top Accounts</h5>
                  <div className="overflow-x-auto">
                    <BarChart
                      series={[
                        {
                          data: selectedBranchData.top_accounts.slice(0, 10).map((acc) => acc.balance),
                          label: 'Account Balance',
                          color: '#6366f1',
                        },
                      ]}
                      xAxis={[
                        {
                          data: selectedBranchData.top_accounts.slice(0, 10).map((acc) => acc.account_no.slice(-4)),
                          scaleType: 'band',
                          label: 'Account (Last 4 digits)',
                        },
                      ]}
                      width={700}
                      height={350}
                      margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
                    />
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h5 className="text-base font-semibold text-slate-800 mb-4">Monthly Trend</h5>
                  <div className="overflow-x-auto">
                    <LineChart
                      series={[
                        {
                          data: selectedBranchData.monthly_trend.map((m) => m.transaction_count),
                          label: 'Transaction Count',
                          color: '#f59e0b',
                        },
                      ]}
                      xAxis={[
                        {
                          data: selectedBranchData.monthly_trend.map((m) => `${m.month}/${m.year}`),
                          scaleType: 'point',
                          label: 'Month',
                        },
                      ]}
                      width={700}
                      height={350}
                      margin={{ left: 60, right: 20, top: 10, bottom: 60 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCustomerOverviewContent = () => {
    return (
      <div className="space-y-8">
        {/* NIC Input Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Search Customer Profile</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={nicInput}
              onChange={(e) => setNicInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchCustomerOverview(nicInput)}
              placeholder="Enter NIC (e.g., 123456789V)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={() => fetchCustomerOverview(nicInput)}
              disabled={loadingCustomer}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          {customerError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-red-600 mt-1">⚠️</div>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{customerError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loadingCustomer && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-2" />
            <span className="text-slate-600">Loading customer data...</span>
          </div>
        )}

        {/* Customer Data Display */}
        {customerData && !loadingCustomer && (
          <div className="space-y-8">
            {/* Customer Profile Header */}
            {customerData?.customer_profile && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {customerData.customer_profile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800">{customerData.customer_profile.full_name}</h3>
                    <p className="text-slate-600">NIC: {customerData.customer_profile.nic}</p>
                    <p className="text-slate-600">Phone: {customerData.customer_profile.phone_number}</p>
                    <p className="text-slate-600">Address: {customerData.customer_profile.address}</p>
                    {customerData.customer_profile.dob && (
                      <p className="text-slate-600 text-xs mt-2">DOB: {new Date(customerData.customer_profile.dob).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold">Total Balance</p>
                <p className="text-xl font-bold text-blue-900 mt-2">{formatAmount(customerData.summary.total_balance)}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-semibold">Total Accounts</p>
                <p className="text-xl font-bold text-emerald-900 mt-2">{customerData.summary.total_accounts}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold">Active Accounts</p>
                <p className="text-xl font-bold text-purple-900 mt-2">{customerData.summary.active_accounts}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-xs text-orange-700 font-semibold">Transactions</p>
                <p className="text-xl font-bold text-orange-900 mt-2">{customerData.summary.total_transactions}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <p className="text-xs text-pink-700 font-semibold">FD Value</p>
                <p className="text-lg font-bold text-pink-900 mt-2">{formatAmount(customerData.summary.total_fd_value)}</p>
              </div>
            </div>

            {/* Accounts Section */}
            {customerData.accounts && customerData.accounts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Customer Accounts ({customerData.accounts.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Account No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Plan</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Balance</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.accounts.map((account) => (
                        <tr key={account.acc_id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{account.account_no}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">Savings</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{account.savings_plan || '-'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatAmount(account.balance)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              account.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : account.status === 'inactive'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {account.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{account.branch_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Account Balance Distribution - Pie Chart */}
            {customerData.accounts && customerData.accounts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Account Balance Distribution</h4>
                <div className="flex justify-center">
                  <PieChart
                    series={[
                      {
                        data: customerData.accounts.map((acc) => ({
                          label: `Acc. ${acc.account_no}`,
                          value: Math.round(acc.balance),
                        })),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {customerData?.transactions && customerData.transactions.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions (Last 10)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Account</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Ref No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.transactions.slice(0, 10).map((trans) => {
                        const isCredit = trans.type === 'Deposit' || trans.type === 'Interest' || trans.type.includes('In');
                        return (
                          <tr key={trans.transaction_id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{new Date(trans.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-800">{trans.account_no}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                isCredit
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {trans.type}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-sm font-medium ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isCredit ? '+' : '-'} {formatAmount(trans.amount)}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">{trans.reference_no}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 truncate">{trans.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fixed Deposits Section */}
            {customerData.fixed_deposits && customerData.fixed_deposits.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Fixed Deposits ({customerData.fixed_deposits.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Account No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Principal</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Rate (%)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Tenure</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Maturity Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Maturity Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.fixed_deposits.map((fd) => (
                        <tr key={fd.fd_id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{fd.fd_account_no}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{formatAmount(fd.balance)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{fd.interest_rate.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{fd.duration} months</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatAmount(fd.balance * (1 + (fd.interest_rate / 100) * (fd.duration / 12)))}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{new Date(fd.maturity_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              fd.status === 'active'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {fd.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FD Summary - Pie Chart */}
            {customerData.fixed_deposits && customerData.fixed_deposits.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Fixed Deposit Distribution by Status</h4>
                <div className="flex justify-center">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            label: 'Active',
                            value: customerData.fixed_deposits.filter(fd => fd.status === 'active').length,
                          },
                          {
                            label: 'Matured',
                            value: customerData.fixed_deposits.filter(fd => fd.status !== 'active').length,
                          },
                        ],
                        valueFormatter: (value) => `${value} FDs`,
                      },
                    ]}
                    width={400}
                    height={300}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data Message */}
        {!customerData && !loadingCustomer && nicInput && (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">Enter a NIC and click search to view customer details</p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSubTab) {
      case 'my-branch':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
            {renderMyBranchContent()}
          </div>
        );

      case 'customer-overview':
        return (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200 space-y-6">
            {renderCustomerOverviewContent()}
          </div>
        );

      case 'all-bank-system':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200 space-y-6">
            {renderBankSystemContent()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <SectionHeader title="Overview" description="View system and branch statistics at a glance" />
      
      <SubTabGrid subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default OverviewSection;
