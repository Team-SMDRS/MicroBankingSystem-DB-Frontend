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
      <label htmlFor="description" className="block text-sm font-medium text-[#6C757D] mb-2">
        {label}
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] resize-none"
      />
    </div>
  );
};

export default DescriptionInput;
