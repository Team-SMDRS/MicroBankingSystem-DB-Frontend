import { useState } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import { CreateFixedDepositForm } from '../forms';
import Alert from '../../components/common/Alert';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { PiggyBank, X, AlignJustify } from 'lucide-react';
import type { FixedDeposit } from '../../api/fd';
import { FDPlansView } from '../components';

const FixedDepositSection = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdFD, setCreatedFD] = useState<FixedDeposit | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('create-fd');

  const subTabs = [
    { id: 'create-fd', label: 'Create New FD', icon: PiggyBank },
    { id: 'view-plans', label: 'View FD Plans', icon: AlignJustify },
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
  
  const handleCloseSuccess = () => {
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

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {activeSubTab === 'create-fd' && (
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Create New Fixed Deposit Account</h3>
            <CreateFixedDepositForm onSuccess={handleSuccess} onError={handleError} />
          </div>

          {success && createdFD && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg relative">
              <button 
                onClick={handleCloseSuccess}
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 hover:bg-slate-100 shadow-sm transition-colors border border-slate-200"
                title="Close"
                aria-label="Close fixed deposit details"
              >
                <X size={20} className="text-slate-600" />
              </button>
              <h4 className="font-semibold text-green-800 mb-5">✓ {success}</h4>
              <div className="space-y-4 max-w-2xl">
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>FD Account No:</strong> 
                  <span>{createdFD.fd_account_no}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Balance:</strong> 
                  <span>Rs. {createdFD.balance}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Account No:</strong> 
                  <span>{createdFD.account_no}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Branch:</strong> 
                  <span>{createdFD.branch_name}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Opened:</strong> 
                  <span>{new Date(createdFD.opened_date).toLocaleDateString()}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Maturity:</strong> 
                  <span>{new Date(createdFD.maturity_date).toLocaleDateString()}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Duration:</strong> 
                  <span>{createdFD.plan_duration} months</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <strong>Rate:</strong> 
                  <span>{createdFD.plan_interest_rate}% p.a.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'view-plans' && (
        <FDPlansView onError={setError} />
      )}
    </div>
  );
};

export default FixedDepositSection;
