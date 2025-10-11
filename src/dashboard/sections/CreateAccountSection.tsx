import React from 'react';
import { Users, CreditCard, Trash2 } from 'lucide-react';
import SavingsLookupForm from '../forms/SavingsLookupForm';
import JointLookupForm from '../forms/JointLookupForm';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';

interface CreateAccountSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const CreateAccountSection = ({ activeSubTab, setActiveSubTab }: CreateAccountSectionProps) => {
  const subTabs = [
    { id: 'joint-account-new', label: 'Create Joint Account', icon: Users },
    { id: 'savings-account-new', label: 'Create Savings Account', icon: CreditCard },
    { id: 'close-account', label: 'Close Account', icon: Trash2, danger: true },
  ];

  return (
    <div className="p-8">
      <SectionHeader 
        title="Create Account"
        description="Manage your create-account efficiently and securely"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      {/* Inline simple form: one input for savings, two for joint */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        {activeSubTab === 'savings-account-new' && (
          <SavingsLookupForm />
        )}

        {activeSubTab === 'joint-account-new' && (
          <JointLookupForm />
        )}

        {activeSubTab === 'close-account' && (
          <div className="flex justify-end">
            <CloseAccountAction />
          </div>
        )}
      </div>
    </div>
  );
};

import { accountApi } from '../../api/accounts';

const CloseAccountAction: React.FC = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [confirming, setConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCloseAccount = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await accountApi.closeAccount(Number(accountNo));
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.msg || 'Failed to close account');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="w-full">
      {!result ? (
        <>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="number"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter account number"
                disabled={loading || confirming}
              />
            </div>
            {!confirming && (
              <button
                onClick={() => setConfirming(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md h-[42px]"
                disabled={!accountNo || loading}
              >
                Close Account
              </button>
            )}
          </div>
          {confirming && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-700">Are you sure?</span>
              <button
                onClick={handleCloseAccount}
                className="px-3 py-1 bg-red-700 text-white rounded-md"
                disabled={loading}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-3 py-1 border rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
          {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
        </>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-bold text-blue-700 mb-2">{result.msg}</h4>
          <div className="mb-1"><span className="font-semibold">Account Number:</span> <span className="font-mono">{result.account_no}</span></div>
          <div className="mb-1"><span className="font-semibold">Previous Balance:</span> Rs. {result.previous_balance}</div>
          <div className="mb-1"><span className="font-semibold">Savings Plan:</span> {result.savings_plan_name}</div>
          <div className="mb-1"><span className="font-semibold">Status:</span> <span className="capitalize">{result.status}</span></div>
          <div className="mb-1"><span className="font-semibold">Closed At:</span> {new Date(result.updated_at).toLocaleString()}</div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setResult(null); setAccountNo(''); }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CreateAccountSection;


