import { Building2, Wallet, Tag } from 'lucide-react';

interface AllAccountsDisplayProps {
  accounts: any[];
  onClose: () => void;
  nic?: string;
}

const AllAccountsDisplay = ({ accounts, onClose, nic }: AllAccountsDisplayProps) => {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          All Accounts for NIC
          {nic && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-base font-mono border border-blue-300">
              {nic}
            </span>
          )}
        </h4>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-white hover:bg-red-600 text-base font-semibold px-4 py-2 rounded-full border border-red-200 bg-red-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Close"
          aria-label="Close accounts list"
        >
          Close
        </button>
      </div>
      {accounts.length === 0 ? (
        <div className="text-center text-slate-500">No accounts found for this NIC.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((acc, idx) => (
            <div key={acc.acc_id || idx} className="border rounded-xl p-5 bg-blue-50">
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-800">Account Number:</span>
                <span className="font-mono text-blue-700">{acc.account_no}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-800">Branch:</span>
                <span>{acc.branch_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-slate-800">Balance:</span>
                <span className="font-bold text-green-600">Rs. {acc.balance.toLocaleString()}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-800">Savings Plan:</span>
                <span>{acc.savings_plan_name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full border-2 ${
                    acc.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></span>
                <span className="font-semibold text-slate-800">Status:</span>
                <span className="capitalize">{acc.status}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
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
