import { useState } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import { CreateFixedDepositForm } from '../forms';
import Alert from '../../components/common/Alert';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { PiggyBank } from 'lucide-react';
import type { FixedDeposit } from '../../api/fd';

const FixedDepositSection = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdFD, setCreatedFD] = useState<FixedDeposit | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('create-fd');

  const subTabs = [
    { id: 'create-fd', label: 'Create New FD', icon: PiggyBank },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveSubTab(tabId);
    setError(null);
    setSuccess(null);
    setCreatedFD(null);
  };

  const handleSuccess = (fd: FixedDeposit) => {
    setCreatedFD(fd);
    setSuccess('Fixed Deposit created successfully!');
    setError(null);
  };

  const handleError = (error: string) => {
    setError(error);
    setSuccess(null);
    setCreatedFD(null);
  };

  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        title="Fixed Deposit Management"
        description="Create and manage fixed deposits with attractive interest rates"
      />

      <SubTabGrid 
        subTabs={subTabs} 
        activeSubTab={activeSubTab} 
        onSubTabChange={handleTabClick} 
      />

      {activeSubTab === 'create-fd' && (
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4">
              <Alert type="error">{error}</Alert>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Create New Fixed Deposit Account</h3>
            <CreateFixedDepositForm onSuccess={handleSuccess} onError={handleError} />
          </div>

          {success && createdFD && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-4">✓ {success}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div><strong>FD Account No:</strong> {createdFD.fd_account_no}</div>
                <div><strong>Balance:</strong> Rs. {createdFD.balance}</div>
                <div><strong>Account No:</strong> {createdFD.account_no}</div>
                <div><strong>Branch:</strong> {createdFD.branch_name}</div>
                <div><strong>Opened:</strong> {new Date(createdFD.opened_date).toLocaleDateString()}</div>
                <div><strong>Maturity:</strong> {new Date(createdFD.maturity_date).toLocaleDateString()}</div>
                <div><strong>Duration:</strong> {createdFD.plan_duration} months</div>
                <div><strong>Rate:</strong> {createdFD.plan_interest_rate}% p.a.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FixedDepositSection;
