import { useState, useRef } from "react";
import { PiggyBank, List } from 'lucide-react';
import SubTabGrid from "../../components/layout/SubTabGrid";
import SectionHeader from "../../components/layout/SectionHeader";
import CreateSavingsPlanForm from "../forms/CreateSavingsPlanForm";
import UpdateSavingsPlanForm from "../forms/UpdateSavingsPlanForm";
import SavingsPlanList from "../components/SavingsPlanList";
import Alert from "../../components/common/Alert";
import type { SavingsPlan } from '../../api/savingsPlans';

interface SavingsPlansSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const subTabs = [
  { id: "create", label: "Create Savings Plan", icon: PiggyBank },
  { id: "plans", label: "View Plans", icon: List },
];

const SavingsPlansSection = ({ activeSubTab, setActiveSubTab }: SavingsPlansSectionProps) => {
  const showContent = !!activeSubTab;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const savingsPlanListRef = useRef<import("../components/SavingsPlanList").SavingsPlanListRef>(null);

  // Handler for when a savings plan is successfully created
  const handleSavingsPlanCreated = (savingsPlanId: string) => {
    setSuccessMessage(`Savings plan created successfully! ID: ${savingsPlanId}`);
    
    // Switch to plans tab after a delay to show the new plan
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveSubTab("plans");
    }, 3000);
  };
  
  // Handler for when the update button is clicked on a plan
  const handleUpdatePlanClick = (plan: SavingsPlan) => {
    setSelectedPlan(plan);
    setShowUpdateForm(true);
  };
  
  // Handler for when a plan is successfully updated
  const handleUpdateSuccess = () => {
    setSuccessMessage("Interest rate updated successfully!");
    setShowUpdateForm(false);
    setSelectedPlan(null);
    
    // Refresh the plans list to show updated interest rate
    if (savingsPlanListRef.current) {
      savingsPlanListRef.current.refreshPlans();
    }
    
    // Reset state after a delay to allow the user to see the success message
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  return (
    <div className="p-8">
      <SectionHeader
        title="Savings Plans"
        description="Manage and view savings plans"
      />

      <SubTabGrid
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={(tab) => setActiveSubTab(tab)}
      />

      {successMessage && (
        <div className="mt-4">
          <Alert type="success">
            <div className="flex justify-between items-center">
              <div>{successMessage}</div>
              <button 
                className="ml-2 text-emerald-700 hover:text-emerald-900" 
                onClick={() => setSuccessMessage(null)}
              >
                ×
              </button>
            </div>
          </Alert>
        </div>
      )}

      {showContent && activeSubTab === "create" && (
        <div className="mt-4">
          <div className="w-full">
            <CreateSavingsPlanForm onSuccess={handleSavingsPlanCreated} />
          </div>
        </div>
      )}

      {showContent && activeSubTab === "plans" && (
        <div className="mt-4">
          {showUpdateForm && selectedPlan ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Update Savings Plan</h3>
                <button 
                  onClick={() => setShowUpdateForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Back to Plans List
                </button>
              </div>
              <UpdateSavingsPlanForm 
                plan={selectedPlan} 
                onSuccess={handleUpdateSuccess}
                onCancel={() => {
                  setShowUpdateForm(false);
                  setSelectedPlan(null);
                }}
              />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Savings Plans</h3>
                <button 
                  onClick={() => setActiveSubTab("create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create New Plan
                </button>
              </div>
              <p className="text-gray-600 mb-4">View and manage all available savings plans</p>
              <div className="mt-4">
                <SavingsPlanList 
                ref={savingsPlanListRef}
                onUpdateClick={(plan) => handleUpdatePlanClick(plan)} 
              />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavingsPlansSection;
