import { FileText } from 'lucide-react';

const AccountSummary = () => {
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
};

export default AccountSummary;
