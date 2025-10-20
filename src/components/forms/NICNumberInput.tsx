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
    <div className="animate-slide-in-right">
      <label htmlFor="nicNumber" className="label-text">
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
        className="flex-1 input-field"
      />
      <button
        type="button"
        onClick={onFetchDetails}
        disabled={isLoading || !nicNumber.trim()}
        className="px-6 py-3 button-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap"
      >
        <Search className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Loading...' : 'Fetch Details'}
      </button>
    </div>
    </div>
  );
};

export default NICNumberInput;
