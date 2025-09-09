// src/components/shared/RecentTransactions.tsx

import React from 'react';
import { mockTransactions, mockSavingsAccounts, mockCustomers } from '../../api/testData';
import { useAuth } from '../../store/authContex';
import { FaArrowUp, FaArrowDown, FaGift } from 'react-icons/fa';

const RecentTransactions: React.FC = () => {
  const { agent } = useAuth();

  // Find the last 5 transactions processed by the current agent
  const recentTransactions = mockTransactions
    .filter(t => t.agentId === agent?.agentId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Helper function to find the customer's name from a transaction
  const getCustomerName = (accountId: string): string => {
    const account = mockSavingsAccounts.find(acc => acc.accountId === accountId);
    const customer = mockCustomers.find(c => c.customerId === account?.customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <FaArrowUp className="text-green-500" />;
      case 'Withdrawal': return <FaArrowDown className="text-red-500" />;
      case 'InterestCredit': return <FaGift className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">My Recent Activity</h3>
      {recentTransactions.length > 0 ? (
        <ul className="space-y-4 overflow-x-auto">
          {recentTransactions.map(t => (
            <li key={t.transactionId} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">{getTransactionIcon(t.type)}</div>
                <div>
                  <p className="font-medium">{getCustomerName(t.accountId)}</p>
                  <p className="text-sm text-gray-500">{t.type}</p>
                </div>
              </div>
              <p
                className={`font-mono font-semibold text-right whitespace-nowrap ${t.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}`}
                title={`${t.type === 'Withdrawal' ? '-' : '+'}${t.amount.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}`}
              >
                {t.type === 'Withdrawal' ? '-' : '+'}
                {t.amount.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You have not processed any transactions yet today.</p>
      )}
    </div>
  );
};

export default RecentTransactions;