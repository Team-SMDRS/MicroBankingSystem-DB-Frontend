import React, { useState, useEffect } from 'react';
import { getFDPlans, openFixedDeposit, type FixedDeposit, type FDPlan } from '../../api/fd';

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
    try {
      const response = await openFixedDeposit({
        savings_account_no: savingsAccountNo,
        amount: Number(amount),
        plan_id: selectedPlanId
      });
      onSuccess(response);
      setSavingsAccountNo('');
      setAmount('');
      setSelectedPlanId('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create fixed deposit';
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
      <div className="bg-background rounded-2xl p-6 text-center border border-borderLight">
        <div className="text-tertiary">Loading FD plans...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="savingsAccountNo" className="label-text">
              Savings Account Number
            </label>
            <input
              type="text"
              id="savingsAccountNo"
              value={savingsAccountNo}
              onChange={(e) => setSavingsAccountNo(e.target.value)}
              className="input-field w-full"
              required
              placeholder="Enter savings account number"
            />
          </div>

          <div>
            <label htmlFor="plan" className="label-text">
              Select FD Plan
            </label>
            <select
              id="plan"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="input-field w-full"
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
            <label htmlFor="amount" className="label-text">
              Deposit Amount (Rs.)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field w-full"
              required
              min="1000"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {selectedPlan && (
          <div className="p-6 bg-background border border-borderLight rounded-2xl space-y-4">
            <h4 className="font-semibold text-primary text-lg">Plan Details</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-borderLight">
                <div className="text-textSecondary">Duration:</div>
                <div className="font-semibold text-primary text-lg">{selectedPlan.duration} months</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-borderLight">
                <div className="text-textSecondary">Interest Rate:</div>
                <div className="font-semibold text-primary text-lg">{selectedPlan.interest_rate}% p.a.</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-borderLight">
                <div className="text-textSecondary">Deposit Amount:</div>
                <div className="font-semibold text-primary text-lg">{amount ? `Rs. ${Number(amount).toFixed(2)}` : '-'}</div>
              </div>
              {amount && (
                <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-borderLight">
                  <div className="text-textSecondary">Maturity Amount:</div>
                  <div className="font-semibold text-emerald-700 text-lg">Rs. {maturityAmount.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !savingsAccountNo || !amount || !selectedPlanId}
            className="button-primary w-full py-3"
          >
            {loading ? 'Creating Fixed Deposit...' : 'Create Fixed Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export { CreateFixedDepositForm };
