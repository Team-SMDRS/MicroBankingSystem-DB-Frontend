import { TrendingUp } from 'lucide-react';

const TransactionSummary = () => {
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
};

export default TransactionSummary;
