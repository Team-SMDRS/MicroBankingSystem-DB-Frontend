import { useState, useEffect } from 'react';
import { getFDPlans, updateFDPlanStatus, createFDPlan, type FDPlan } from '../../api/fd';

interface FDPlansViewProps {
  onError: (error: string) => void;
}

const FDPlansView = ({ onError }: FDPlansViewProps) => {
  const [fdPlans, setFdPlans] = useState<FDPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'duration'>('id');
  
  // Create FD Plan modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [duration, setDuration] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [isCreating, setIsCreating] = useState(false);

  // Function to fetch FD plans
  const fetchFDPlans = async () => {
    try {
      setLoadingPlans(true);
      const plansData = await getFDPlans();
      setFdPlans(plansData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch FD plans:', err);
      onError('Failed to load FD plans. Please try again later.');
    } finally {
      setLoadingPlans(false);
    }
  };

  // Function to toggle FD plan status (active/inactive)
  const togglePlanStatus = async (plan: FDPlan) => {
    const newStatus = plan.status === 'active' ? 'inactive' : 'active';
    try {
      setUpdatingPlanId(plan.fd_plan_id);
      const updatedPlan = await updateFDPlanStatus(plan.fd_plan_id, newStatus);
      
      // Update the plan in the state
      setFdPlans(currentPlans => 
        currentPlans.map(p => 
          p.fd_plan_id === updatedPlan.fd_plan_id ? updatedPlan : p
        )
      );
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Failed to update plan status to ${newStatus}:`, err);
      onError(`Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} the plan. Please try again later.`);
    } finally {
      setUpdatingPlanId(null);
    }
  };
  
  // Function to handle creating a new FD plan
  const handleCreateFDPlan = async () => {
    try {
      setIsCreating(true);
      const result = await createFDPlan({
        duration_months: duration,
        interest_rate: interestRate
      });
      
      // Add the new plan to the state
      setFdPlans(currentPlans => [result.fd_plan, ...currentPlans]);
      setShowCreateModal(false);
      setDuration(12);
      setInterestRate(5);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to create FD plan:', err);
      onError('Failed to create FD plan. Please try again later.');
    } finally {
      setIsCreating(false);
    }
  };

  // Filter FD plans based on search term and search type
  const filteredPlans = fdPlans.filter(plan => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Search by plan ID or duration based on selected search type
    if (searchType === 'id') {
      return plan.fd_plan_id.toLowerCase().includes(searchLower);
    } else {
      return plan.duration.toString().includes(searchTerm);
    }
  });

  // Load FD plans on component mount
  useEffect(() => {
    fetchFDPlans();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-primary">Available Fixed Deposit Plans</h3>
            <button 
              onClick={fetchFDPlans}
              disabled={loadingPlans}
              className="ml-3 flex items-center px-2 py-1 text-xs bg-secondary text-white rounded-lg border border-secondary hover:bg-primary transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              {loadingPlans ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 text-sm font-semibold bg-highlight text-white rounded-xl shadow-md hover:bg-highlightHover transition-colors focus:ring-2 focus:ring-highlight focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            <span>Create FD Plan</span>
          </button>
        </div>
        
        <div className="mb-4 relative">
          <div className="flex">
            <div className="w-1/4 mr-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'id' | 'duration')}
                className="input-field w-full"
              >
                <option value="id">FD Plan ID</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchType === 'id' ? "Search by FD Plan ID..." : "Search by duration (months)..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4 w-full"
              />
            </div>
          </div>
        </div>
        
        {loadingPlans ? (
          <div className="text-center py-8 text-secondary">Loading FD plans...</div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full bg-white rounded-2xl">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plan ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Interest Rate</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.fd_plan_id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-800 font-mono">{plan.fd_plan_id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 text-sm text-slate-800">{plan.duration} months</td>
                    <td className="py-3 px-4 text-sm text-slate-800">{plan.interest_rate}%</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePlanStatus(plan)}
                        disabled={updatingPlanId === plan.fd_plan_id}
                        className={`px-3 py-1.5 text-xs font-medium rounded ${
                          plan.status === 'active' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                        } transition-colors`}
                      >
                        {updatingPlanId === plan.fd_plan_id ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                        ) : plan.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPlans.length === 0 && !loadingPlans && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      {fdPlans.length === 0 
                        ? 'No FD plans found.' 
                        : `No plans match your ${searchType === 'id' ? 'FD Plan ID' : 'duration'} search criteria.`
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {lastUpdated && !loadingPlans && (
          <div className="mt-4 text-xs text-secondary text-right">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Create FD Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-md border border-borderLight p-8 w-full max-w-md animate-slide-in-right">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Create New FD Plan</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-tertiary hover:text-secondary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="duration" className="label-text">
                  Duration (months)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label htmlFor="interestRate" className="label-text">
                  Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="input-field w-full"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-5">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFDPlan}
                  disabled={isCreating || duration <= 0 || interestRate <= 0}
                  className="button-primary disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create FD Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FDPlansView;