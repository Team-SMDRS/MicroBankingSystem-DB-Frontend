import { useState, FormEvent } from 'react';
import { ArrowUpFromLine } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DepositFormProps {
  onSuccess?: () => void;
}

export function DepositForm({ onSuccess }: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [accountNo, setAccountNo] = useState('');
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
      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          transaction_type: 'deposit',
          amount: parseFloat(amount),
          to_account_no: accountNo,
          description,
          created_by: 'John Doe',
          status: 'completed',
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setAmount('');
      setAccountNo('');
      setDescription('');

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process deposit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
          <ArrowUpFromLine className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Deposit</h3>
          <p className="text-sm text-slate-500">Deposit funds to an account</p>
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
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
          />
        </div>

        <div>
          <label htmlFor="accountNo" className="block text-sm font-semibold text-slate-700 mb-2">
            Account No
          </label>
          <input
            type="text"
            id="accountNo"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            required
            placeholder="Enter account number"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
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
            placeholder="Enter deposit description"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
            Deposit completed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30"
        >
          {isSubmitting ? 'Processing...' : 'Deposit Funds'}
        </button>
      </form>
    </div>
  );
}
