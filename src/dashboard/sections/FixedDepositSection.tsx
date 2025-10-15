import React, { useState } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import CreateFixedDepositForm from '../forms/CreateFixedDepositForm';
import FixedDepositList from '../forms/FixedDepositList';
import Alert from '../../components/common/Alert';
import { fdApi } from '../../features/fd';

interface FixedDepositSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const FixedDepositSection: React.FC<FixedDepositSectionProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateFD = async (data: { amount: number; planId: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fdApi.createDeposit({
        plan_id: data.planId,
        amount: data.amount
      });

      setSuccess('Fixed Deposit created successfully');
      setActiveSubTab('list'); // Switch to list view after successful creation
    } catch (err: any) {
      setError(err.message || 'Failed to create fixed deposit');
    } finally {
      setLoading(false);
    }
  };

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

        {success && <Alert type="success">{success}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        {activeSubTab === 'create' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Fixed Deposit</h3>
            <CreateFixedDepositForm onSubmit={handleCreateFD} isLoading={loading} />
          </div>
        )}

        {activeSubTab === 'list' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Fixed Deposits</h3>
            <FixedDepositList />
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;