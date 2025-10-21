import { Building2, Users, BarChart3, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { overviewApi, type BranchOverviewResponse } from '../../api/overview';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const OverviewSection = ({ activeSubTab, setActiveSubTab }: { activeSubTab: string; setActiveSubTab: (tab: string) => void }) => {
  const [branchData, setBranchData] = useState<BranchOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subTabs: SubTab[] = [
    { id: 'my-branch', label: 'My Branch', icon: Building2 },
    { id: 'selected-branch', label: 'Selected Branch', icon: Users },
    { id: 'all-bank-system', label: 'All Bank System', icon: BarChart3 },
  ];

  useEffect(() => {
    if (activeSubTab === 'my-branch') {
      fetchUserBranchData();
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

  const renderContent = () => {
    switch (activeSubTab) {
      case 'my-branch':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
            {renderMyBranchContent()}
          </div>
        );

      case 'selected-branch':
        return (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Selected Branch Overview</h3>
                <p className="text-slate-600">View details for a specific branch you select</p>
              </div>
            </div>
            <p className="text-slate-600">Coming soon...</p>
          </div>
        );

      case 'all-bank-system':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Bank System Overview</h3>
                <p className="text-slate-600">View comprehensive statistics for the entire banking system</p>
              </div>
            </div>
            <p className="text-slate-600">Coming soon...</p>
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
