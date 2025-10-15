import React, { useState } from 'react';
import { PlusSquare, Search } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import Alert from '../../components/common/Alert';
import CreateFDPlanForm from '../forms/CreateFDPlanForm';
import SearchFDPlanForm from '../forms/SearchFDPlanForm';
import { fdApi, type FDPlanDetails, type CreateFDPlan } from '../../features/fd';

interface FDPlanSectionProps {
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
}

const FDPlanSection: React.FC<FDPlanSectionProps> = ({ activeSubTab, setActiveSubTab }) => {
    const [selectedPlan, setSelectedPlan] = useState<FDPlanDetails | null>(null);
    const [createdPlan, setCreatedPlan] = useState<FDPlanDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const subTabs = [
        { id: 'create-fd-plan', label: 'Create FD Plan', icon: PlusSquare },
        { id: 'search-fd-plan', label: 'Search FD Plans', icon: Search },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveSubTab(tabId);
        setSelectedPlan(null);
        setCreatedPlan(null);
        setSuccess(null);
        setError(null);
    };

    const handleCreate = async (data: CreateFDPlan) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setCreatedPlan(null);
        try {
            console.log('FDPlanSection.handleCreate called with:', data);
            const newPlan = await fdApi.createPlan(data);
            if (newPlan) {
                setSuccess('FD Plan created successfully');
                setCreatedPlan(newPlan);
            }
        } catch (err: any) {
            console.error('Create FD Plan error:', err);
            setError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create FD Plan');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan: FDPlanDetails) => {
        console.log('FD Plan selected:', plan);
        setSelectedPlan(plan);
    };

    return (
        <div className="p-8">
            <SectionHeader
                title="Fixed Deposit Plans"
                description="Create and manage Fixed Deposit Plans"
            />

            <SubTabGrid
                subTabs={subTabs}
                activeSubTab={activeSubTab}
                onSubTabChange={handleTabClick}
            />

            {success && <div className="mt-4"><Alert type="success">{success}</Alert></div>}

            <div className="mt-6">
                {/* CREATE FD PLAN */}
                {activeSubTab === 'create-fd-plan' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Create New FD Plan</h2>
                        {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
                        <CreateFDPlanForm onSuccess={handleCreate} isLoading={loading} createdPlan={createdPlan} />
                    </div>
                )}

                {/* SEARCH FD PLANS */}
                {activeSubTab === 'search-fd-plan' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Search FD Plans</h2>
                        {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
                        <SearchFDPlanForm onSelect={handleSelectPlan} />

                        {/* Show selected plan details */}
                        {selectedPlan && (
                            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
                                <h3 className="text-lg font-semibold mb-2">Selected Plan Details</h3>
                                <div className="text-sm text-slate-700 mb-2">Duration: <span className="font-medium">{selectedPlan.duration} months</span></div>
                                <div className="text-sm text-slate-700 mb-2">Interest Rate: <span className="font-medium">{selectedPlan.interest_rate}%</span></div>
                                <div className="text-sm text-slate-600 mb-2">Status: {selectedPlan.status}</div>
                                <div className="text-sm text-slate-500 mb-4">ID: {selectedPlan.fd_plan_id}</div>
                                <button
                                    type="button"
                                    className="px-3 py-1 border rounded text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => setSelectedPlan(null)}
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FDPlanSection;