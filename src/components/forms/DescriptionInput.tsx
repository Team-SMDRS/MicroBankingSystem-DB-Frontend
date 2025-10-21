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
    <div className="animate-slide-in-right">
      <label htmlFor="description" className="label-text">
        {label}
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="input-field w-full resize-none"
      />
    </div>
  );
};

export default DescriptionInput;
