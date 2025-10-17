import { Building2, Wallet, Tag } from 'lucide-react';

interface AllAccountsDisplayProps {
  accounts: any[];
  onClose: () => void;
  nic?: string;
}

const AllAccountsDisplay = ({ accounts, onClose, nic }: AllAccountsDisplayProps) => {
  return (
    <div className="bg-white border-t-4 border-[#2A9D8F] rounded-xl shadow-lg p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-semibold text-[#264653] flex items-center gap-2">
          All Accounts for NIC
          {nic && (
            <span className="px-3 py-1 bg-[#2A9D8F] bg-opacity-10 text-[#264653] rounded-lg text-base font-mono border border-[#2A9D8F] border-opacity-20">
              {nic}
            </span>
          )}
        </h4>
        <button
          onClick={onClose}
          className="text-[#E63946] hover:text-white hover:bg-[#E63946] text-base font-medium px-4 py-2 rounded-lg border border-[#E63946] border-opacity-20 bg-[#E63946] bg-opacity-5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          title="Close"
          aria-label="Close accounts list"
        >
          Close
        </button>
      </div>
      {accounts.length === 0 ? (
        <div className="text-center text-[#6C757D]">No accounts found for this NIC.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((acc, idx) => (
            <div key={acc.acc_id || idx} className="border border-[#E9ECEF] rounded-lg p-5 bg-[#F8F9FA]">
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#2A9D8F]" />
                <span className="font-medium text-[#264653]">Account Number:</span>
                <span className="font-mono text-[#2A9D8F]">{acc.account_no}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2A9D8F]" />
                <span className="font-medium text-[#264653]">Branch:</span>
                <span className="text-[#264653]">{acc.branch_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#38B000]" />
                <span className="font-medium text-[#264653]">Balance:</span>
                <span className="font-medium text-[#38B000]">Rs. {acc.balance.toLocaleString()}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#2A9D8F]" />
                <span className="font-medium text-[#264653]">Savings Plan:</span>
                <span className="text-[#264653]">{acc.savings_plan_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full border-2 ${
                    acc.status === 'active' ? 'bg-[#38B000]' : 'bg-[#6C757D]'
                  }`}
                ></span>
                <span className="font-medium text-[#264653]">Status:</span>
                <span className="capitalize text-[#264653]">{acc.status}</span>
              </div>
              <div className="text-xs text-[#6C757D] mt-2">
                Opened: {new Date(acc.opened_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAccountsDisplay;
