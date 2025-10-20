
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
    <div className="bg-white border border-borderLight rounded-2xl shadow-md p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-primary">Account Details</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="button-secondary"
            title="Close"
            aria-label="Close account details"
          >
            Close
          </button>
        )}
      </div>
      <div className="bg-background rounded-2xl p-6 space-y-4">
        <div className="flex flex-col gap-2">
          <span className="text-secondary text-sm">Account Number - <span className="font-semibold text-primary">{accountNumber ?? '-'}</span></span>
          <span className="text-secondary text-sm">Branch - <span className="font-semibold text-primary">{accountDetails.branch_name}</span></span>
          <span className="text-secondary text-sm">Account Type - <span className="font-semibold text-primary">{accountDetails.account_type}</span></span>
          <span className="text-secondary text-sm">Current Balance - <span className="font-bold text-emerald-600">Rs. {accountDetails.balance.toFixed(2)}</span></span>
          <span className="text-secondary text-sm">Status - <span className={`inline-block font-semibold text-white capitalize px-3 py-1 rounded-full border-2 ${getStatusColor(accountDetails.status)}`}>{accountDetails.status}</span></span>
        </div>
        <div className="mt-6">
          <span className="block text-secondary text-sm mb-2">Customer(s)</span>
          {accountDetails.customer_names.split(',').map((name, idx) => (
            <div key={idx} className="mb-4 pl-2 border-l-2 border-borderLight">
              <span className="block text-primary font-semibold">Name - <span className="font-normal">{name.trim()}</span></span>
              {accountDetails.customer_nics && (
                <span className="block text-primary">NIC - <span className="font-normal">{(accountDetails.customer_nics.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_phone_numbers && (
                <span className="block text-primary">Phone - <span className="font-normal">{(accountDetails.customer_phone_numbers.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_addresses && (
                <span className="block text-primary">Address - <span className="font-normal">{(accountDetails.customer_addresses.split(',')[idx] || '').trim()}</span></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDisplay;
