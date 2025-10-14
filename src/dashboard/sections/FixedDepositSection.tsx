import { PiggyBank } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import GenericContentCard from '../../components/layout/GenericContentCard';

interface FixedDepositSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const FixedDepositSection = ({ activeSubTab, setActiveSubTab }: FixedDepositSectionProps) => {
  const subTabs = [
    { id: 'open fixed-deposit', label: 'Open Fixed Deposit', icon: PiggyBank },
    { id: 'matured fixed-deposit', label: 'Matured Fixed Deposits', icon: PiggyBank },
  ];

  return (
    <div className="p-8">
      <SectionHeader
        title="Fixed Deposits"
        description="Manage fixed deposit accounts and operations"
      />

      <SubTabGrid
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      <GenericContentCard
        activeSubTab={activeSubTab}
        subTabs={subTabs}
        description="Fixed deposit operations"
      />
    </div>
  );
};

export default FixedDepositSection;
