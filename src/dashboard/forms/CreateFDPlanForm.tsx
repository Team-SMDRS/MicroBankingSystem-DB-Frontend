import React, { useState } from 'react';
import { type FDPlanDetails } from '../../features/fd';

interface CreateFDPlanFormProps {
    onSuccess: (data: { duration_months: number; interest_rate: number }) => Promise<void>;
    isLoading: boolean;
    createdPlan: FDPlanDetails | null;
}

const CreateFDPlanForm: React.FC<CreateFDPlanFormProps> = ({ onSuccess, isLoading, createdPlan }) => {
    const [duration, setDuration] = useState('');
    const [interestRate, setInterestRate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!duration || !interestRate) return;

        await onSuccess({
            duration_months: Number(duration),
            interest_rate: Number(interestRate)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (months)
                </label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
                    required
                    min="1"
                    placeholder="Enter duration in months"
                />
            </div>

            <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-slate-700 mb-2">
                    Interest Rate (%)
                </label>
                <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
                    required
                    step="0.01"
                    min="0"
                    placeholder="Enter interest rate"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
            >
                {isLoading ? 'Creating...' : 'Create FD Plan'}
            </button>

            {createdPlan && (
                <div className="mt-6 p-6 bg-white border border-blue-100 rounded-lg shadow-sm">
                    <div className="flex items-center text-blue-600 mb-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <h4 className="font-medium">Plan Created Successfully</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="text-sm text-slate-600 mb-1">Duration</div>
                            <div className="font-medium text-slate-800">{createdPlan.duration} months</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="text-sm text-slate-600 mb-1">Interest Rate</div>
                            <div className="font-medium text-slate-800">{createdPlan.interest_rate}%</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">Plan ID: {createdPlan.fd_plan_id}</div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default CreateFDPlanForm;