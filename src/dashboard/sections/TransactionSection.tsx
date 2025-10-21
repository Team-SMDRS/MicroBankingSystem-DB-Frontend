import { ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';
import BankTransferForm from '../forms/BankTransferForm';
import WithdrawalForm from '../forms/WithdrawalForm';
import DepositForm from '../forms/DepositForm';

interface TransactionSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const TransactionSection = ({ activeSubTab, setActiveSubTab }: TransactionSectionProps) => {
  const subTabs = [
    { id: 'bank-transfer', label: 'Bank Transfer', icon: ArrowLeftRight },
    { id: 'withdrawal', label: 'Withdrawal', icon: ArrowDownToLine },
    { id: 'deposit', label: 'Deposit', icon: ArrowUpFromLine },
  ];

  const renderForm = () => {
    switch (activeSubTab) {
      case 'bank-transfer':
        return <BankTransferForm />;
      case 'withdrawal':
        return <WithdrawalForm />;
      case 'deposit':
        return <DepositForm />;
      default:
        return <BankTransferForm />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Transactions"
          description="Manage your transactions efficiently and securely"
        />
        
        <SubTabGrid 
          subTabs={subTabs}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
        />

        <div className="animate-slide-in-right">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default TransactionSection;
