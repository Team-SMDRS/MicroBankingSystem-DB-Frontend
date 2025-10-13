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
        <h4 className="text-2xl font-bold text-blue-700">Account Details</h4>
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
      <div className="bg-blue-50 rounded-xl p-6 space-y-4">
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 text-sm">Account Number - <span className="font-semibold text-slate-800">{accountNumber ?? '-'}</span></span>
          <span className="text-slate-500 text-sm">Branch - <span className="font-semibold text-slate-800">{accountDetails.branch_name}</span></span>
          <span className="text-slate-500 text-sm">Account Type - <span className="font-semibold text-slate-800">{accountDetails.account_type}</span></span>
          <span className="text-slate-500 text-sm">Current Balance - <span className="font-bold text-green-600">Rs. {accountDetails.balance.toFixed(2)}</span></span>
          <span className="text-slate-500 text-sm">Status - <span className={`inline-block font-semibold text-slate-800 capitalize px-3 py-1 rounded-full border-2 ${getStatusColor(accountDetails.status)}`}>{accountDetails.status}</span></span>
        </div>
        <div className="mt-6">
          <span className="block text-slate-500 text-sm mb-2">Customer(s)</span>
          {accountDetails.customer_names.split(',').map((name, idx) => (
            <div key={idx} className="mb-4 pl-2 border-l-2 border-blue-100">
              <span className="block text-slate-700 font-semibold">Name - <span className="font-normal">{name.trim()}</span></span>
              {accountDetails.customer_nics && (
                <span className="block text-slate-700">NIC - <span className="font-normal">{(accountDetails.customer_nics.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_phone_numbers && (
                <span className="block text-slate-700">Phone - <span className="font-normal">{(accountDetails.customer_phone_numbers.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_addresses && (
                <span className="block text-slate-700">Address - <span className="font-normal">{(accountDetails.customer_addresses.split(',')[idx] || '').trim()}</span></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDisplay;
