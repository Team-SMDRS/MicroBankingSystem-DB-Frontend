import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/button';
import toast from 'react-hot-toast';
import { mockSavingsAccounts } from '../api/testData';

const TransactionPage: React.FC = () => {
  const { customerId, accountId } = useParams<{ customerId: string, accountId: string }>();
  const navigate = useNavigate();

  const [transactionType, setTransactionType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  // Find the relevant account for this transaction
  const selectedAccount = useMemo(
    () => mockSavingsAccounts.find(acc => acc.accountId === accountId && acc.customerId === customerId),
    [accountId, customerId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionAmount = parseFloat(amount);

    if (transactionType === 'Withdrawal') {
      if (!selectedAccount || transactionAmount > selectedAccount.balance) {
        toast.error('Withdrawal amount exceeds available balance.');
        return;
      }
    }

    toast.success(`${transactionType} of LKR ${transactionAmount.toLocaleString()} for account ${accountId} was successful.`);
    navigate(`/customer/${customerId}`);
  };

  if (!selectedAccount) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Account Not Found</h1>
        <p className="mt-2">The specified account does not exist for this customer.</p>
        <Button variant="secondary" onClick={() => navigate(`/customer/${customerId}`)}>Back</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Process Transaction</h1>

          {/* Static account info */}
          <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-500">Account</label>
            <p className="font-semibold text-lg text-slate-800">{selectedAccount.planName} ({selectedAccount.accountId})</p>
            <p className="text-sm text-slate-600">
              Current Balance: <span className="font-mono">LKR {selectedAccount.balance.toLocaleString()}</span>
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'Deposit' | 'Withdrawal')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Reference (Optional)</label>
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => navigate(`/customer/${customerId}`)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionPage;