import { Building2 } from 'lucide-react';
import { useEffect } from 'react';
import { useBranchOperations } from '../../features/branch';

const BranchSummary = () => {
  const { loading, branches, getAllBranches } = useBranchOperations();

  useEffect(() => {
    // Initial load only
    getAllBranches();
  }, []);

  if (loading && branches.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Branch Summary</h3>
            <p className="text-sm text-slate-500">Loading branches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Branch Summary</h3>
          <p className="text-sm text-slate-500">Overview of all branch locations</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Branch ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created At</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.branch_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{branch.branch_id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{branch.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{branch.address}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(branch.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {branch.updated_at ? new Date(branch.updated_at).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchSummary;
