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
      <label htmlFor="amount" className="block text-sm font-medium text-[#6C757D] mb-2">
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
        className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
      />
      <p className="text-xs text-[#6C757D] mt-2">
        Maximum withdrawal: Rs. {maxAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default AmountInput;
