import { useState } from 'react';
import SectionHeader from '../../components/layout/SectionHeader';
import { CreateFixedDepositForm, CloseFDForm } from '../forms';
import Alert from '../../components/common/Alert';
import SubTabGrid from '../../components/layout/SubTabGrid';
import { PiggyBank, X, AlignJustify } from 'lucide-react';
import type { FixedDeposit, CloseFDResponse } from '../../api/fd';
import { FDPlansView } from '../components';

const FixedDepositSection = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdFD, setCreatedFD] = useState<FixedDeposit | null>(null);
  const [closedFD, setClosedFD] = useState<CloseFDResponse | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('create-fd');

  const subTabs = [
    { id: 'create-fd', label: 'Create New FD', icon: PiggyBank },
    { id: 'view-plans', label: 'View FD Plans', icon: AlignJustify },
    { id: 'close-fd', label: 'Close FD', icon: X },
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
    setClosedFD(null);
  };

  const handleCloseFDSuccess = (response: CloseFDResponse) => {
    setClosedFD(response);
    setSuccess('Fixed Deposit closed successfully!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
          <div className="mb-4 animate-slide-down">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {activeSubTab === 'create-fd' && (
          <div className="w-full animate-slide-in-right">
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-borderLight">
              <h3 className="text-lg font-bold text-primary">Create New Fixed Deposit Account</h3>
              <CreateFixedDepositForm onSuccess={handleSuccess} onError={handleError} />
            </div>

            {success && createdFD && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-400 rounded-2xl relative animate-slide-down">
                <button 
                  onClick={handleCloseSuccess}
                  className="absolute top-4 right-4 bg-white rounded-full p-1.5 hover:bg-emerald-100 shadow-sm transition-colors border border-emerald-200"
                  title="Close"
                  aria-label="Close fixed deposit details"
                >
                  <X size={20} className="text-emerald-600" />
                </button>
                <h4 className="font-bold text-emerald-700 mb-5">✓ {success}</h4>
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">FD Account No:</strong> 
                    <span className="text-textSecondary">{createdFD.fd_account_no}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Balance:</strong> 
                    <span className="text-textSecondary">Rs. {createdFD.balance}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Account No:</strong> 
                    <span className="text-textSecondary">{createdFD.account_no}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Branch:</strong> 
                    <span className="text-textSecondary">{createdFD.branch_name}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Opened:</strong> 
                    <span className="text-textSecondary">{new Date(createdFD.opened_date).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Maturity:</strong> 
                    <span className="text-textSecondary">{new Date(createdFD.maturity_date).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Duration:</strong> 
                    <span className="text-textSecondary">{createdFD.plan_duration} months</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Rate:</strong> 
                    <span className="text-textSecondary">{createdFD.plan_interest_rate}% p.a.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'view-plans' && (
          <div className="animate-slide-in-right">
            <FDPlansView onError={setError} />
          </div>
        )}
        
        {activeSubTab === 'close-fd' && (
          <div className="w-full animate-slide-in-right">
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-borderLight">
              <h3 className="text-lg font-bold text-primary">Close Fixed Deposit Account</h3>
              <CloseFDForm onSuccess={handleCloseFDSuccess} onError={handleError} />
            </div>

            {success && closedFD && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-400 rounded-2xl relative animate-slide-down">
                <button 
                  onClick={handleCloseSuccess}
                  className="absolute top-4 right-4 bg-white rounded-full p-1.5 hover:bg-emerald-100 shadow-sm transition-colors border border-emerald-200"
                  title="Close"
                  aria-label="Close fixed deposit details"
                >
                  <X size={20} className="text-emerald-600" />
                </button>
                <h4 className="font-bold text-emerald-700 mb-5">✓ {success}</h4>
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">FD Account No:</strong> 
                    <span className="text-textSecondary">{closedFD.fd_account_no}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Status:</strong> 
                    <span className="font-bold text-red-600">{closedFD.status.toUpperCase()}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-borderLight">
                    <strong className="text-primary">Withdrawn Amount:</strong> 
                    <span className="text-textSecondary">Rs. {parseFloat(closedFD.withdrawn_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositSection;
