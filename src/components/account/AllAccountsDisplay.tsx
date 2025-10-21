import { Building2, Wallet, Tag } from 'lucide-react';

interface AllAccountsDisplayProps {
  accounts: any[];
  onClose: () => void;
  nic?: string;
}

const AllAccountsDisplay = ({ accounts, onClose, nic }: AllAccountsDisplayProps) => {
  return (
    <div className="bg-white border border-borderLight rounded-2xl shadow-md p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-primary flex items-center gap-2">
          All Accounts for NIC
          {nic && (
            <span className="px-3 py-1 bg-tertiary text-primary rounded-full text-base font-mono border border-borderLight">
              {nic}
            </span>
          )}
        </h4>
        <button
          onClick={onClose}
          className="button-secondary"
          title="Close"
          aria-label="Close accounts list"
        >
          Close
        </button>
      </div>
      {accounts.length === 0 ? (
        <div className="text-center text-textSecondary">No accounts found for this NIC.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((acc, idx) => (
            <div key={acc.acc_id || idx} className="border border-borderLight rounded-2xl p-5 bg-background">
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-textSecondary" />
                <span className="font-semibold text-textSecondary">Account Number:</span>
                <span className="font-mono text-primary">{acc.account_no}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-textSecondary" />
                <span className="font-semibold text-textSecondary">Branch:</span>
                <span className="text-primary">{acc.branch_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-textSecondary">Balance:</span>
                <span className="font-bold text-emerald-600">Rs. {acc.balance.toLocaleString()}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-textSecondary" />
                <span className="font-semibold text-textSecondary">Savings Plan:</span>
                <span className="text-primary">{acc.savings_plan_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full border-2 ${
                    acc.status === 'active' ? 'bg-emerald-500' : 'bg-tertiary'
                  }`}
                ></span>
                <span className="font-semibold text-textSecondary">Status:</span>
                <span className="capitalize text-primary font-medium">{acc.status}</span>
              </div>
              <div className="text-xs text-textSecondary mt-2">
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
