import { Search } from 'lucide-react';

interface NICNumberInputProps {
  nicNumber: string;
  onNICNumberChange: (value: string) => void;
  onFetchDetails: () => void;
  isLoading: boolean;
}

const NICNumberInput = ({ 
  nicNumber, 
  onNICNumberChange, 
  onFetchDetails, 
  isLoading,
}: NICNumberInputProps) => {
  return (
    <div>
      <label htmlFor="nicNumber" className="block text-sm font-semibold text-slate-700 mb-2">
        NIC Number
      </label>
    <div className="flex gap-3">
      <input
        type="text"
        id="nicNumber"
        value={nicNumber}
        onChange={(e) => onNICNumberChange(e.target.value)}
        required
        placeholder="Enter NIC number"
        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
      />
      <button
        type="button"
        onClick={onFetchDetails}
        disabled={isLoading || !nicNumber.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        {isLoading ? 'Loading...' : 'Fetch Details'}
      </button>
    </div>
    </div>
  );
};

export default NICNumberInput;
