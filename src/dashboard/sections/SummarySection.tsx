import { Building2, TrendingUp, FileText } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import BranchSummary from '../tables/BranchSummary';
import TransactionSummary from '../tables/TransactionSummary';
import AccountSummary from '../tables/AccountSummary';

interface SummarySectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const SummarySection = ({ activeSubTab, setActiveSubTab }: SummarySectionProps) => {
  const subTabs = [
    { id: 'branch-summary', label: 'Branch Summary', icon: Building2 },
    { id: 'transaction-summary', label: 'Transaction Summary', icon: TrendingUp },
    { id: 'account-summary', label: 'Account Summary', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'branch-summary':
        return <BranchSummary />;
      case 'transaction-summary':
        return <TransactionSummary />;
      case 'account-summary':
        return <AccountSummary />;
      default:
        return <BranchSummary />;
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
