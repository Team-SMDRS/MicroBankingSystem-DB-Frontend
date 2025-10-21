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
    <div className="animate-slide-in-right">
      <label htmlFor="amount" className="label-text">
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
        className="input-field w-full"
      />
      <p className="text-xs text-tertiary font-medium mt-2">
        Maximum withdrawal: Rs. {maxAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default AmountInput;
