import React, { useState, useEffect } from 'react';
import { type FDDetails, fdApi } from '../../features/fd';

interface FixedDeposit extends FDDetails {
    fd_id: string;
    plan_id: string;
    account_id: string;
    amount: number;
    maturity_date: string;
    interest_rate: string;
    status: string;
}

const FixedDepositList: React.FC = () => {
    const [deposits, setDeposits] = useState<FixedDeposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const data = await fdApi.getDeposits();
                setDeposits(data || []);
            } catch (err: any) {
                setError(err.message || 'Error fetching fixed deposits');
            } finally {
                setLoading(false);
            }
        };

        fetchDeposits();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading fixed deposits...</div>;
    }

    if (error) {
        return <div className="text-red-600 py-4">{error}</div>;
    }

    if (deposits.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No fixed deposits found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Maturity Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {deposits.map((deposit) => (
                        <tr key={deposit.fd_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {deposit.account_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                Rs. {deposit.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {deposit.interest_rate}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(deposit.maturity_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    deposit.status === 'active' 
                                        ? 'bg-green-100 text-green-800'
                                        : deposit.status === 'matured'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {deposit.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FixedDepositList;