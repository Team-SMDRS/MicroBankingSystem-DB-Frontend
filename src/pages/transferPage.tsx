import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContex';
import { mockSavingsAccounts, mockCustomers, mockAgents, mockBranches } from '../api/testData';
import Button from '../components/ui/button';
import toast from 'react-hot-toast';

const TransferPage: React.FC = () => {
  // --- Hooks for navigation and URL data ---
  const { customerId, accountId } = useParams<{ customerId: string, accountId: string }>();
  const navigate = useNavigate();
  const { agent } = useAuth();

  // --- State for the form inputs ---
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<string | null>(null);

  // --- Data fetching and filtering ---
  // UPDATED: Logic is now simpler. It only finds the one account from the URL.
  const fromAccount = useMemo(() => 
    mockSavingsAccounts.find(acc => acc.accountId === accountId),
    [accountId]
  );

  // Effect to look up recipient details as the agent types
  useEffect(() => {
    if (toAccountNumber.length >= 5) {
      const recipientAccount = mockSavingsAccounts.find(acc => acc.accountId === toAccountNumber);
      if (recipientAccount) {
        const recipientCustomer = mockCustomers.find(c => c.customerId === recipientAccount.customerId);
        const recipientAgent = mockAgents.find(a => a.agentId === recipientCustomer?.assignedAgentId);
        const branch = mockBranches.find(b => b.branchId === recipientAgent?.branchId);
        if (recipientCustomer && branch) {
          setRecipientInfo(`${recipientCustomer.name} - ${branch.name}`);
        }
      } else {
        setRecipientInfo(null);
      }
    } else {
      setRecipientInfo(null);
    }
  }, [toAccountNumber, mockSavingsAccounts, mockCustomers, mockAgents, mockBranches]); // Added dependencies

  // --- Form submission handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);

    if (!fromAccount || transferAmount > fromAccount.balance) {
      toast.error('Transfer amount exceeds available balance.');
      return;
    }
    if (!recipientInfo) {
      toast.error('Recipient account not found or invalid.');
      return;
    }
    
    toast.success(`Transfer of LKR ${transferAmount.toLocaleString()} initiated.`);
    navigate(`/customer/${customerId}`);
  };
  
  // --- Permission Check ---
  if (!agent?.permissions.includes('CAN_PROCESS_TRANSACTION')) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to perform this action.</p>
      </div>
    );
  }
  
  // --- JSX for the form ---
  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Transfer Funds</h1>
          
          {/* UPDATED: "From Account" is now a static display, not a dropdown */}
          <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-500">From Account</label>
            <p className="font-semibold text-lg text-slate-800">{fromAccount?.accountId}</p>
            <p className="text-sm text-slate-600">
              Current Balance: <span className="font-mono">LKR {fromAccount?.balance.toLocaleString()}</span>
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">To Account Number</label>
            <input type="text" id="toAccount" value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
            {recipientInfo && (
                <div className="mt-2 p-2 bg-green-50 text-green-800 text-sm rounded-md">
                    <strong>Recipient:</strong> {recipientInfo}
                </div>
            )}
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