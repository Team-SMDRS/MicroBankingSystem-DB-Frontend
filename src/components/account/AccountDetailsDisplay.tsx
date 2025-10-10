import { User, MapPin, Phone, Building2, DollarSign } from 'lucide-react';
import type { AccountDetails } from '../../features/accounts/useAccountOperations';

interface AccountDetailsDisplayProps {
  accountDetails: AccountDetails;
}

const AccountDetailsDisplay = ({ accountDetails }: AccountDetailsDisplayProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Account Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Customer Name</p>
            <p className="font-medium text-slate-800">{accountDetails.customer_names}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Phone</p>
            <p className="font-medium text-slate-800">{accountDetails.customer_phone_numbers}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Address</p>
            <p className="font-medium text-slate-800">{accountDetails.customer_addresses}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Branch</p>
            <p className="font-medium text-slate-800">{accountDetails.branch_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-slate-500">Current Balance</p>
            <p className="font-bold text-green-600 text-lg">Rs. {accountDetails.balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p className="font-medium text-slate-800 capitalize">{accountDetails.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDisplay;
