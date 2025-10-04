import { Building2, TrendingUp, FileText } from 'lucide-react';

export function BranchSummary() {
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
}

export function TransactionSummary() {
  const transactionData = [
    { id: 1, date: '2025-10-04', type: 'Bank Transfer', fromAccount: 'ACC-1001', toAccount: 'ACC-1052', amount: '$5,000', status: 'Completed' },
    { id: 2, date: '2025-10-04', type: 'Withdrawal', fromAccount: 'ACC-2034', toAccount: '-', amount: '$1,200', status: 'Completed' },
    { id: 3, date: '2025-10-04', type: 'Deposit', fromAccount: '-', toAccount: 'ACC-3045', amount: '$3,500', status: 'Completed' },
    { id: 4, date: '2025-10-03', type: 'Bank Transfer', fromAccount: 'ACC-4012', toAccount: 'ACC-5023', amount: '$2,800', status: 'Completed' },
    { id: 5, date: '2025-10-03', type: 'Withdrawal', fromAccount: 'ACC-1052', toAccount: '-', amount: '$800', status: 'Completed' },
    { id: 6, date: '2025-10-03', type: 'Deposit', fromAccount: '-', toAccount: 'ACC-2034', amount: '$4,200', status: 'Completed' },
    { id: 7, date: '2025-10-02', type: 'Bank Transfer', fromAccount: 'ACC-3045', toAccount: 'ACC-1001', amount: '$6,500', status: 'Completed' },
    { id: 8, date: '2025-10-02', type: 'Withdrawal', fromAccount: 'ACC-5023', toAccount: '-', amount: '$1,500', status: 'Completed' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Transaction Summary</h3>
          <p className="text-sm text-slate-500">Recent transaction history</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">From Account</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">To Account</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">{transaction.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{transaction.type}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{transaction.fromAccount}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{transaction.toAccount}</td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{transaction.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AccountSummary() {
  const accountData = [
    { id: 1, accountNo: 'ACC-1001', accountType: 'Fixed Deposit', holder: 'John Anderson', balance: '$45,000', openDate: '2024-01-15', status: 'Active' },
    { id: 2, accountNo: 'ACC-2034', accountType: 'Current Account', holder: 'Maria Garcia', balance: '$12,500', openDate: '2024-03-22', status: 'Active' },
    { id: 3, accountNo: 'ACC-3045', accountType: 'Joint Account', holder: 'Robert & Linda Smith', balance: '$28,700', openDate: '2024-02-10', status: 'Active' },
    { id: 4, accountNo: 'ACC-4012', accountType: 'Fixed Deposit', holder: 'James Wilson', balance: '$67,500', openDate: '2023-11-05', status: 'Active' },
    { id: 5, accountNo: 'ACC-5023', accountType: 'Current Account', holder: 'Patricia Brown', balance: '$8,900', openDate: '2024-04-18', status: 'Active' },
    { id: 6, accountNo: 'ACC-1052', accountType: 'Joint Account', holder: 'Michael & Susan Davis', balance: '$34,200', openDate: '2024-01-28', status: 'Active' },
    { id: 7, accountNo: 'ACC-6078', accountType: 'Fixed Deposit', holder: 'Jennifer Martinez', balance: '$52,000', openDate: '2023-12-12', status: 'Active' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Account Summary</h3>
          <p className="text-sm text-slate-500">Overview of all customer accounts</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account Holder</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Balance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Open Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((account) => (
              <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{account.accountNo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{account.accountType}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{account.holder}</td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{account.balance}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{account.openDate}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {account.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
