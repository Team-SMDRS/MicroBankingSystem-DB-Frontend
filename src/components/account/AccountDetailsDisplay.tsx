import { User, MapPin, Building2, DollarSign, Tag } from 'lucide-react';
import type { AccountDetails } from '../../features/accounts/useAccountOperations';

interface AccountDetailsDisplayProps {
  accountDetails: AccountDetails;
  accountNumber?: string;
  onClose?: () => void;
}

const AccountDetailsDisplay = ({ accountDetails, accountNumber, onClose }: AccountDetailsDisplayProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Account Details
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-white hover:bg-red-600 text-base font-semibold px-4 py-2 rounded-full border border-red-200 bg-red-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Close"
            aria-label="Close account details"
          >
            Close
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-blue-500" />
            <div>
              <span className="block text-xs text-slate-500">Account Number</span>
              <span className="block font-semibold text-slate-800 text-lg">{accountNumber ?? '-'}</span>
            </div>
          </div>
          {/* Customer Names, NICs, Phone Numbers - grouped */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <span className="block text-xs text-slate-500">Customer(s)</span>
              {accountDetails.customer_names.split(',').map((name, idx) => (
                <div key={idx} className="font-semibold text-slate-800 text-lg mb-2">
                  {name.trim()}
                  {accountDetails.customer_nics && (
                    <span className="block text-xs text-slate-500">NIC: <span className="font-normal text-slate-700">{(accountDetails.customer_nics.split(',')[idx] || '').trim()}</span></span>
                  )}
                  {accountDetails.customer_phone_numbers && (
                    <span className="block text-xs text-slate-500">Phone: <span className="font-normal text-slate-700">{(accountDetails.customer_phone_numbers.split(',')[idx] || '').trim()}</span></span>
                  )}
                  {accountDetails.customer_addresses && (
                    <span className="block text-xs text-slate-500">Address: <span className="font-normal text-slate-700">{(accountDetails.customer_addresses.split(',')[idx] || '').trim()}</span></span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <span className="block text-xs text-slate-500">Address</span>
              <span className="block font-semibold text-slate-800 text-lg">{accountDetails.customer_addresses}</span>
            </div>
          </div> */}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-500" />
            <div>
              <span className="block text-xs text-slate-500">Branch</span>
              <span className="block font-semibold text-slate-800 text-lg">{accountDetails.branch_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <span className="block text-xs text-slate-500">Current Balance</span>
              <span className="block font-bold text-green-600 text-xl">Rs. {accountDetails.balance.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-blue-500" />
            <div>
              <span className="block text-xs text-slate-500">Account Type</span>
              <span className="block font-semibold text-slate-800 text-lg">{accountDetails.account_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 ${getStatusColor(accountDetails.status)}`}></div>
            <div>
              <span className="block text-xs text-slate-500">Status</span>
              <span className="block font-semibold text-slate-800 capitalize text-lg">{accountDetails.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDisplay;
