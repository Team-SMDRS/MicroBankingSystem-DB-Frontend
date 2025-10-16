import React, { useState } from 'react';
import { PlusSquare, Search, Wallet } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import CreateFixedDepositForm from '../forms/CreateFixedDepositForm';
import FixedDepositList from '../forms/FixedDepositList';
import CreateFDPlanForm from '../forms/CreateFDPlanForm';
import SearchFDPlanForm from '../forms/SearchFDPlanForm';
import Alert from '../../components/common/Alert';
import { fdApi, type FDPlanDetails, type CreateFDPlan } from '../../features/fd';

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
  const [selectedPlan, setSelectedPlan] = useState<FDPlanDetails | null>(null);
  const [createdPlan, setCreatedPlan] = useState<FDPlanDetails | null>(null);

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

  const handleCreateFDPlan = async (data: CreateFDPlan) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setCreatedPlan(null);
    try {
      const newPlan = await fdApi.createPlan(data);
      if (newPlan) {
        setSuccess('FD Plan created successfully');
        setCreatedPlan(newPlan);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create FD Plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: FDPlanDetails) => {
    setSelectedPlan(plan);
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
          <button
            onClick={() => setActiveSubTab('create-plan')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'create-plan'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Create FD Plan
          </button>
          <button
            onClick={() => setActiveSubTab('search-plan')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'search-plan'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Search FD Plans
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

        {activeSubTab === 'create-plan' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New FD Plan</h3>
            <CreateFDPlanForm onSuccess={handleCreateFDPlan} isLoading={loading} createdPlan={createdPlan} />
          </div>
        )}

        {activeSubTab === 'search-plan' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Search FD Plans</h3>
            <SearchFDPlanForm onSelect={handleSelectPlan} />
            
            {selectedPlan && (
              <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Selected Plan Details</h3>
                <div className="text-sm text-slate-700 mb-2">Duration: <span className="font-medium">{selectedPlan.duration} months</span></div>
                <div className="text-sm text-slate-700 mb-2">Interest Rate: <span className="font-medium">{selectedPlan.interest_rate}%</span></div>
                <div className="text-sm text-slate-600 mb-2">Status: {selectedPlan.status}</div>
                <div className="text-sm text-slate-500 mb-4">ID: {selectedPlan.fd_plan_id}</div>
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setSelectedPlan(null)}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;