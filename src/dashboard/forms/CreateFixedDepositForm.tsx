import React, { useState, useEffect } from 'react';
import { getFDPlans, openFixedDeposit, type FixedDeposit, type FDPlan } from '../../api/fd';
import { Wallet } from 'lucide-react';

interface CreateFixedDepositFormProps {
  onSuccess: (fd: FixedDeposit) => void;
  onError: (error: string) => void;
}

const CreateFixedDepositForm = ({ onSuccess, onError }: CreateFixedDepositFormProps) => {
  const [savingsAccountNo, setSavingsAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [plans, setPlans] = useState<FDPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getFDPlans();
        setPlans(data);
      } catch (err) {
        console.error('Error fetching FD plans:', err);
        onError('Failed to load FD plans');
      } finally {
        setFetchingPlans(false);
      }
    };

    fetchPlans();
  }, [onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingsAccountNo || !amount || !selectedPlanId) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await openFixedDeposit({
        savings_account_no: savingsAccountNo,
        amount: Number(amount),
        plan_id: selectedPlanId
      });
      setSuccess(true);
      onSuccess(response);
      setSavingsAccountNo('');
      setAmount('');
      setSelectedPlanId('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create fixed deposit';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.fd_plan_id === selectedPlanId);
  const maturityAmount = selectedPlan && amount 
    ? Number(amount) * (1 + (Number(selectedPlan.interest_rate) / 100) * (selectedPlan.duration / 12))
    : 0;

  if (fetchingPlans) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
        <div className="text-slate-600">Loading FD plans...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Fixed Deposit</h3>
          <p className="text-sm text-slate-500">Open a new fixed deposit account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="savingsAccountNo" className="block text-sm font-semibold text-slate-700 mb-2">
            Savings Account Number
          </label>
          <input
            type="text"
            id="savingsAccountNo"
            value={savingsAccountNo}
            onChange={(e) => setSavingsAccountNo(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            required
            placeholder="Enter savings account number"
          />
        </div>

        <div>
          <label htmlFor="plan" className="block text-sm font-semibold text-slate-700 mb-2">
            Select FD Plan
          </label>
          <select
            id="plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            required
          >
            <option value="">-- Select a plan --</option>
            {plans.map((plan) => (
              <option key={plan.fd_plan_id} value={plan.fd_plan_id}>
                {plan.duration} months @ {plan.interest_rate}% p.a.
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
            Deposit Amount (Rs.)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            required
            min="1000"
            placeholder="Enter amount"
          />
          <p className="mt-1 text-xs text-slate-500">Minimum: Rs. 1,000</p>
        </div>

        {selectedPlan && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
            <h4 className="font-semibold text-slate-800">Plan Details</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-slate-600">Duration</div>
                <div className="font-semibold text-slate-800">{selectedPlan.duration} months</div>
              </div>
              <div>
                <div className="text-slate-600">Rate</div>
                <div className="font-semibold text-slate-800">{selectedPlan.interest_rate}%</div>
              </div>
              {amount && (
                <div>
                  <div className="text-slate-600">Maturity Amount</div>
                  <div className="font-semibold text-blue-700">Rs. {maturityAmount.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
            Fixed deposit created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !savingsAccountNo || !amount || !selectedPlanId}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
        >
          {loading ? 'Creating...' : 'Create Fixed Deposit'}
        </button>
      </form>
    </div>
  );
};

export { CreateFixedDepositForm };
