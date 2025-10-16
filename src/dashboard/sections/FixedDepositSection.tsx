import React, { useState } from 'react';
import { PlusSquare, Search, List, FileStack } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
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

  // Define tabs
  const subTabs = [
    { id: 'create', label: 'Create Fixed Deposit', icon: PlusSquare },
    { id: 'list', label: 'View Deposits', icon: List },
    { id: 'create-plan', label: 'Create FD Plan', icon: FileStack },
    { id: 'search-plan', label: 'Search FD Plans', icon: Search },
  ];

  // Reset states when changing tabs
  const handleTabChange = (tab: string) => {
    setError(null);
    setSuccess(null);
    setActiveSubTab(tab);
  };

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
      setActiveSubTab('list');
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

  const renderContent = () => {
    try {
      switch (activeSubTab) {
        case 'create':
          return (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Fixed Deposit</h3>
              <CreateFixedDepositForm onSubmit={handleCreateFD} isLoading={loading} />
            </div>
          );
        case 'list':
          return (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Fixed Deposits</h3>
              <FixedDepositList />
            </div>
          );
        case 'create-plan':
          return (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New FD Plan</h3>
              <CreateFDPlanForm onSuccess={handleCreateFDPlan} isLoading={loading} createdPlan={createdPlan} />
            </div>
          );
        case 'search-plan':
          return (
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
          );
        default:
          return (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Fixed Deposit</h3>
              <CreateFixedDepositForm onSubmit={handleCreateFD} isLoading={loading} />
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <Alert type="error">An error occurred while loading the content. Please try again.</Alert>
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      <SectionHeader
        title="Fixed Deposits"
        description="Create and manage fixed deposit accounts"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab || 'create'}
        onSubTabChange={handleTabChange}
      />

      <div className="mt-4">
        {success && <Alert type="success">{success}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
      </div>

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default FixedDepositSection;