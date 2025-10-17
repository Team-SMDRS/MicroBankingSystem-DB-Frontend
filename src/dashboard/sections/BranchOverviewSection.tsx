import { useState, useEffect } from 'react';
import { Building2, PiggyBank, Wallet, Users, Loader2, AlertCircle } from 'lucide-react';
import { branchApi } from '../../api/branches';
import type { BranchDetails, BranchAccountStatistics } from '../../api/branches';
import { formatCurrency } from '../../utils/formatters';

const BranchOverviewSection = () => {
  const [branches, setBranches] = useState<BranchDetails[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(null);
  const [branchStats, setBranchStats] = useState<BranchAccountStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Fetch all branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const branchList = await branchApi.getAll();
        console.log('Branches loaded:', branchList); // Debug log
        setBranches(branchList);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches');
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch branch details and statistics when a branch is selected
  const handleBranchChange = async (branchId: string) => {
    console.log('Branch selection changed:', branchId);
    setDebugInfo(`Branch ID selected: ${branchId}`);
    
    if (!branchId) {
      setSelectedBranchId('');
      setBranchDetails(null);
      setBranchStats(null);
      setDebugInfo('');
      return;
    }

    setSelectedBranchId(branchId);
    setLoading(true);
    setError(null);
    setDebugInfo('Loading branch data...');

    try {
      // Fetch branch details
      console.log('Fetching branch details for ID:', branchId);
      setDebugInfo(`Fetching branch details for ID: ${branchId}`);
      const details = await branchApi.getById(branchId);
      console.log('Branch details received:', details);
      setDebugInfo(`Branch details loaded: ${JSON.stringify(details).substring(0, 100)}`);
      setBranchDetails(details);

      // Fetch branch account statistics
      console.log('Fetching branch statistics for ID:', branchId);
      setDebugInfo(`Fetching branch statistics for ID: ${branchId}`);
      const stats = await branchApi.getBranchAccountStatistics(branchId);
      console.log('Branch statistics received:', stats);
      setDebugInfo(`Statistics loaded successfully`);
      
      // Validate the stats data
      if (!stats || typeof stats !== 'object') {
        throw new Error('Invalid statistics data received from API');
      }
      
      setBranchStats(stats);
      setDebugInfo('All data loaded successfully');
    } catch (err: any) {
      console.error('Error fetching branch data:', err);
      console.error('Error details:', err.response?.data);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load branch information';
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
      setBranchDetails(null);
      setBranchStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Branch Overview</h2>
          <p className="text-sm text-slate-500">View detailed statistics for each branch</p>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <label htmlFor="branch-select" className="block text-sm font-semibold text-slate-700 mb-3">
          Select Branch ({branches.length} branches available)
        </label>
        
        {loadingBranches ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="ml-2 text-slate-600">Loading branches...</span>
          </div>
        ) : (
          <select
            id="branch-select"
            value={selectedBranchId}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full px-4 py-3 text-base font-medium border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            style={{ 
              color: '#000',
              backgroundColor: '#fff',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            <option value="" style={{ color: '#000', backgroundColor: '#fff', fontSize: '16px', fontWeight: '500' }}>
              -- Select a branch --
            </option>
            {branches.map((branch) => (
              <option 
                key={branch.branch_id} 
                value={branch.branch_id}
                style={{ color: '#000', backgroundColor: '#fff', fontSize: '16px', fontWeight: '500', padding: '10px' }}
              >
                {branch.branch_name || branch.name || 'Unnamed Branch'} {branch.branch_code ? `(${branch.branch_code})` : ''}
              </option>
            ))}
          </select>
        )}
        
        {/* Debug info */}
        {!loadingBranches && branches.length === 0 && (
          <p className="mt-2 text-sm text-red-600">No branches found. Check console for errors.</p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-semibold">{error}</p>
            {debugInfo && <p className="text-red-600 text-sm mt-1">Debug: {debugInfo}</p>}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-slate-600">Loading branch information...</span>
        </div>
      )}

      {/* Branch Details and Statistics */}
      {!loading && branchDetails && (
        <>
          {/* Branch Information Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Branch Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Branch Name</p>
                <p className="text-lg font-semibold text-slate-800">{branchDetails.branch_name || branchDetails.name}</p>
              </div>
              {branchDetails.branch_code && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Branch Code</p>
                  <p className="text-lg font-semibold text-slate-800">{branchDetails.branch_code}</p>
                </div>
              )}
              {branchDetails.city && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">City</p>
                  <p className="text-lg font-semibold text-slate-800">{branchDetails.city}</p>
                </div>
              )}
              {branchDetails.address && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Address</p>
                  <p className="text-lg font-semibold text-slate-800">{branchDetails.address}</p>
                </div>
              )}
              {branchDetails.contact_number && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Contact Number</p>
                  <p className="text-lg font-semibold text-slate-800">{branchDetails.contact_number}</p>
                </div>
              )}
              {branchDetails.manager_name && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Branch Manager</p>
                  <p className="text-lg font-semibold text-slate-800">{branchDetails.manager_name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Statistics */}
          {branchStats && (
            <>
              {/* Statistics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Joint Accounts */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Joint Accounts</p>
                  <p className="text-2xl font-bold text-orange-600">{branchStats.total_joint_accounts || 0}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Total Balance: <span className="font-semibold text-orange-600">
                      {formatCurrency(branchStats.joint_accounts_balance || 0)}
                    </span>
                  </p>
                </div>

                {/* Fixed Deposit Accounts */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Fixed Deposit Accounts</p>
                  <p className="text-2xl font-bold text-green-600">{branchStats.total_fixed_deposits || 0}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Total Amount: <span className="font-semibold text-green-600">
                      {formatCurrency(branchStats.fixed_deposits_amount || 0)}
                    </span>
                  </p>
                </div>

                {/* Savings Accounts */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <PiggyBank className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Savings Accounts</p>
                  <p className="text-2xl font-bold text-blue-600">{branchStats.total_savings_accounts || 0}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Total Balance: <span className="font-semibold text-blue-600">
                      {formatCurrency(branchStats.savings_accounts_balance || 0)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Total Summary Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl border border-purple-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-900 mb-2">Branch Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-purple-600">Total Accounts</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(branchStats.total_joint_accounts || 0) + 
                           (branchStats.total_fixed_deposits || 0) + 
                           (branchStats.total_savings_accounts || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-600">Total Holdings</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatCurrency(
                            (branchStats.joint_accounts_balance || 0) + 
                            (branchStats.fixed_deposits_amount || 0) + 
                            (branchStats.savings_accounts_balance || 0)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-600">Branch Location</p>
                        <p className="text-lg font-semibold text-purple-900">
                          {branchStats.branch_address || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-20 h-20 bg-purple-200 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-purple-700" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* No Statistics Available */}
          {!branchStats && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <p className="text-yellow-800">No account statistics available for this branch.</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !branchDetails && !error && selectedBranchId === '' && (
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Branch Selected</h3>
          <p className="text-slate-500">Please select a branch from the dropdown above to view its details and statistics.</p>
        </div>
      )}
    </div>
  );
};

export default BranchOverviewSection;
