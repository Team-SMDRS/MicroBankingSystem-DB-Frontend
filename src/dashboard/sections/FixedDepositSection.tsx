import { useState, useEffect } from 'react';
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

const FixedDepositSection = ({
  activeSubTab,
  setActiveSubTab
}: FixedDepositSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<FDPlanDetails | null>(null);
  const [createdPlan, setCreatedPlan] = useState<FDPlanDetails | null>(null);

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setLoading(false);
  }, [activeSubTab]);

  // Define tabs with clear labels and icons
  const subTabs = [
    { id: 'create', label: 'Create Fixed Deposit', icon: PlusSquare },
    { id: 'list', label: 'View Deposits', icon: List },
    { id: 'create-fd-plan', label: 'Create FD Plan', icon: FileStack },
    { id: 'search-fd-plan', label: 'Search FD Plans', icon: Search },
  ];

  // Reset states when changing tabs
  const handleTabChange = (tabId: string) => {
    setActiveSubTab(tabId);
    setSelectedPlan(null);
    setCreatedPlan(null);
    setSuccess(null);
    setError(null);
    setLoading(false);
  };

  // Handle Plan selection in search
  const handleSelectPlan = (plan: FDPlanDetails) => {
    setSelectedPlan(plan);
  };

  // Handle FD Plan creation
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
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to create FD Plan'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle FD creation
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

  const renderContent = () => {
    const baseClasses = "max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8";
    const headerClasses = "text-2xl font-semibold text-slate-800 mb-6";

    try {
      if (error) {
        return (
          <div className={baseClasses}>
            <Alert type="error">{error}</Alert>
          </div>
        );
      }

      switch (activeSubTab) {
        case 'create':
          return (
            <div className={baseClasses}>
              <h3 className={headerClasses}>Create New Fixed Deposit</h3>
              <CreateFixedDepositForm onSubmit={handleCreateFD} isLoading={loading} />
            </div>
          );
        case 'list':
          return (
            <div className={baseClasses}>
              <h3 className={headerClasses}>Your Fixed Deposits</h3>
              <FixedDepositList />
            </div>
          );
        case 'create-fd-plan':
          return (
            <div className={baseClasses}>
              <h3 className={headerClasses}>Create New FD Plan</h3>
              <div className="bg-slate-50 rounded-lg p-6">
                <CreateFDPlanForm onSuccess={handleCreateFDPlan} isLoading={loading} createdPlan={createdPlan} />
              </div>
            </div>
          );
        case 'search-fd-plan':
          return (
            <div className={baseClasses}>
              <h3 className={headerClasses}>Search FD Plans</h3>
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <SearchFDPlanForm onSelect={handleSelectPlan} />
              </div>
              {selectedPlan && (
                <div className="p-6 border rounded-lg bg-white shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Selected Plan Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Duration</div>
                      <div className="text-lg font-medium text-slate-800">{selectedPlan.duration} months</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Interest Rate</div>
                      <div className="text-lg font-medium text-slate-800">{selectedPlan.interest_rate}%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <div>
                      <div className="text-sm text-slate-600">Status: <span className="font-medium text-slate-800">{selectedPlan.status}</span></div>
                      <div className="text-sm text-slate-500">ID: {selectedPlan.fd_plan_id}</div>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                      onClick={() => setSelectedPlan(null)}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        default:
          return (
            <div className={baseClasses}>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Fixed Deposit</h3>
              <CreateFixedDepositForm onSubmit={handleCreateFD} isLoading={loading} />
            </div>
          );
      }
    } catch (err) {
      console.error('Error rendering content:', err);
      return (
        <div className={baseClasses}>
          <Alert type="error">An error occurred while loading the content. Please try again.</Alert>
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      <SectionHeader
        title="Fixed Deposits"
        description="Create and manage fixed deposit accounts and plans"
      />

      <div className="mt-4">
        <SubTabGrid
          subTabs={subTabs}
          activeSubTab={activeSubTab || 'create'}
          onSubTabChange={handleTabChange}
        />
      </div>

      {success && (
        <div className="mt-4 max-w-2xl mx-auto">
          <Alert type="success">{success}</Alert>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;
