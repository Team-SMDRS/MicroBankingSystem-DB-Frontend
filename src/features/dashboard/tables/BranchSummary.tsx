import { Building2 } from 'lucide-react';

const BranchSummary = () => {
  const branchData = [
    { id: 1, branch: 'Main Branch', location: 'Downtown', totalAccounts: 1234, totalBalance: '$2,450,000', manager: 'John Smith' },
    { id: 2, branch: 'North Branch', location: 'Northside', totalAccounts: 856, totalBalance: '$1,780,000', manager: 'Sarah Johnson' },
    { id: 3, branch: 'East Branch', location: 'Eastside', totalAccounts: 642, totalBalance: '$1,320,000', manager: 'Michael Brown' },
    { id: 4, branch: 'West Branch', location: 'Westside', totalAccounts: 923, totalBalance: '$1,950,000', manager: 'Emily Davis' },
    { id: 5, branch: 'South Branch', location: 'Southside', totalAccounts: 1089, totalBalance: '$2,180,000', manager: 'David Wilson' },
  ];

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
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Branch Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total Accounts</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total Balance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Branch Manager</th>
            </tr>
          </thead>
          <tbody>
            {branchData.map((branch) => (
              <tr key={branch.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{branch.branch}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{branch.location}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{branch.totalAccounts}</td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{branch.totalBalance}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{branch.manager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchSummary;
