import { UserPlus, ClipboardList } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import GenericContentCard from '../../components/layout/GenericContentCard';
import { CreateUserForm } from '../forms';
import { UserManagement } from '../components';

interface UsersSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const UsersSection = ({ activeSubTab, setActiveSubTab }: UsersSectionProps) => {
  const subTabs = [
    { id: 'create-user', label: 'Create User', icon: UserPlus },
    { id: 'user-management', label: 'User Management', icon: ClipboardList },
    // { id: 'deposit-withdrawal-agent', label: 'Deposit/Withdrawal Agent', icon: UserCog },
    // { id: 'account-agent', label: 'Account Agent', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Users"
          description="Manage your users efficiently and securely"
        />
        
        <SubTabGrid 
          subTabs={subTabs}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
        />

        <div className="animate-slide-in-right">
          <GenericContentCard 
            activeSubTab={activeSubTab}
            subTabs={subTabs}
            description=""
          >
            {activeSubTab === 'create-user' && <CreateUserForm />}
            {activeSubTab === 'user-management' && <UserManagement />}
          </GenericContentCard>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;
