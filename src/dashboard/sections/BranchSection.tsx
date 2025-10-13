import { Building2, Edit, Search } from 'lucide-react';
import { useState } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import Alert from '../../components/common/Alert';

import CreateBranchForm from '../forms/CreateBranchForm';
import UpdateBranchForm from '../forms/UpdateBranchForm';
import SearchBranchForm from '../forms/SearchBranchForm';
import { useBranchOperations } from '../../features/branch/useBranchOperations';
import type { CreateBranch, UpdateBranch } from '../../api/branch';

interface BranchSectionProps {
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
}

const BranchSection: React.FC<BranchSectionProps> = ({ activeSubTab, setActiveSubTab }) => {
    const {
        loading,
        error,
        branches,
        selectedBranch,
        setSelectedBranch,
        getBranchById,
        searchBranchesByName,
        createBranch,
        updateBranch
    } = useBranchOperations();

    const [success, setSuccess] = useState<string | null>(null);

    const subTabs = [
        { id: 'create-branch', label: 'Create Branch', icon: Building2 },
        { id: 'update-branch', label: 'Update Branch', icon: Edit },
        { id: 'search-branch', label: 'Search Branch', icon: Search },
    ];



    const handleTabClick = (tabId: string) => {
        setActiveSubTab(tabId);
        setSuccess(null);
        setSelectedBranch(null);
    };

    const handleCreate = async (data: CreateBranch) => {
        const result = await createBranch(data);
        if (result) {
            setSuccess('Branch created successfully');
            setActiveSubTab('search-branch');
        }
    };

    const handleUpdate = async (branchId: string, data: UpdateBranch) => {
        const result = await updateBranch(branchId, data);
        if (result) {
            setSuccess('Branch updated successfully');
            setActiveSubTab('search-branch');
        }
    };

    const handleSearch = async (query: string, type: 'name' | 'id') => {
        if (type === 'id') {
            await getBranchById(query);
        } else {
            await searchBranchesByName(query);
        }
    };

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


                {/* CREATE BRANCH TAB */}
                {activeSubTab === 'create-branch' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Create New Branch</h2>
                        <CreateBranchForm onSuccess={handleCreate} />
                    </div>
                )}

                {/* UPDATE BRANCH TAB */}
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

                {/* SEARCH BRANCH TAB */}
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

            {/* ERROR / SUCCESS ALERTS */}
            {error && (
                <div className="mt-6">
                    <Alert type="error">{error}</Alert>
                </div>
            )}
            {success && (
                <div className="mt-6">
                    <Alert type="success">{success}</Alert>
                </div>
            )}
        </div>
    );
};

export default BranchSection;