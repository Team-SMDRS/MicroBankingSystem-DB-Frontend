import { Users, ArrowLeftRight, UserCog, UserPlus } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import GenericContentCard from '../../components/layout/GenericContentCard';
import { CreateUserForm } from '../forms';

interface UsersSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const UsersSection = ({ activeSubTab, setActiveSubTab }: UsersSectionProps) => {
  const subTabs = [
    { id: 'create-user', label: 'Create User', icon: UserPlus },
    { id: 'transfer-agent', label: 'Transfer Agent', icon: ArrowLeftRight },
    { id: 'deposit-withdrawal-agent', label: 'Deposit/Withdrawal Agent', icon: UserCog },
    { id: 'account-agent', label: 'Account Agent', icon: Users },
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
      >
        {activeSubTab === 'create-user' && <CreateUserForm />}
      </GenericContentCard>
    </div>
  );
};

export default UsersSection;
