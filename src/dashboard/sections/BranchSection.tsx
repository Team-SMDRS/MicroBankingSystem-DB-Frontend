import React, { useState, useEffect } from 'react';
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
        setSuccess(null);
        setError(null);
    };

    const fetchAllBranches = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.getAll();
            setBranches(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateBranch) => {
        setLoading(true);
        setError(null);
        try {
            const newBranch = await branchApi.create(data);
            if (newBranch) {
                setSuccess('Branch created successfully');
                setActiveSubTab('search-branch');
                await fetchAllBranches();
            }
        } catch (err: any) {
            console.error('Create branch error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create branch');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (branchId: string, data: UpdateBranch) => {
        setLoading(true);
        setError(null);
        try {
            const updatedBranch = await branchApi.update(branchId, data);
            if (updatedBranch) {
                setSuccess('Branch updated successfully');
                setActiveSubTab('search-branch');
                await fetchAllBranches();
            }
        } catch (err: any) {
            console.error('Update branch error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update branch');
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
            setError(`Search failed: ${err.response?.status === 404 ? 'Endpoint not found' : err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all branches initially
    useEffect(() => {
        if (activeSubTab === 'search-branch') fetchAllBranches();
    }, [activeSubTab]);

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

            <div className="mt-6">
                {/* CREATE BRANCH */}
                {activeSubTab === 'create-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Create New Branch</h2>
                        <CreateBranchForm onSuccess={handleCreate} />
                    </div>
                )}

                {/* UPDATE BRANCH */}
                {activeSubTab === 'update-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Update Branch</h2>
                        {selectedBranch ? (
                            <UpdateBranchForm
                                branch={selectedBranch}
                                onSubmit={handleUpdate}
                                isLoading={loading}
                            />
                        ) : (
                            <SearchBranchForm
                                onSearch={handleSearch}
                                isLoading={loading}
                                results={branches}
                                onSelect={setSelectedBranch}
                            />
                        )}
                    </div>
                )}

                {/* SEARCH BRANCH */}
                {activeSubTab === 'search-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Search Branches</h2>
                        <SearchBranchForm
                            onSearch={handleSearch}
                            isLoading={loading}
                            results={branches}
                        />
                    </div>
                )}
            </div>

            {/* ALERTS */}
            {error && <div className="mt-6"><Alert type="error">{error}</Alert></div>}
            {success && <div className="mt-6"><Alert type="success">{success}</Alert></div>}
        </div>
    );
};

export default BranchSection;
