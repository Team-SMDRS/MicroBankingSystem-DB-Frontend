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
      <label htmlFor="nicNumber" className="block text-sm font-medium text-[#264653] mb-2">
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
        className="flex-1 px-4 py-3 rounded-lg border border-[#DEE2E6] focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F] focus:ring-opacity-20 transition-all outline-none"
      />
      <button
        type="button"
        onClick={onFetchDetails}
        disabled={isLoading || !nicNumber.trim()}
        className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238579] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        {isLoading ? 'Loading...' : 'Fetch Details'}
      </button>
    </div>
    </div>
  );
};

export default NICNumberInput;
