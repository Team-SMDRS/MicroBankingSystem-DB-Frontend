import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Edit, Loader, RefreshCw } from 'lucide-react';
import { savingsPlanApi } from '../../api/savingsPlans';
import type { SavingsPlan } from '../../api/savingsPlans';
import Alert from '../../components/common/Alert';

interface SavingsPlanListProps {
  onUpdateClick?: (plan: SavingsPlan) => void;
}

export interface SavingsPlanListRef {
  refreshPlans: () => Promise<void>;
}

const SavingsPlanList = forwardRef<SavingsPlanListRef, SavingsPlanListProps>(
  ({ onUpdateClick }, ref) => {
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavingsPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await savingsPlanApi.getSavingsPlansDetails();
      setPlans(response.savings_plans || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
        err.message || 
        'Failed to fetch savings plans';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Expose the refresh function to parent components
  useImperativeHandle(ref, () => ({
    refreshPlans: fetchSavingsPlans
  }));
  
  useEffect(() => {
    fetchSavingsPlans();
  }, [fetchSavingsPlans]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="animate-spin h-8 w-8 text-[#2A9D8F]" />
        <span className="ml-3 text-[#2A9D8F] font-medium">Loading savings plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" className="mb-6">
        <div className="flex justify-between items-center">
          <div>{error}</div>
          <button 
            className="ml-2 text-[#E63946] hover:text-red-800 transition-colors" 
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      </Alert>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-[#F4A261] bg-opacity-10 border border-[#F4A261] text-[#1D3557] p-6 rounded-xl text-center">
        No savings plans found. Create a new plan to get started.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => fetchSavingsPlans()}
          className="inline-flex items-center px-4 py-2 bg-[#1D3557] bg-opacity-5 hover:bg-opacity-10 text-[#1D3557] rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
          title="Refresh Plans"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              <th className="py-4 px-6 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D] border-b">Plan Name</th>
              <th className="py-4 px-6 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D] border-b">Interest Rate (%)</th>
              <th className="py-4 px-6 text-left text-xs uppercase tracking-wider font-semibold text-[#6C757D] border-b">Minimum Balance</th>
              <th className="py-4 px-6 text-center text-xs uppercase tracking-wider font-semibold text-[#6C757D] border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.savings_plan_id} className={`${index % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-[#2A9D8F] hover:bg-opacity-5 border-b border-gray-200`}>
                <td className="py-4 px-6 font-medium text-[#303030]">{plan.plan_name}</td>
                <td className="py-4 px-6 text-[#303030]">{plan.interest_rate}%</td>
                <td className="py-4 px-6 text-[#303030]">Rs.{plan.minimum_balance.toFixed(2)}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onUpdateClick && onUpdateClick(plan)}
                    className="inline-flex items-center px-5 py-2 bg-[#2A9D8F] hover:bg-[#1D3557] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
                    title="Update Plan"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Update</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default SavingsPlanList;