import React from 'react';
import SectionHeader from '../../components/layout/SectionHeader';

interface FixedDepositSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const FixedDepositSection: React.FC<FixedDepositSectionProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  return (
    <div className="p-8">
      <SectionHeader
        title="Fixed Deposits"
        description="Create and manage fixed deposit accounts"
      />
      
      <div className="mt-6 space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'create'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Create Fixed Deposit
          </button>
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'list'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            View Fixed Deposits
          </button>
        </div>

        {activeSubTab === 'create' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Fixed Deposit</h3>
            <p>Form coming soon...</p>
          </div>
        )}

        {activeSubTab === 'list' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Fixed Deposits</h3>
            <p>List coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;