interface DescriptionInputProps {
  description: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const DescriptionInput = ({ 
  description, 
  onChange, 
  label = "Description",
  placeholder = "Enter withdrawal description",
  required = true,
  rows = 3 
}: DescriptionInputProps) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none resize-none"
      />
    </div>
  );
};

export default DescriptionInput;
