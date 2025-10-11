import { Landmark, Users, CreditCard } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import AccountDetailsDisplay from '../../components/account/AccountDetailsDisplay';
import { useState } from 'react';
import { accountApi } from '../../api/accounts';
import type { AccountDetails } from '../../features/accounts/useAccountOperations';
import Alert from '../../components/common/Alert';

// Inline prompt shown below the subtab buttons to request account number or NIC
const PromptInput = ({ label, placeholder, onCancel, onSubmit }: { label: string; placeholder: string; onCancel: () => void; onSubmit: (value: string) => void }) => {
  const [value, setValue] = useState('');
  return (
    <div className="mt-4 p-4 bg-white border rounded-lg shadow w-full">
      <h4 className="font-semibold mb-2">{label}</h4>
      <div className="flex gap-3">
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="flex-1 p-2 border rounded-lg" />
        <button onClick={() => onSubmit(value)} className="px-3 py-1 bg-blue-600 text-white rounded-md">OK</button>
        <button onClick={onCancel} className="px-3 py-1 border rounded-md">Cancel</button>
      </div>
    </div>
  );
};

interface AccountsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const AccountsSection = ({ activeSubTab, setActiveSubTab }: AccountsSectionProps) => {
  const [prompt, setPrompt] = useState<null | { type: 'account' | 'nic'; label: string }>(null);
  const [queryValue, setQueryValue] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subTabs = [
    { id: 'account-details', label: 'Account Details', icon: Landmark },
    { id: 'account-customer-details', label: 'Account Owner Details', icon: Users },
    { id: 'all-accounts', label: 'All Accounts', icon: CreditCard },
  ];

  const handleTabClick = (tabId: string) => {
    // Immediately mark the clicked tab active so it shows blue
    setActiveSubTab(tabId);
    setError(null);
    setAccountDetails(null);
    
    // Determine required input
    if (tabId === 'account-details') {
      setPendingTab(tabId);
      setPrompt({ type: 'nic', label: 'Enter NIC to view account details' });
    } else if (tabId === 'account-customer-details') {
      setPendingTab(tabId);
      setPrompt({ type: 'account', label: 'Enter account number' });
    } else if (tabId === 'all-accounts') {
      setPendingTab(tabId);
      setPrompt({ type: 'nic', label: 'Enter NIC to search all accounts' });
    } else {
      setPrompt(null);
      setPendingTab(null);
    }
  };

  const handleSubmitPrompt = async (value: string) => {
    if (!value.trim()) {
      setError('Please enter a valid input');
      return;
    }
    
    setPrompt(null);
    setQueryValue(value || null);
    setLoading(true);
    setError(null);
    setAccountDetails(null);
    
    try {
      if (pendingTab === 'account-details' && prompt?.type === 'nic') {
        // Fetch account details by NIC
        const details = await accountApi.getDetailsByNic(value.trim());
        setAccountDetails(details);
      } else if (pendingTab === 'account-details' && prompt?.type === 'account') {
        // Fetch account details by account number
        const accountNumber = parseInt(value.trim());
        if (isNaN(accountNumber)) {
          setError('Please enter a valid account number');
          return;
        }
        const details = await accountApi.getDetails(accountNumber);
        setAccountDetails(details);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No account found with the provided details');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      }
      console.error('Error fetching account details:', err);
    } finally {
      setLoading(false);
    }
    
    // Keep the current tab active and set the value
    if (pendingTab) {
      setActiveSubTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleCancelPrompt = () => {
    setPrompt(null);
    setPendingTab(null);
    setError(null);
    setAccountDetails(null);
  };

  return (
    <div className="p-8">
      <SectionHeader 
        title="Accounts"
        description="Manage your accounts efficiently and securely"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={handleTabClick}
      />

      {prompt && (
        <PromptInput 
          label={prompt.label} 
          placeholder={prompt.type === 'account' ? 'e.g. SA0001' : 'e.g. 971234567V'} 
          onCancel={handleCancelPrompt} 
          onSubmit={handleSubmitPrompt} 
        />
      )}

      {loading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700">Loading account details...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6">
          <Alert type="error">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Error</h4>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </Alert>
        </div>
      )}

      {accountDetails && activeSubTab === 'account-details' && (
        <div className="mt-6 w-full">
          <AccountDetailsDisplay 
            accountDetails={accountDetails}
            accountNumber={queryValue ?? ''}
            onClose={() => {
              setAccountDetails(null);
              setQueryValue(null);
              setPendingTab('account-details');
              setPrompt({ type: 'nic', label: 'Enter NIC to view account details' });
            }}
          />
        </div>
      )}

      {/* {queryValue && !loading && !error && !accountDetails && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-slate-600">Query: {queryValue}</p>
          <p className="text-sm text-slate-500 mt-1">No results found for this query.</p>
        </div>
      )} */}
    </div>
  );
};

export default AccountsSection;
