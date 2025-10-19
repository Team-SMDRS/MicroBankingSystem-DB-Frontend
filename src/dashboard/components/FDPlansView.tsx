import { useState, useEffect } from 'react';
import { getFDPlans, type FDPlan } from '../../api/fd';

interface FDPlansViewProps {
  onError: (error: string) => void;
}

const FDPlansView = ({ onError }: FDPlansViewProps) => {
  const [fdPlans, setFdPlans] = useState<FDPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // Load FD plans on component mount
  useEffect(() => {
    fetchFDPlans();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Available Fixed Deposit Plans</h3>
          <button 
            onClick={fetchFDPlans}
            disabled={loadingPlans}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            {loadingPlans ? 'Refreshing...' : 'Refresh Plans'}
          </button>
        </div>
        
        {loadingPlans ? (
          <div className="text-center py-8 text-slate-500">Loading FD plans...</div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plan ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Interest Rate</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fdPlans.map((plan) => (
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
                  </tr>
                ))}
                {fdPlans.length === 0 && !loadingPlans && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">No FD plans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {lastUpdated && !loadingPlans && (
          <div className="mt-4 text-xs text-slate-500 text-right">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FDPlansView;