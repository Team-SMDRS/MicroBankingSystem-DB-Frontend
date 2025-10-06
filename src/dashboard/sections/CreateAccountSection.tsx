import { Landmark, Users, CreditCard } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import GenericContentCard from '../../components/layout/GenericContentCard';

interface CreateAccountSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const CreateAccountSection = ({ activeSubTab, setActiveSubTab }: CreateAccountSectionProps) => {
  const subTabs = [
    { id: 'fixed-deposit-new', label: 'Fixed Deposit Account', icon: Landmark },
    { id: 'joint-account-new', label: 'Joint Account', icon: Users },
    { id: 'current-account-new', label: 'Current Account', icon: CreditCard },
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

      <GenericContentCard 
        activeSubTab={activeSubTab}
        subTabs={subTabs}
        description="Create a new"
      />
    </div>
  );
};

export default CreateAccountSection;
