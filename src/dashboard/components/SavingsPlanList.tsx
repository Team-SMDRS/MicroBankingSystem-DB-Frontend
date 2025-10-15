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
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-blue-600">Loading savings plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" className="mb-4">
        <div className="flex justify-between items-center">
          <div>{error}</div>
          <button 
            className="ml-2 text-red-700 hover:text-red-900" 
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
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-center">
        No savings plans found. Create a new plan to get started.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => fetchSavingsPlans()}
          className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
          title="Refresh Plans"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Plan Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Interest Rate (%)</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Minimum Balance</th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.savings_plan_id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-4 font-medium">{plan.plan_name}</td>
                <td className="py-3 px-4">{plan.interest_rate}%</td>
                <td className="py-3 px-4">Rs.{plan.minimum_balance.toFixed(2)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onUpdateClick && onUpdateClick(plan)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                    title="Update Plan"
                  >
                    <Edit className="h-4 w-4 mr-1" />
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