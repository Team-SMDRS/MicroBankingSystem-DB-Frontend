import React, { useState } from 'react';
import { Building2, Edit } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import Alert from '../../components/common/Alert';

import CreateBranchForm from '../forms/CreateBranchForm';
import UpdateBranchForm from '../forms/UpdateBranchForm';
import SearchBranchForm from '../forms/SearchBranchForm';
import { branchApi, type BranchDetails, type CreateBranch, type UpdateBranch } from '../../features/branch';

interface BranchSectionProps {
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
}

const BranchSection: React.FC<BranchSectionProps> = ({ activeSubTab, setActiveSubTab }) => {
    const [selectedBranch, setSelectedBranch] = useState<BranchDetails | null>(null);
    const [createdBranch, setCreatedBranch] = useState<BranchDetails | null>(null);
    const [updatedBranch, setUpdatedBranch] = useState<BranchDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const subTabs = [
        { id: 'create-branch', label: 'Create Branch', icon: Building2 },
        { id: 'update-branch', label: 'View Branches', icon: Edit },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveSubTab(tabId);
        setSelectedBranch(null);
        setCreatedBranch(null);
        setUpdatedBranch(null);
        setSuccess(null);
        setError(null);
    };

    // Previously we fetched all branches when opening the Search tab. That
    // behavior was removed to avoid rendering a huge list by default.

    const handleCreate = async (data: CreateBranch) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setCreatedBranch(null);
        try {
            console.log('BranchSection.handleCreate called with:', data);
            const newBranch = await branchApi.create(data);
            if (newBranch) {
                setSuccess('Branch created successfully');
                setCreatedBranch(newBranch);
                // Stay on the Create tab; no redirect to search
            }
        } catch (err: any) {
            console.error('Create branch error:', err);
            // Extract error message from response.data.detail or fallback
            setError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create branch');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (branchId: string, data: UpdateBranch) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setUpdatedBranch(null);
        try {
            const updatedBranch = await branchApi.update(branchId, data);
            if (updatedBranch) {
                setSuccess('Branch updated successfully');
                setUpdatedBranch(updatedBranch);
                // Stay on the Update tab; no redirect to search
            }
        } catch (err: any) {
            console.error('Update branch error:', err);
            setError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to update branch');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBranch = (b: BranchDetails) => {
        console.log('Branch selected:', b);
        setSelectedBranch(b);
        setActiveSubTab('update-branch');
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    title="Branch Management"
                    description="Create, update, and view branch details"
                />

                <SubTabGrid
                    subTabs={subTabs}
                    activeSubTab={activeSubTab}
                    onSubTabChange={handleTabClick}
                />

                {/* Success alert placed after the subsection tabs (not at the very top) */}
                {success && <div className="mt-4 animate-slide-down"><Alert type="success">{success}</Alert></div>}

                {/* Search results are rendered inside the Search subtab's form component. */}

                <div className="mt-6 bg-white p-8 rounded-2xl shadow-md border border-borderLight animate-slide-in-right">
                    {/* CREATE BRANCH */}
                    {activeSubTab === 'create-branch' && (
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-xl font-bold text-primary mb-4">Create New Branch</h2>
                            {error && <div className="mb-4 animate-slide-down"><Alert type="error">{error}</Alert></div>}
                            <CreateBranchForm onSuccess={handleCreate} isLoading={loading} createdBranch={createdBranch} />
                        </div>
                    )}

                    {/* UPDATE BRANCH */}
                    {activeSubTab === 'update-branch' && (
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-xl font-bold text-primary mb-4">Update Branch</h2>
                            {error && <div className="mb-4 animate-slide-down"><Alert type="error">{error}</Alert></div>}
                            {selectedBranch ? (
                                <UpdateBranchForm
                                    branch={selectedBranch}
                                    onSubmit={handleUpdate}
                                    isLoading={loading}
                                    updatedBranch={updatedBranch}
                                />
                            ) : (
                                <SearchBranchForm
                                    onSelect={handleSelectBranch}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BranchSection;
