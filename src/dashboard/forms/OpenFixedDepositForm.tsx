import { useState } from 'react';
import AmountInput from '../../components/forms/AmountInput';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../api/fd';

interface OpenFixedDepositFormProps {
  onSubmit: (data: { amount: string; savingsAccountNo: number; planDuration: number }) => Promise<void>;
}

const PLAN_DURATIONS = [
  { value: 6, label: '6 Months' },
  { value: 12, label: '1 Year' },
  { value: 24, label: '2 Years' },
  { value: 36, label: '3 Years' },
  { value: 60, label: '5 Years' }
];

// Validation constants
const MIN_DEPOSIT_AMOUNT = 10000; // Rs. 10,000
const MAX_DEPOSIT_AMOUNT = 10000000; // Rs. 10 million
const SAVINGS_ACCOUNT_LENGTH = 10;

const OpenFixedDepositForm = ({ onSubmit }: OpenFixedDepositFormProps) => {
  const [amount, setAmount] = useState('');
  const [savingsAccountNo, setSavingsAccountNo] = useState('');
  const [planDuration, setPlanDuration] = useState(12); // Default to 1 year
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    amount?: string;
    savingsAccountNo?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { amount?: string; savingsAccountNo?: string } = {};

    // Validate savings account number
    if (!savingsAccountNo) {
      errors.savingsAccountNo = 'Savings account number is required';
    } else if (savingsAccountNo.length !== SAVINGS_ACCOUNT_LENGTH) {
      errors.savingsAccountNo = `Account number must be ${SAVINGS_ACCOUNT_LENGTH} digits`;
    }

    // Validate amount
    if (!amount) {
      errors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        errors.amount = 'Please enter a valid amount';
      } else if (numAmount < MIN_DEPOSIT_AMOUNT) {
        errors.amount = `Minimum deposit amount is ${formatCurrency(MIN_DEPOSIT_AMOUNT)}`;
      } else if (numAmount > MAX_DEPOSIT_AMOUNT) {
        errors.amount = `Maximum deposit amount is ${formatCurrency(MAX_DEPOSIT_AMOUNT)}`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ 
        amount,
        savingsAccountNo: parseInt(savingsAccountNo, 10),
        planDuration
      });
      // Reset form on success
      setAmount('');
      setSavingsAccountNo('');
      setPlanDuration(12);
    } catch (err: any) {
      setError(err.message || 'Failed to open fixed deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

      <div className="space-y-4">
        <div>
          <label htmlFor="savingsAccountNo" className="block text-sm font-semibold text-slate-700 mb-2">
            Savings Account Number
          </label>
          <input
            type="number"
            id="savingsAccountNo"
            value={savingsAccountNo}
            onChange={(e) => setSavingsAccountNo(e.target.value)}
            required
            placeholder="Enter savings account number"
            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
              validationErrors.savingsAccountNo 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
            }`}
          />
          {validationErrors.savingsAccountNo && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.savingsAccountNo}</p>
          )}
        </div>

        <div>
          <AmountInput
            label="Deposit Amount"
            amount={amount}
            onChange={(value) => setAmount(value)}
            placeholder="Enter deposit amount"
            required
            maxAmount={MAX_DEPOSIT_AMOUNT}
          />
          {validationErrors.amount && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="planDuration" className="block text-sm font-semibold text-slate-700 mb-2">
            Plan Duration
          </label>
          <select
            id="planDuration"
            value={planDuration}
            onChange={(e) => setPlanDuration(parseInt(e.target.value, 10))}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
          >
            {PLAN_DURATIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <SubmitButton
          isSubmitting={loading}
          className="w-full"
        >
          Open Fixed Deposit
        </SubmitButton>
      </div>
    </form>
  );
};

export default OpenFixedDepositForm;