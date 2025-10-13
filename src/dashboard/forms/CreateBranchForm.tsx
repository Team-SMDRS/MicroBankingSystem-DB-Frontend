import React, { useState } from 'react';
import { SubmitButton } from '../../components/common';
import type { CreateBranch } from '../../api/branch';
import { useBranchOperations } from '../../features/branch/useBranchOperations';

interface CreateBranchFormProps {
    onSuccess?: (data: CreateBranch) => Promise<void>;
}

const CreateBranchForm: React.FC<CreateBranchFormProps> = ({ onSuccess }) => {
    const { loading, error } = useBranchOperations();
    const [formData, setFormData] = useState<CreateBranch>({
        name: '',
        address: '',
    });
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSuccess) {
            await onSuccess(formData);
            setFormData({ name: '', address: '' });
            setSuccess('Branch created successfully');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (success) {
        return (
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                {success}
                <button
                    onClick={() => setSuccess(null)}
                    className="ml-4 text-sm underline hover:text-blue-900"
                >
                    Create Another Branch
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

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
                <SubmitButton isSubmitting={loading}>
                    Create Branch
                </SubmitButton>
            </div>
        </form>
    );
};

export default CreateBranchForm;