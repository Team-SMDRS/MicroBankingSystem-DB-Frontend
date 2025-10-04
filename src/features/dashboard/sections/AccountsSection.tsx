import { Landmark, Users, CreditCard } from 'lucide-react';
import SectionHeader from '../../../components/layout/SectionHeader';
import SubTabGrid from '../../../components/layout/SubTabGrid';
import GenericContentCard from '../../../components/layout/GenericContentCard';

interface AccountsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const AccountsSection = ({ activeSubTab, setActiveSubTab }: AccountsSectionProps) => {
  const subTabs = [
    { id: 'fixed-deposit', label: 'Fixed Deposit Accounts', icon: Landmark },
    { id: 'joint-accounts', label: 'Joint Accounts', icon: Users },
    { id: 'current-accounts', label: 'Current Accounts', icon: CreditCard },
  ];

  return (
    <div className="p-8">
      <SectionHeader 
        title="Accounts"
        description="Manage your accounts efficiently and securely"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      <GenericContentCard 
        activeSubTab={activeSubTab}
        subTabs={subTabs}
        description="View and manage"
      />
    </div>
  );
};

export default AccountsSection;
