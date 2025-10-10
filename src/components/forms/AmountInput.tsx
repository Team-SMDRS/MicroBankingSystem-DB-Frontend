interface AmountInputProps {
  amount: string;
  onChange: (value: string) => void;
  maxAmount: number;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const AmountInput = ({ 
  amount, 
  onChange, 
  maxAmount, 
  label = "Withdrawal Amount",
  placeholder = "0.00",
  required = true 
}: AmountInputProps) => {
  return (
    <div>
      <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min="0.01"
        max={maxAmount}
        step="0.01"
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
      />
      <p className="text-xs text-slate-500 mt-1">
        Maximum withdrawal: Rs. {maxAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default AmountInput;
