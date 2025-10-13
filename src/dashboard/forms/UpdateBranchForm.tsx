import React, { useState } from 'react';
import { SubmitButton } from '../../components/common';
import type { BranchDetails, UpdateBranch } from '../../api/branch';

interface UpdateBranchFormProps {
    branch: BranchDetails;
    onSubmit: (branchId: string, data: UpdateBranch) => Promise<void>;
    isLoading?: boolean;
}

const UpdateBranchForm: React.FC<UpdateBranchFormProps> = ({ branch, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<UpdateBranch>({
        name: branch.name || '',
        address: branch.address || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(branch.branch_id, formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm text-blue-700 font-medium mb-1">Branch Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-blue-200"
                    placeholder="Enter branch name"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm text-blue-700 font-medium mb-1">Branch Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-blue-200"
                    placeholder="Enter branch address"
                    rows={3}
                />
            </div>

            <div className="flex justify-end">
                <SubmitButton isSubmitting={!!isLoading}>
                    Update Branch
                </SubmitButton>
            </div>
        </form>
    );
};

export default UpdateBranchForm;
