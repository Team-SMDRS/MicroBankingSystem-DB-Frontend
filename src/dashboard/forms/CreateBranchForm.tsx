import React, { useState } from 'react';
import { SubmitButton } from '../../components/common';
import type { CreateBranch, BranchDetails } from '../../features/branch';

interface CreateBranchFormProps {
    onSuccess?: (data: CreateBranch) => Promise<void>;
    isLoading?: boolean;
    createdBranch?: BranchDetails | null;
}

const CreateBranchForm: React.FC<CreateBranchFormProps> = ({ onSuccess, isLoading, createdBranch }) => {
    const [formData, setFormData] = useState<CreateBranch>({
        name: '',
        address: '',
    });
    const [success, setSuccess] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return; // guard against double submit
        setSubmitting(true);
        try {
            console.log('CreateBranchForm: submitting', formData);
            if (onSuccess) {
                await onSuccess(formData);
                // Success is handled by parent; reset form only on success
                setFormData({ name: '', address: '' });
                setSuccess('Branch created successfully');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (success && createdBranch) {
        return (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-800">Branch Created Successfully!</h3>
                </div>
                
                <div className="space-y-3 mb-4 bg-white p-4 rounded border border-blue-100">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-slate-600">Branch Name:</div>
                        <div className="text-sm font-semibold text-slate-800">{createdBranch.name}</div>
                        
                        <div className="text-sm font-medium text-slate-600">Address:</div>
                        <div className="text-sm text-slate-800">{createdBranch.address}</div>
                        
                        <div className="text-sm font-medium text-slate-600">Branch ID:</div>
                        <div className="text-sm text-slate-700 font-mono">{createdBranch.branch_id}</div>
                        
                        <div className="text-sm font-medium text-slate-600">Created At:</div>
                        <div className="text-sm text-slate-700">
                            {new Date(createdBranch.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={() => setSuccess(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Create Another Branch
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Parent handles API errors; this form shows local success state only */}

            <div>
                <label htmlFor="name" className="block text-sm text-blue-700 font-medium mb-1">
                    Branch Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-blue-200"
                    placeholder="Enter branch name"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm text-blue-700 font-medium mb-1">
                    Branch Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-blue-200"
                    placeholder="Enter branch address"
                />
            </div>

            <div className="flex justify-end">
                <SubmitButton isSubmitting={!!isLoading}>
                    Create Branch
                </SubmitButton>
            </div>
        </form>
    );
};

export default CreateBranchForm;