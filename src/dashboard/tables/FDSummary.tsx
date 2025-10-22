import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { getAllFixedDeposits, type FixedDeposit } from '../../api/fd';

const FDSummary = () => {
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixedDeposits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllFixedDeposits();
        setFixedDeposits(data || []);
      } catch (err: any) {
        console.error('Error fetching fixed deposits:', err);
        setError(err?.response?.data?.message || 'Failed to fetch fixed deposits');
      } finally {
        setLoading(false);
      }
    };

    fetchFixedDeposits();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0.00';
    return numValue.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading fixed deposits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-900 font-semibold">Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (fixedDeposits.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-700">No fixed deposits found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">FD Account No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Balance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Maturity Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Next Interest Day</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fixedDeposits.map((fd) => (
              <tr key={fd.fd_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{fd.fd_account_no}</td>
                <td className="px-6 py-4 text-sm text-gray-900">LKR {formatCurrency(fd.balance)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fd.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {fd.status?.charAt(0).toUpperCase() + fd.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(fd.maturity_date)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(fd.next_interest_day)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <p className="text-sm text-gray-600">
          Total Fixed Deposits: <span className="font-semibold text-gray-900">{fixedDeposits.length}</span>
        </p>
      </div>
    </div>
  );
};

export default FDSummary;
