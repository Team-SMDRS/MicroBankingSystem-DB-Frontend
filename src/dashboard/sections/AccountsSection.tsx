import { Landmark, Users, CreditCard } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { useState } from 'react';

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
  const subTabs = [
    { id: 'account-details', label: 'Account Details', icon: Landmark },
    { id: 'account-customer-details', label: 'Account Customer Details', icon: Users },
    { id: 'all-accounts', label: 'All Accounts', icon: CreditCard },
  ];

  const handleTabClick = (tabId: string) => {
    // Immediately mark the clicked tab active so it shows blue
    setActiveSubTab(tabId);
    // Determine required input
    if (tabId === 'account-details' || tabId === 'account-customer-details') {
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

  const handleSubmitPrompt = (value: string) => {
    setPrompt(null);
    setQueryValue(value || null);
    // Keep the current tab active and set the value
    // Map prompt back to tab id if needed; keep existing activeSubTab if already set
    if (pendingTab) {
      setActiveSubTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleCancelPrompt = () => {
    setPrompt(null);
    setPendingTab(null);
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

      {queryValue && (
        <div className="mb-4 text-sm text-slate-600">Query: {queryValue}</div>
      )}
      {/* <GenericContentCard 
        activeSubTab={activeSubTab}
        subTabs={subTabs}
        description="View and manage"
      /> */}

      {prompt && (
        <PromptInput label={prompt.label} placeholder={prompt.type === 'account' ? 'e.g. SA0001' : 'e.g. 971234567V'} onCancel={handleCancelPrompt} onSubmit={handleSubmitPrompt} />
      )}
    </div>
  );
};

export default AccountsSection;
