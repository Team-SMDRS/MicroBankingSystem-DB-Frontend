import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import api from '../../../api/axios';

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
      setError(err.response?.data?.message || err.message || 'Failed to process transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Bank Transfer</h3>
          <p className="text-sm text-slate-500">Transfer funds between accounts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
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
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="fromAccount" className="block text-sm font-semibold text-slate-700 mb-2">
            From Account No
          </label>
          <input
            type="text"
            id="fromAccount"
            value={fromAccountNo}
            onChange={(e) => setFromAccountNo(e.target.value)}
            required
            placeholder="Enter source account number"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="block text-sm font-semibold text-slate-700 mb-2">
            To Account No
          </label>
          <input
            type="text"
            id="toAccount"
            value={toAccountNo}
            onChange={(e) => setToAccountNo(e.target.value)}
            required
            placeholder="Enter destination account number"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Enter transaction description"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
            Transfer completed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
        >
          {isSubmitting ? 'Processing...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default BankTransferForm;
