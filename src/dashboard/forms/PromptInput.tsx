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
    <div className="mt-4 p-4 bg-white border border-[#DEE2E6] rounded-lg shadow-sm w-full border-t-4 border-t-[#2A9D8F]">
      <h4 className="font-medium mb-2 text-[#264653]">{label}</h4>
      <div className="flex gap-3">
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="flex-1 p-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]" />
        <button onClick={() => onSubmit(value)} className="px-3 py-1 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 transition-all">OK</button>
        <button onClick={onCancel} className="px-3 py-1 border border-[#DEE2E6] rounded-lg text-[#6C757D] hover:bg-[#F8F9FA] transition-all">Cancel</button>
      </div>
    </div>
  );
};

export default PromptInput;
