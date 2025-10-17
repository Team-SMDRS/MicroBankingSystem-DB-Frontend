
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
        return 'bg-[#38B000]';
      case 'inactive':
        return 'bg-[#F4A261]';
      case 'closed':
        return 'bg-[#E63946]';
      default:
        return 'bg-[#6C757D]';
    }
  };

  return (
    <div className="bg-white border border-[#E9ECEF] rounded-lg shadow-lg p-6 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-[#264653]">Account Details</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#E63946] hover:text-white hover:bg-[#E63946] text-sm font-medium px-4 py-2 rounded-lg border border-[#E63946] bg-white transition-colors duration-200 focus:outline-none"
            title="Close"
            aria-label="Close account details"
          >
            Close
          </button>
        )}
      </div>
      <div className="bg-[#F8F9FA] rounded-lg p-5 space-y-4 border border-[#E9ECEF]">
        <div className="flex flex-col gap-3">
          <span className="text-[#6C757D] text-sm">Account Number - <span className="font-medium text-[#264653]">{accountNumber ?? '-'}</span></span>
          <span className="text-[#6C757D] text-sm">Branch - <span className="font-medium text-[#264653]">{accountDetails.branch_name}</span></span>
          <span className="text-[#6C757D] text-sm">Account Type - <span className="font-medium text-[#264653]">{accountDetails.account_type}</span></span>
          <span className="text-[#6C757D] text-sm">Current Balance - <span className="font-semibold text-[#38B000]">Rs. {accountDetails.balance.toFixed(2)}</span></span>
          <span className="text-[#6C757D] text-sm">Status - <span className={`inline-block font-medium text-white capitalize px-3 py-1 rounded-lg text-xs ${getStatusColor(accountDetails.status)}`}>{accountDetails.status}</span></span>
        </div>
        <div className="mt-6">
          <span className="block text-[#6C757D] text-sm mb-3">Customer(s)</span>
          {accountDetails.customer_names.split(',').map((name, idx) => (
            <div key={idx} className="mb-4 pl-3 border-l-2 border-[#2A9D8F]">
              <span className="block text-[#264653] font-medium">Name - <span className="font-normal">{name.trim()}</span></span>
              {accountDetails.customer_nics && (
                <span className="block text-[#264653]">NIC - <span className="font-normal">{(accountDetails.customer_nics.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_phone_numbers && (
                <span className="block text-[#264653]">Phone - <span className="font-normal">{(accountDetails.customer_phone_numbers.split(',')[idx] || '').trim()}</span></span>
              )}
              {accountDetails.customer_addresses && (
                <span className="block text-[#264653]">Address - <span className="font-normal">{(accountDetails.customer_addresses.split(',')[idx] || '').trim()}</span></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDisplay;
