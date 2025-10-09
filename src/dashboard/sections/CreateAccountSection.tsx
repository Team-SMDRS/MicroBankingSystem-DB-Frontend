import { Users, CreditCard } from 'lucide-react';
import SavingsLookupForm from '../forms/SavingsLookupForm';
import JointLookupForm from '../forms/JointLookupForm';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
// ...existing imports

interface CreateAccountSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const CreateAccountSection = ({ activeSubTab, setActiveSubTab }: CreateAccountSectionProps) => {
  const subTabs = [
    { id: 'joint-account-new', label: 'Joint Account', icon: Users },
    { id: 'savings-account-new', label: 'Savings Account', icon: CreditCard },
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
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        {activeSubTab === 'savings-account-new' && (
          <SavingsLookupForm />
        )}

        {activeSubTab === 'joint-account-new' && (
          <JointLookupForm />
        )}
      </div>
    </div>
  );
};



export default CreateAccountSection;
