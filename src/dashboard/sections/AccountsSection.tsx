import { Landmark, CreditCard } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import AccountDetailsDisplay from '../../components/account/AccountDetailsDisplay';
import { useState } from 'react';
import AllAccountsDisplay from '../../components/account/AllAccountsDisplay';
import { accountApi } from '../../api/accounts';
import type { AccountDetails } from '../../features/accounts/useAccountOperations';
import Alert from '../../components/common/Alert';
import NICNumberInput from '../../components/forms/NICNumberInput';
import AccountNumberInput from '../../components/forms/AccountNumberInput';

interface AccountsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const AccountsSection = ({ activeSubTab, setActiveSubTab }: AccountsSectionProps) => {
  const [prompt, setPrompt] = useState<null | { type: 'account' | 'nic'; label: string }>(null);
  const [queryValue, setQueryValue] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [nicInput, setNicInput] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [allAccounts, setAllAccounts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subTabs = [
    { id: 'account-details', label: 'Account Details ', icon: Landmark },
    { id: 'all-accounts', label: 'All Accounts', icon: CreditCard },
  ];

  const handleTabClick = (tabId: string) => {
    // Immediately mark the clicked tab active so it shows blue
    setActiveSubTab(tabId);
    setError(null);
  setAccountDetails(null);
  setAllAccounts(null);
    
    // Determine required input
    if (tabId === 'account-details') {
      setPendingTab(tabId);
      setPrompt({ type: 'nic', label: 'Enter account number to view account details' });
    } else if (tabId === 'all-accounts') {
      setPendingTab(tabId);
      setPrompt({ type: 'nic', label: 'Enter NIC to search all accounts' });
    } else {
      setPrompt(null);
      setPendingTab(null);
    }
  };

  const handleSubmitNIC = async () => {
    if (!nicInput.trim()) {
      setError('Please enter a valid NIC');
      return;
    }
    setPrompt(null);
    setQueryValue(nicInput);
    setLoading(true);
    setError(null);
    setAccountDetails(null);
    try {
      const accounts = await accountApi.getAccountsByNic(nicInput.trim());
      setAllAccounts(accounts);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No account found with the provided NIC');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      }
    } finally {
      setLoading(false);
    }
    if (pendingTab) {
      setActiveSubTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleSubmitAccount = async () => {
    if (!accountInput.trim()) {
      setError('Please enter a valid account number');
      return;
    }
    setPrompt(null);
    setQueryValue(accountInput);
    setLoading(true);
    setError(null);
    setAccountDetails(null);
    try {
      const accountNumber = parseInt(accountInput.trim());
      if (isNaN(accountNumber)) {
        setError('Please enter a valid account number');
        return;
      }
      const details = await accountApi.getDetails(accountNumber);
      setAccountDetails(details);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No account found with the provided details');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      }
    } finally {
      setLoading(false);
    }
    if (pendingTab) {
      setActiveSubTab(pendingTab);
      setPendingTab(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
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
          <div className="mt-4 bg-white p-6 rounded-2xl shadow-md border border-borderLight animate-slide-down">
            {pendingTab === 'account-details' ? (
              <AccountNumberInput
                accountNo={accountInput}
                onAccountNoChange={setAccountInput}
                onFetchDetails={handleSubmitAccount}
                isLoading={loading}
                onDebugAuth={() => {}}
              />
            ) : (
              <NICNumberInput
                nicNumber={nicInput}
                onNICNumberChange={setNicInput}
                onFetchDetails={handleSubmitNIC}
                isLoading={loading}
              />
            )}
          </div>
        )}
        {allAccounts && activeSubTab === 'all-accounts' && (
          <div className="mt-6 w-full animate-slide-in-right">
              <AllAccountsDisplay 
                accounts={allAccounts} 
                nic={queryValue ?? undefined}
                onClose={() => {
                  setAllAccounts(null);
                  setQueryValue(null);
                  setPendingTab('all-accounts');
                  setPrompt({ type: 'nic', label: 'Enter NIC to search all accounts' });
                }} 
              />
          </div>
        )}
        {loading && (
          <div className="mt-6 p-4 bg-blue-50 border border-secondary rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>
              <p className="text-secondary font-medium">Loading account details...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-6 animate-slide-down">
            <Alert type="error">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Error</h4>
                  <p>{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            </Alert>
          </div>
        )}
        {accountDetails && activeSubTab === 'account-details' && (
          <div className="mt-6 w-full animate-slide-in-right">
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
      </div>
    </div>
  );
};

export default AccountsSection;
