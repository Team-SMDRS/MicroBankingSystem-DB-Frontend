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
    <div className="animate-slide-in-right">
      <label htmlFor="accountNo" className="label-text">
        Account Number
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          id="accountNo"
          value={accountNo}
          onChange={(e) => onAccountNoChange(e.target.value)}
          required
          placeholder="Enter account number"
          className="flex-1 input-field"
        />
        <button
          type="button"
          onClick={onFetchDetails}
          disabled={isLoading || !accountNo.trim()}
          className="px-6 py-3 button-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap"
        >
          <Search className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Fetch Details'}
        </button>
       
      </div>
    </div>
  );
};

export default AccountNumberInput;
