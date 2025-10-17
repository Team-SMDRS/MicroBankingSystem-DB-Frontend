import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import api from '../../api/axios';

interface BankTransferFormProps {
  onSuccess?: () => void;
}

const BankTransferForm = ({ onSuccess }: BankTransferFormProps) => {
  const [amount, setAmount] = useState('');
  const [fromAccountNo, setFromAccountNo] = useState('');
  const [toAccountNo, setToAccountNo] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/transactions/transfer', {
        transaction_type: 'bank_transfer',
        amount: parseFloat(amount),
        from_account_no: fromAccountNo,
        to_account_no: toAccountNo,
        description,
        status: 'completed',
      });

      if (response.data) {
        setSuccess(true);
        setAmount('');
        setFromAccountNo('');
        setToAccountNo('');
        setDescription('');

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to process transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#2A9D8F]">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E9ECEF]">
        <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-[#2A9D8F]" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#264653]">Bank Transfer</h3>
          <p className="text-sm text-[#6C757D]">Transfer funds between accounts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[#6C757D] mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
          />
        </div>

        <div>
          <label htmlFor="fromAccount" className="block text-sm font-medium text-[#6C757D] mb-2">
            From Account No
          </label>
          <input
            type="text"
            id="fromAccount"
            value={fromAccountNo}
            onChange={(e) => setFromAccountNo(e.target.value)}
            required
            placeholder="Enter source account number"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="block text-sm font-medium text-[#6C757D] mb-2">
            To Account No
          </label>
          <input
            type="text"
            id="toAccount"
            value={toAccountNo}
            onChange={(e) => setToAccountNo(e.target.value)}
            required
            placeholder="Enter destination account number"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#6C757D] mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Enter transaction description"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] resize-none"
          />
        </div>

        {error && (
          <div className="bg-[#E63946] bg-opacity-5 border border-[#E63946] border-opacity-20 text-[#E63946] px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#38B000] bg-opacity-5 border border-[#38B000] border-opacity-20 text-[#38B000] px-4 py-3 rounded-lg">
            Transfer completed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2A9D8F] text-white font-medium py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default BankTransferForm;
