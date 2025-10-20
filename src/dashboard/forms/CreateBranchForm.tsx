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
            <div className="p-6 bg-white rounded-2xl shadow-md border border-borderLight">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800">Branch Created Successfully!</h3>
                </div>
                
                <div className="space-y-3 mb-4 bg-background p-4 rounded-2xl border border-borderLight">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-primary">Branch Name:</div>
                        <div className="text-sm font-semibold text-secondary">{createdBranch.name}</div>
                        
                        <div className="text-sm font-medium text-primary">Address:</div>
                        <div className="text-sm text-secondary">{createdBranch.address}</div>
                        
                        <div className="text-sm font-medium text-primary">Branch ID:</div>
                        <div className="text-sm text-tertiary font-mono">{createdBranch.branch_id}</div>
                        
                        <div className="text-sm font-medium text-primary">Created At:</div>
                        <div className="text-sm text-secondary">
                            {new Date(createdBranch.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={() => setSuccess(null)}
                    className="button-secondary px-4 py-2"
                >
                    Create Another Branch
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md border border-borderLight p-8 animate-slide-in-right">
            {/* Parent handles API errors; this form shows local success state only */}

            <div>
                <label htmlFor="name" className="label-text">
                    Branch Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="Enter branch name"
                />
            </div>

            <div>
                <label htmlFor="address" className="label-text">
                    Branch Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="input-field w-full resize-none"
                    placeholder="Enter branch address"
                />
            </div>

            <div className="flex justify-end pt-4">
                <SubmitButton isSubmitting={!!isLoading}>
                    Create Branch
                </SubmitButton>
            </div>
        </form>
    );
};

export default CreateBranchForm;