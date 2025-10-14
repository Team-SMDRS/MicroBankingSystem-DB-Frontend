import { useState } from 'react';
import { PiggyBank, FolderOpen, Unlock } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { OpenFixedDepositForm } from '../forms';
import FixedDepositDetailsDisplay from '../../components/account/FixedDepositDetailsDisplay';
import FixedDepositList from '../../components/account/FixedDepositList';
import MaturedFixedDepositList from '../../components/account/MaturedFixedDepositList';
import { openFixedDeposit } from '../../api/fd';

interface FixedDepositSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const FixedDepositSection = ({ activeSubTab, setActiveSubTab }: FixedDepositSectionProps) => {
  const [searchSavingsAccount, setSearchSavingsAccount] = useState('');
  const [selectedFD, setSelectedFD] = useState<number | null>(null);

  const subTabs = [
    { id: 'open-fixed-deposit', label: 'Open Fixed Deposit', icon: FolderOpen },
    { id: 'fixed-deposit-details', label: 'Fixed Deposits Details', icon: Unlock },
    { id: 'matured-fixed-deposit', label: 'Matured Fixed Deposits', icon: PiggyBank },
  ];

  return (
    <div className="p-8">
      <SectionHeader
        title="Fixed Deposits"
        description="Manage fixed deposit accounts and operations"
      />

      <SubTabGrid
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      <div className="mt-6">
        {activeSubTab === 'open-fixed-deposit' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Open New Fixed Deposit</h3>
            <OpenFixedDepositForm
              onSubmit={async (data) => {
                try {
                  const response = await openFixedDeposit({
                    savingsAccountNo: data.savingsAccountNo,
                    amount: data.amount,
                    planDuration: data.planDuration
                  });
                  // Show success message and optionally navigate to the details view
                  alert(`Fixed Deposit created successfully! Account number: ${response.fd_account_no}`);
                  setActiveSubTab('fixed-deposit-details');
                } catch (error: any) {
                  throw new Error(error.response?.data?.detail || error.message);
                }
              }}
            />
          </div>
        )}

        {activeSubTab === 'fixed-deposit-details' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Select Fixed Deposit Account</h3>
              <div className="mb-4">
                <label htmlFor="savingsAccountNo" className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Savings Account Number
                </label>
                <input
                  type="number"
                  id="savingsAccountNo"
                  value={searchSavingsAccount}
                  onChange={(e) => setSearchSavingsAccount(e.target.value)}
                  placeholder="Enter savings account number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                />
              </div>
              {searchSavingsAccount && (
                <FixedDepositList
                  savingsAccountNo={parseInt(searchSavingsAccount, 10)}
                  onSelectFD={(fdAccountNo) => setSelectedFD(fdAccountNo)}
                />
              )}
            </div>
            
            {selectedFD && (
              <FixedDepositDetailsDisplay fdAccountNo={selectedFD} />
            )}
          </div>
        )}

        {activeSubTab === 'matured-fixed-deposit' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Matured Fixed Deposits</h3>
            <MaturedFixedDepositList />
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;
