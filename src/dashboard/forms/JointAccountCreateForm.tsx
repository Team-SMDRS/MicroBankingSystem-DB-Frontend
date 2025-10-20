import React, { useState } from 'react';
import { jointAccountApi } from '../../api';

interface JointAccountCreateFormProps {
  customer1: { 
    customerId: string;
    name: string;
    nic: string;
  };
  customer2: {
    customerId: string;
    name: string;
    nic: string;
  };
  onReset?: () => void; // Optional callback to reset the parent form
}

interface CreateResult {
  success: boolean;
  message: string;
  data?: { 
    acc_id: string;
    account_no: number;
  };
}

const JointAccountCreateForm: React.FC<JointAccountCreateFormProps> = ({ customer1, customer2, onReset }) => {
  const [balance, setBalance] = useState<number | ''>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ balance?: string }>({});
  const [result, setResult] = useState<CreateResult | null>(null);
  
  // Handle resetting the form and parent component
  const handleReset = () => {
    setBalance('');
    setResult(null);
    setFieldErrors({});
    // Call parent reset function if provided
    if (onReset) {
      onReset();
    }
  };

  const handleCreateJointAccount = async () => {
    // Reset states
    setResult(null);
    setFieldErrors({});
    
    // Validate
    if (!balance || Number(balance) <= 0) {
      setFieldErrors({ balance: 'Please enter a valid initial balance' });
      return;
    }
    
    setCreateLoading(true);
    try {
      const response = await jointAccountApi.createJointAccount({
        nic1: customer1.nic,
        nic2: customer2.nic,
        balance: Number(balance)
      });
      
      setResult({
        success: true,
        message: `Joint account created successfully`,
        data: {
          acc_id: response.acc_id,
          account_no: response.account_no
        }
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.response?.data?.detail || err.message || 'Failed to create joint account'
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="mt-5 p-6 border border-borderLight rounded-2xl bg-white animate-slide-in-right">
      <h5 className="text-lg font-semibold text-primary mb-4">Create Joint Account</h5>
      <div className="space-y-4">
        {!result?.success && (
          <>
            <div>
              <label className="label-text">Initial Balance (LKR)</label>
              <input
                type="number"
                value={balance as any}
                onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className={`input-field w-full ${fieldErrors.balance ? 'border-red-500' : ''}`}
                disabled={createLoading}
              />
              {fieldErrors.balance && <div className="text-sm text-red-600 mt-1">{fieldErrors.balance}</div>}
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCreateJointAccount}
                className="button-primary px-4 py-2"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Create Joint Account'}
              </button>
            </div>
          </>
        )}
        
        {result && (
          <div className={`p-4 ${result.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'} rounded-2xl mt-4`}>
            <div className="font-semibold text-lg">{result.message}</div>
            {result.success && result.data && (
              <>
                <div className="mt-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 border border-borderLight rounded-2xl bg-white">
                      <h6 className="font-semibold text-primary">{customer1.name}</h6>
                      <div className="text-sm text-secondary">NIC: {customer1.nic}</div>
                    </div>
                    
                    <div className="p-3 border border-borderLight rounded-2xl bg-white">
                      <h6 className="font-semibold text-primary">{customer2.name}</h6>
                      <div className="text-sm text-secondary">NIC: {customer2.nic}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-borderLight rounded-2xl bg-white">
                    <h6 className="font-semibold text-primary">Account Details</h6>
                    <div className="text-sm text-secondary">Account No: {result.data.account_no}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="button-secondary px-4 py-2"
                  >
                    Close & Reset Form
                  </button>
                </div>
              </>
            )}
            {!result.success && (
              <div className="mt-3">
                <button
                  type="button" 
                  onClick={() => setResult(null)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JointAccountCreateForm;