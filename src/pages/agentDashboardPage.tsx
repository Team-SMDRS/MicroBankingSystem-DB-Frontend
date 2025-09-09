import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaUserPlus, FaWallet, FaSearch } from 'react-icons/fa';

// CORRECTED: Import paths are case-sensitive and point to the right files.
import { useAuth } from '../store/authContex';
import type { Customer, SavingsAccount } from '../types';
import { mockCustomers, mockSavingsAccounts } from '../api/testData';
import StatCard from '../components/ui/statCard';
import Button from '../components/ui/button';
import Skeleton from '../components/ui/skeleton';

import RecentTransactions from '../components/shared/recentTransactions';
import SystemNotifications from '../components/shared/systemNotifications';
import NewCustomerTracker from '../components/shared/newCustomerTracker';
import DailyPerformanceChart from '../components/shared/dailyPerformanceChart';
import WeeklyVolumeChart from '../components/shared/weeklyVolumeChart';

const AgentDashboardPage: React.FC = () => {
  const { agent } = useAuth();
  const [activeTab, setActiveTab] = useState<'myCustomers' | 'search'>('myCustomers');
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [myCustomers, setMyCustomers] = useState<(Customer & { account?: SavingsAccount })[]>([]);

  const [stats, setStats] = useState({ transactionsToday: 25, portfolioValue: 0 });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (agent) {
        const responsibleCustomers = mockCustomers.filter(c => c.assignedAgentId === agent.agentId);
        const customersWithAccounts = responsibleCustomers.map(customer => {
          const account = mockSavingsAccounts.find(acc => acc.customerId === customer.customerId);
          return { ...customer, account };
        });
        setMyCustomers(customersWithAccounts);
        const totalValue = customersWithAccounts.reduce((sum, customer) => sum + (customer.account?.balance || 0), 0);
        setStats(prevStats => ({ ...prevStats, portfolioValue: totalValue }));
      }
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [agent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const results = mockCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.nic.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  const renderSearchTable = (customers: Customer[]) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {customers.map(customer => (
          <tr key={customer.customerId} className="hover:bg-gray-50">
            <td className="px-6 py-4">{customer.name}</td>
            <td className="px-6 py-4">{customer.nic}</td>
            <td className="px-6 py-4 text-right">
              <Link to={`/customer/${customer.customerId}`} className="text-blue-600 hover:text-blue-800">View Details</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {agent?.name}!</p>
        </div>
        {agent?.permissions.includes('CAN_REGISTER_CUSTOMER') && (
          <Button to="/register-customer">
            <FaUserPlus className="mr-2" />
            Register New Customer
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Transactions (Today)" value={stats.transactionsToday} icon={<FaExchangeAlt size={24} />} />
        <StatCard title="My Responsible Customers" value={myCustomers.length} icon={<FaUserPlus size={24} />} />
        <StatCard title="My Portfolio Value" value={`LKR ${stats.portfolioValue.toLocaleString()}`} icon={<FaWallet size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <RecentTransactions />
          <SystemNotifications />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button onClick={() => setActiveTab('myCustomers')} className={`${activeTab === 'myCustomers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}>My Customers</button>
                <button onClick={() => setActiveTab('search')} className={`${activeTab === 'search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}>Customer Search</button>
              </nav>
            </div>
            <div>
              {activeTab === 'myCustomers' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Customers you are responsible for:</h3>
                  <div className="overflow-x-auto">
                    {/* CORRECTED: Added loading check for skeleton UI */}
                    {isLoading ? (
                      <div className="space-y-2">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                      </div>
                    ) : myCustomers.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance (LKR)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {myCustomers.map(customer => (
                            <tr key={customer.customerId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium">{customer.name}</td>
                              <td className="px-6 py-4">{customer.account?.planName || 'N/A'}</td>
                              {/* CORRECTED: Added text-right for alignment */}
                              <td className="px-6 py-4 font-mono text-right">{customer.account?.balance.toLocaleString() || 'N/A'}</td>
                              <td className="px-6 py-4 text-right">
                                <Link to={`/customer/${customer.customerId}`} className="text-blue-600 hover:text-blue-800">View & Report</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p className="text-center py-8 text-gray-500">You are not responsible for any customers yet.</p>}
                  </div>
                </div>
              )}
              {activeTab === 'search' && (
                <div>
                  <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
                    <input type="text" placeholder="Enter customer name or NIC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {/* CORRECTED: Added submit type to button */}
                    <Button type="submit"><FaSearch /></Button>
                  </form>
                  <div className="overflow-x-auto">
                    {hasSearched && searchResults.length > 0 && renderSearchTable(searchResults)}
                    {hasSearched && searchResults.length === 0 && <p className="text-center py-8 text-gray-500">No customers found.</p>}
                    {!hasSearched && <p className="text-center py-8 text-gray-400">Search to see results.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <NewCustomerTracker />
            <DailyPerformanceChart />
            <WeeklyVolumeChart />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardPage;