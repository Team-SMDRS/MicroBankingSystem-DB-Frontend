import { Search } from 'lucide-react';

interface AccountNumberInputProps {
  accountNo: string;
  onAccountNoChange: (value: string) => void;
  onFetchDetails: () => void;
  isLoading: boolean;
  onDebugAuth: () => void;
}

const AccountNumberInput = ({ 
  accountNo, 
  onAccountNoChange, 
  onFetchDetails, 
  isLoading,

}: AccountNumberInputProps) => {
  return (
    <div>
      <label htmlFor="accountNo" className="block text-sm font-medium text-[#6C757D] mb-2">
        Account Number
      </label>
      <div className="flex gap-4">
        <input
          type="text"
          id="accountNo"
          value={accountNo}
          onChange={(e) => onAccountNoChange(e.target.value)}
          required
          placeholder="Enter account number"
          className="flex-1 px-4 py-2 border border-[#DEE2E6] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
        />
        <button
          type="button"
          onClick={onFetchDetails}
          disabled={isLoading || !accountNo.trim()}
          className="px-5 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Fetch Details'}
        </button>
       
      </div>
    </div>
  );
};

export default AccountNumberInput;
