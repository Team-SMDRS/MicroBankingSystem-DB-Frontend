import { useState } from "react";
import { PiggyBank, List } from 'lucide-react';
import SubTabGrid from "../../components/layout/SubTabGrid";
import SectionHeader from "../../components/layout/SectionHeader";
import CreateSavingsPlanForm from "../forms/CreateSavingsPlanForm";
import Alert from "../../components/common/Alert";

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

  // Handler for when a savings plan is successfully created
  const handleSavingsPlanCreated = (savingsPlanId: string) => {
    setSuccessMessage(`Savings plan created successfully! ID: ${savingsPlanId}`);
    
    // Optionally switch to plans tab after a delay
    setTimeout(() => {
      setSuccessMessage(null);
      // Uncomment to auto-switch to plans tab
      // setActiveSubTab("plans");
    }, 5000);
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Savings Plans</h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                View all available savings plans
              </p>
              <button 
                onClick={() => setActiveSubTab("create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create New Plan
              </button>
            </div>
            <div className="border-t pt-4 text-center text-gray-500">
              <p>Available savings plans will be listed here.</p>
              <p className="mt-2 text-sm">Click "Create New Plan" to add a new savings plan.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsPlansSection;
