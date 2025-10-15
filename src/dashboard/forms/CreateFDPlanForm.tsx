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
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (months)
                </label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="1"
                    placeholder="Enter duration in months"
                />
            </div>

            <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (%)
                </label>
                <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    step="0.01"
                    min="0"
                    placeholder="Enter interest rate"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
                {isLoading ? 'Creating...' : 'Create FD Plan'}
            </button>

            {createdPlan && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-sm font-medium text-green-800">Plan Created Successfully</h4>
                    <div className="mt-2 text-sm text-green-700">
                        <p>Duration: {createdPlan.duration} months</p>
                        <p>Interest Rate: {createdPlan.interest_rate}%</p>
                        <p>Plan ID: {createdPlan.fd_plan_id}</p>
                    </div>
                </div>
            )}
        </form>
    );
};

export default CreateFDPlanForm;