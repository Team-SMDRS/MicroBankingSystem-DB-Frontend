
import { Users, CreditCard, Trash2 } from 'lucide-react';
import SavingsLookupForm from '../forms/SavingsLookupForm';
import JointLookupForm from '../forms/JointLookupForm';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import CloseAccountAction from '../forms/CloseAccountAction';

interface CreateAccountSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const CreateAccountSection = ({ activeSubTab, setActiveSubTab }: CreateAccountSectionProps) => {
  const subTabs = [
    { id: 'joint-account-new', label: 'Create Joint Account', icon: Users },
    { id: 'savings-account-new', label: 'Create Savings Account', icon: CreditCard },
    { id: 'close-account', label: 'Close Account', icon: Trash2, danger: true },
  ];

  return (
    <div className="p-8">
      <SectionHeader 
        title="Create Account"
        description="Manage your create-account efficiently and securely"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      {/* Inline simple form: one input for savings, two for joint */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-[#DEE2E6] border-t-4 border-t-[#2A9D8F]">
        {activeSubTab === 'savings-account-new' && (
          <SavingsLookupForm />
        )}

        {activeSubTab === 'joint-account-new' && (
          <JointLookupForm />
        )}

        {activeSubTab === 'close-account' && (
          <div className="flex justify-end">
            <CloseAccountAction />
          </div>
        )}
      </div>
    </div>
  );
};



// ...existing code...
export default CreateAccountSection;


