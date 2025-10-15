import React, { useState, useEffect } from 'react';
import { type FDPlanDetails, fdApi } from '../../features/fd';

interface CreateFixedDepositFormProps {
    onSubmit: (data: { amount: number; planId: string }) => Promise<void>;
    isLoading: boolean;
}

const CreateFixedDepositForm: React.FC<CreateFixedDepositFormProps> = ({ onSubmit, isLoading }) => {
    const [amount, setAmount] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [plans, setPlans] = useState<FDPlanDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await fdApi.getPlans();
                setPlans(data);
            } catch (err) {
                console.error('Error fetching FD plans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !selectedPlanId) return;

        await onSubmit({
            amount: Number(amount),
            planId: selectedPlanId
        });
    };

    if (loading) {
        return <div className="text-center py-4">Loading FD plans...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                    Select FD Plan
                </label>
                <select
                    id="plan"
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    required
                >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                        <option key={plan.fd_plan_id} value={plan.fd_plan_id}>
                            {plan.duration} months @ {plan.interest_rate}% interest
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (in Rs.)
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    required
                    min="1000"
                    placeholder="Enter deposit amount"
                />
                <p className="mt-1 text-sm text-gray-500">Minimum amount: Rs. 1,000</p>
            </div>

            {selectedPlanId && plans.find(p => p.fd_plan_id === selectedPlanId) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900">Selected Plan Details</h4>
                    <div className="mt-2 text-sm text-gray-600">
                        {(() => {
                            const plan = plans.find(p => p.fd_plan_id === selectedPlanId)!;
                            return (
                                <>
                                    <p>Duration: {plan.duration} months</p>
                                    <p>Interest Rate: {plan.interest_rate}%</p>
                                    {amount && (
                                        <p>
                                            Maturity Amount (approx.): Rs. {
                                                (Number(amount) * (1 + (Number(plan.interest_rate) / 100) * (plan.duration / 12))).toFixed(2)
                                            }
                                        </p>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !amount || !selectedPlanId}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
                {isLoading ? 'Creating...' : 'Create Fixed Deposit'}
            </button>
        </form>
    );
};

export default CreateFixedDepositForm;