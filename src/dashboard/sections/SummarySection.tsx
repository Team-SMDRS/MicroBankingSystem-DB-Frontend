import { Building2, TrendingUp, FileText, Banknote } from 'lucide-react';
import { useContext } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import BranchSummary from '../tables/BranchSummary';
import TransactionSummary from '../tables/TransactionSummary';
import AccountSummary from '../tables/AccountSummary';
import FDSummary from '../tables/FDSummary';
import { AuthContext } from '../../context/AuthContext';

interface SummarySectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const SummarySection = ({ activeSubTab, setActiveSubTab }: SummarySectionProps) => {
  const authContext = useContext(AuthContext);
  const userPermissions = authContext?.user?.permissions || [];

  const allSubTabs = [
    { id: 'branch-summary', label: 'Branch Summary', icon: Building2 },
    { id: 'transaction-summary', label: 'Transaction Summary', icon: TrendingUp },
    { id: 'account-summary', label: 'Accountwise Transaction Summary', icon: FileText },
    { id: 'fd-summary', label: 'Fixed Deposit Summary', icon: Banknote },
  ];

  // Filter tabs based on permissions
  const subTabs = allSubTabs.filter((tab) => {
    // Only show 'branch-summary' tab if user has 'admin' permission
    if (tab.id === 'branch-summary') {
      return userPermissions.includes('admin');
    }
    // Show all other tabs
    return true;
  });

  const renderContent = () => {
    switch (activeSubTab) {
      case 'branch-summary':
        // Only show branch-summary if user has 'admin' permission
        if (userPermissions.includes('admin')) {
          return <BranchSummary />;
        }
        return <div className="p-8 text-center text-slate-600">You do not have permission to access this section.</div>;
      case 'transaction-summary':
        return <TransactionSummary />;
      case 'account-summary':
        return <AccountSummary />;
      case 'fd-summary':
        return <FDSummary />;
      default:
        return userPermissions.includes('admin') ? <BranchSummary /> : <TransactionSummary />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Summary"
          description="Manage your summary efficiently and securely"
        />
        
        <SubTabGrid 
          subTabs={subTabs}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
        />

        <div className="animate-slide-in-right">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
