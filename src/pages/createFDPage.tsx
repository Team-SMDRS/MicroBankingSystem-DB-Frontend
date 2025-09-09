// src/pages/createFDPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContex';
import { mockSavingsAccounts } from '../api/testData';
import Button from '../components/ui/button';
import toast from 'react-hot-toast';
import type { SavingsAccount } from '../types';

const CreateFDPage: React.FC = () => {
  // CORRECTED: Getting customerId to match the router
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { agent } = useAuth();
  
  // Find all savings accounts for this customer
  const customerAccounts = useMemo(() => 
    mockSavingsAccounts.filter(acc => acc.customerId === customerId),
    [customerId]
  );
  
  // Form state
  const [linkedAccountId, setLinkedAccountId] = useState(customerAccounts[0]?.accountId || '');
  const [term, setTerm] = useState('6');
  const [principal, setPrincipal] = useState('');

  const selectedAccount = customerAccounts.find(acc => acc.accountId === linkedAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!selectedAccount) {
        toast.error('Please select a valid account to link the FD to.');
        return;
    }
    if (parseFloat(principal) > selectedAccount.balance) {
        toast.error('Principal amount exceeds the balance of the selected savings account.');
        return;
    }

    alert(`Creating FD:\nTerm: ${term} months\nPrincipal: LKR ${principal}\nLinked to Account: ${linkedAccountId}`);
    setPrincipal('');
    navigate(`/customer/${customerId}`);
  };

  const fdOptions = [
    { term: '6', label: '6 Months - 13% Interest' },
    { term: '12', label: '1 Year - 14% Interest' },
    { term: '36', label: '3 Years - 15% Interest' },
  ];

  if (!agent?.permissions.includes('CAN_CREATE_FD')) {
    return <div className="p-8 text-center text-red-500">Access Denied.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Open a New Fixed Deposit</h1>
          <p className="text-sm text-gray-500 mb-6">For Customer ID: {customerId}</p>
          
          {/* NEW: Dropdown to select the savings account to link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Link to Savings Account</label>
            <select
              value={linkedAccountId}
              onChange={(e) => setLinkedAccountId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {customerAccounts.map(account => (
                <option key={account.accountId} value={account.accountId}>
                  {account.planName} ({account.accountId}) - Balance: LKR {account.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Term</label>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2 border rounded-md">
              {fdOptions.map(option => (
                <option key={option.term} value={option.term}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Principal Amount (LKR)</label>
            <input type="number" id="principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
          </div>
          
          <div className="flex justify-end space-x-3 mt-8">
            <Button type="button" variant="secondary" onClick={() => navigate(`/customer/${customerId}`)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Fixed Deposit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFDPage;