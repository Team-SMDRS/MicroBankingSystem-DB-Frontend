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
      <label htmlFor="accountNo" className="block text-sm font-semibold text-slate-700 mb-2">
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
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
        />
        <button
          type="button"
          onClick={onFetchDetails}
          disabled={isLoading || !accountNo.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Fetch Details'}
        </button>
       
      </div>
    </div>
  );
};

export default AccountNumberInput;
