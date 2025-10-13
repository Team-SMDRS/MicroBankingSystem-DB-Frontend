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
    <div className="mt-4 p-4 bg-white border rounded-lg shadow w-full">
      <h4 className="font-semibold mb-2">{label}</h4>
      <div className="flex gap-3">
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="flex-1 p-2 border rounded-lg" />
        <button onClick={() => onSubmit(value)} className="px-3 py-1 bg-blue-600 text-white rounded-md">OK</button>
        <button onClick={onCancel} className="px-3 py-1 border rounded-md">Cancel</button>
      </div>
    </div>
  );
};

export default PromptInput;
