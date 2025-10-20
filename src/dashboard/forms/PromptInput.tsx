import React, { useState } from 'react';

interface PromptInputProps {
  label: string;
  placeholder: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ label, placeholder, onCancel, onSubmit }) => {
  const [value, setValue] = useState('');
  return (
    <div className="mt-4 p-6 bg-white border border-borderLight rounded-2xl shadow-md w-full animate-slide-in-right">
      <h4 className="font-semibold text-primary mb-4">{label}</h4>
      <div className="flex gap-3">
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="input-field flex-1" />
        <button onClick={() => onSubmit(value)} className="button-primary px-4 py-2">OK</button>
        <button onClick={onCancel} className="button-secondary px-4 py-2">Cancel</button>
      </div>
    </div>
  );
};

export default PromptInput;
