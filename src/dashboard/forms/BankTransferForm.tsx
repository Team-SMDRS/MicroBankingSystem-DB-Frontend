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
    <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-borderLight">
        <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-xl flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-textSecondary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary">Bank Transfer</h3>
          <p className="text-sm text-textSecondary">Transfer funds between accounts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="label-text">
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
            className="input-field w-full"
          />
        </div>

        <div>
          <label htmlFor="fromAccount" className="label-text">
            From Account No
          </label>
          <input
            type="text"
            id="fromAccount"
            value={fromAccountNo}
            onChange={(e) => setFromAccountNo(e.target.value)}
            required
            placeholder="Enter source account number"
            className="input-field w-full"
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="label-text">
            To Account No
          </label>
          <input
            type="text"
            id="toAccount"
            value={toAccountNo}
            onChange={(e) => setToAccountNo(e.target.value)}
            required
            placeholder="Enter destination account number"
            className="input-field w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-text">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Enter transaction description"
            className="input-field w-full resize-none"
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
          className="button-primary w-full"
        >
          {isSubmitting ? 'Processing...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default BankTransferForm;
