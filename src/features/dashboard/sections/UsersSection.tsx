import { Users, ArrowLeftRight, UserCog, UserPlus } from 'lucide-react';
import SectionHeader from '../../../components/layout/SectionHeader';
import SubTabGrid from '../../../components/layout/SubTabGrid';
import GenericContentCard from '../../../components/layout/GenericContentCard';

interface UsersSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const UsersSection = ({ activeSubTab, setActiveSubTab }: UsersSectionProps) => {
  const subTabs = [
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'transfer-agent', label: 'Transfer Agent', icon: ArrowLeftRight },
    { id: 'deposit-withdrawal-agent', label: 'Deposit/Withdrawal Agent', icon: UserCog },
    { id: 'account-agent', label: 'Account Agent', icon: UserPlus },
  ];

  return (
    <div className="p-8">
      <SectionHeader 
        title="Users"
        description="Manage your users efficiently and securely"
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

export default UsersSection;
