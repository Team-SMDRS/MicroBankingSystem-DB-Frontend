// src/pages/TransferPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContex'; // CORRECTED: Casing
import { mockSavingsAccounts } from '../api/testData'; // CORRECTED: File name
import Button from '../components/ui/button'; // CORRECTED: Casing
import toast from 'react-hot-toast';

const TransferPage: React.FC = () => {
  // CORRECTED: Getting both customerId and accountId from the URL
  const { customerId, accountId } = useParams<{ customerId: string, accountId: string }>();
  const navigate = useNavigate();
  const { agent } = useAuth();

  // CORRECTED: Finding the specific source account using the accountId from the URL
  const fromAccount = useMemo(() => 
    mockSavingsAccounts.find(acc => acc.accountId === accountId),
    [accountId]
  );
  
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);

    // Validation
    if (!fromAccount || !transferAmount || transferAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    if (transferAmount > fromAccount.balance) {
      toast.error('Transfer amount exceeds available balance. Overdrafts are not permitted.');
      return;
    }
    if (!toAccountNumber) {
        toast.error('Please enter a destination account number.');
        return;
    }
    if (toAccountNumber === fromAccount.accountId) {
        toast.error('Cannot transfer to the same account.');
        return;
    }

    // Simulate the transfer API call
    toast.success(`Successfully transferred LKR ${transferAmount.toLocaleString()} from ${fromAccount.accountId} to ${toAccountNumber}.`);
    
    // Navigate back to the customer's detail page
    navigate(`/customer/${customerId}`);
  };

  if (!agent?.permissions.includes('CAN_PROCESS_TRANSACTION')) {
    return <div className="p-8 text-center text-red-500">Access Denied.</div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Transfer Funds</h1>
          
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-500">From Account</label>
            <p className="font-semibold text-lg text-gray-800">{fromAccount?.accountId}</p>
            <p className="text-sm text-gray-600">
              Current Balance: <span className="font-mono">LKR {fromAccount?.balance.toLocaleString()}</span>
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">To Account Number</label>
            <input type="text" id="toAccount" value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
          </div>

          <div className="mb-6">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
            <input type="text" id="reference" value={reference} onChange={(e) => setReference(e.target.value)} className="mt-1 w-full p-2 border rounded-md"/>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => navigate(`/customer/${customerId}`)}>Cancel</Button>
            <Button type="submit">Confirm Transfer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferPage;