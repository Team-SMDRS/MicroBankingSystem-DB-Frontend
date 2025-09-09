// src/pages/TransactionPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/button';

const TransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Customer ID
  const [transactionType, setTransactionType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend API
    alert(`Submitting ${transactionType}:\nAmount: LKR ${amount}\nFor Customer: ${id}`);
    // Reset form
    setAmount('');
    setReference('');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Process Transaction</h1>
          <p className="text-sm text-gray-500 mb-6">For Customer ID: {id}</p>

          {/* Transaction Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'Deposit' | 'Withdrawal')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5000"
              required
            />
          </div>

          {/* Reference */}
          <div className="mb-6">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Cash deposit"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => navigate(`/customer/${id}`)}>
              Cancel
            </Button>
            <Button >
              Submit Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionPage;