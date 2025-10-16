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
                if (Array.isArray(data)) {
                    setPlans(data);
                } else if (data == null) {
                    console.warn('fdApi.getPlans returned null/undefined, defaulting to empty list');
                    setPlans([]);
                } else {
                    // if backend returns an object wrapper like { results: [] }
                    if (Array.isArray((data as any).results)) {
                        setPlans((data as any).results);
                    } else {
                        console.warn('Unexpected fdApi.getPlans response shape, defaulting to empty list', data);
                        setPlans([]);
                    }
                }
            } catch (err) {
                console.error('Error fetching FD plans:', err);
                setPlans([]);
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
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center text-slate-600">Loading FD plans...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Create Fixed Deposit</h3>
                    <p className="text-sm text-slate-500">Create a new fixed deposit with selected plan</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="plan" className="block text-sm font-semibold text-slate-700 mb-2">
                        Select FD Plan
                    </label>
                    <select
                        id="plan"
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                    <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
                        Amount (in Rs.)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        required
                        min="1000"
                        placeholder="Enter deposit amount"
                    />
                    <p className="mt-2 text-sm text-slate-500">Minimum amount: Rs. 1,000</p>
                </div>

            {selectedPlanId && plans.find(p => p.fd_plan_id === selectedPlanId) && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h4 className="text-lg font-medium text-slate-800 mb-4">Selected Plan Details</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {(() => {
                            const plan = plans.find(p => p.fd_plan_id === selectedPlanId)!;
                            return (
                                <>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm text-slate-600 mb-1">Duration</div>
                                        <div className="text-lg font-medium text-slate-800">{plan.duration} months</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm text-slate-600 mb-1">Interest Rate</div>
                                        <div className="text-lg font-medium text-slate-800">{plan.interest_rate}%</div>
                                    </div>
                                    {amount && (
                                        <div className="col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="text-sm text-blue-600 mb-1">Maturity Amount (approx.)</div>
                                            <div className="text-lg font-medium text-blue-700">
                                                Rs. {(Number(amount) * (1 + (Number(plan.interest_rate) / 100) * (plan.duration / 12))).toFixed(2)}
                                            </div>
                                        </div>
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
                className="w-full flex justify-center py-3 px-6 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
            >
                {isLoading ? 'Creating...' : 'Create Fixed Deposit'}
            </button>
            </form>
        </div>
    );
};

export default CreateFixedDepositForm;