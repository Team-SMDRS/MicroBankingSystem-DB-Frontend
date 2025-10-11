import React from 'react';
import { Users, CreditCard, Trash2 } from 'lucide-react';
import SavingsLookupForm from '../forms/SavingsLookupForm';
import JointLookupForm from '../forms/JointLookupForm';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';

interface CreateAccountSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const CreateAccountSection = ({ activeSubTab, setActiveSubTab }: CreateAccountSectionProps) => {
  const subTabs = [
    { id: 'joint-account-new', label: 'Create Joint Account', icon: Users },
    { id: 'savings-account-new', label: 'Create Savings Account', icon: CreditCard },
    { id: 'delete-account', label: 'Delete Account', icon: Trash2, danger: true },
  ];

  return (
    <div className="p-8">
      <SectionHeader 
        title="Create Account"
        description="Manage your create-account efficiently and securely"
      />
      
      <SubTabGrid 
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />

      {/* Inline simple form: one input for savings, two for joint */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        {activeSubTab === 'savings-account-new' && (
          <SavingsLookupForm />
        )}

        {activeSubTab === 'joint-account-new' && (
          <JointLookupForm />
        )}

        {activeSubTab === 'delete-account' && (
          <div className="flex justify-end">
            <DeleteAccountAction />
          </div>
        )}
      </div>
    </div>
  );
};

const DeleteAccountAction: React.FC = () => {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <div>
      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete account</button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-700">Are you sure?</span>
          <button onClick={() => { /* TODO: call delete API */ setConfirming(false); }} className="px-3 py-1 bg-red-700 text-white rounded-md">Confirm</button>
          <button onClick={() => setConfirming(false)} className="px-3 py-1 border rounded-md">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CreateAccountSection;


