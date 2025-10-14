import React, { useState } from 'react';
import { Building2, Edit, Search } from 'lucide-react';
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
    const [branches, setBranches] = useState<BranchDetails[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<BranchDetails | null>(null);
    const [createdBranch, setCreatedBranch] = useState<BranchDetails | null>(null);
    const [updatedBranch, setUpdatedBranch] = useState<BranchDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const subTabs = [
        { id: 'create-branch', label: 'Create Branch', icon: Building2 },
        { id: 'update-branch', label: 'Update Branch', icon: Edit },
        { id: 'search-branch', label: 'Search Branch', icon: Search },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveSubTab(tabId);
        setSelectedBranch(null);
        setCreatedBranch(null);
        setUpdatedBranch(null);
        setBranches([]); // Clear search results when switching tabs
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

    const handleSearch = async (query: string, type: 'id' | 'name') => {
        setLoading(true);
        setError(null);
        try {
            console.log('Searching branch with:', { type, query });
            let result: BranchDetails[] = [];
            if (type === 'id') {
                console.log('Searching by ID at endpoint:', `/branches/${query}`);
                const branch = await branchApi.getById(query);
                result = branch ? [branch] : [];
            } else {
                console.log('Searching by name at endpoint:', `/branches/name/${query}`);
                result = await branchApi.getByName(query);
            }
            console.log('Search result:', result);
            setBranches(result);
            if (result.length === 0) {
                setError('No branches found');
            }
        } catch (err: any) {
            console.error('Search branch error:', {
                error: err,
                response: err.response,
                endpoint: type === 'id' ? `/branches/${query}` : `/branches/name/${query}`,
                status: err.response?.status
            });
            // Extract error message from response (check error, detail, message fields)
            setError(err.response?.data?.error || err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to retrieve branch by ID/name');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBranch = (b: BranchDetails) => {
        console.log('Branch selected:', b);
        setSelectedBranch(b);
        setActiveSubTab('update-branch');
    };

    // NOTE: we intentionally do NOT fetch all branches automatically when
    // entering the Search tab. Showing thousands of branches by default is
    // noisy and slow. Branches will be populated only when the user runs a
    // search (handleSearch) or after creating/updating a branch (we set the
    // single relevant branch into state so the UI can show it).

    return (
        <div className="p-8">
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
            {success && <div className="mt-4"><Alert type="success">{success}</Alert></div>}

            {/* Search results are rendered inside the Search subtab's form component. */}

            <div className="mt-6">
                {/* CREATE BRANCH */}
                {activeSubTab === 'create-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Create New Branch</h2>
                        {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
                        <CreateBranchForm onSuccess={handleCreate} isLoading={loading} createdBranch={createdBranch} />
                    </div>
                )}

                {/* UPDATE BRANCH */}
                {activeSubTab === 'update-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Update Branch</h2>
                        {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
                        {selectedBranch ? (
                            <UpdateBranchForm
                                branch={selectedBranch}
                                onSubmit={handleUpdate}
                                isLoading={loading}
                                updatedBranch={updatedBranch}
                            />
                        ) : (
                            <SearchBranchForm
                                onSearch={handleSearch}
                                isLoading={loading}
                                results={branches}
                                onSelect={handleSelectBranch}
                            />
                        )}
                    </div>
                )}

                {/* SEARCH BRANCH */}
                {activeSubTab === 'search-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Search Branches</h2>
                        {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
                        <SearchBranchForm
                            onSearch={handleSearch}
                            isLoading={loading}
                            results={branches}
                            // When selecting from the main Search tab we only set the selected branch
                            // without automatically navigating to the Update tab.
                            onSelect={(b) => setSelectedBranch(b)}
                        />

                        {/* Inline details for the selected branch (visible on Search tab) */}
                        {selectedBranch && (
                            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
                                <h3 className="text-lg font-semibold mb-2">Selected Branch</h3>
                                <div className="text-sm text-slate-700 mb-2">Name: <span className="font-medium">{selectedBranch.name}</span></div>
                                <div className="text-sm text-slate-600 mb-2">Address: {selectedBranch.address || '—'}</div>
                                <div className="text-sm text-slate-500 mb-4">ID: {selectedBranch.branch_id}</div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        onClick={() => setActiveSubTab('update-branch')}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 border rounded text-sm text-slate-700 hover:bg-slate-50"
                                        onClick={() => setSelectedBranch(null)}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchSection;
