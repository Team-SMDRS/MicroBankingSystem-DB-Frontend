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
    <div className="mt-5 p-4 border rounded-lg bg-white border-t-4 border-t-[#2A9D8F]">
      <h5 className="text-md font-medium mb-3 text-[#264653]">Create Joint Account</h5>
      <div className="space-y-3">
        {!result?.success && (
          <>
            <div>
              <label className="block text-sm text-[#6C757D] mb-1">Initial Balance (LKR)</label>
              <input
                type="number"
                value={balance as any}
                onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className={`p-2 border border-[#DEE2E6] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${fieldErrors.balance ? 'border-[#E63946]' : ''}`}
                disabled={createLoading}
              />
              {fieldErrors.balance && <div className="text-sm text-[#E63946]">{fieldErrors.balance}</div>}
            </div>
            
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCreateJointAccount}
                className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 transition-all"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Create Joint Account'}
              </button>
            </div>
          </>
        )}
        
        {result && (
          <div className={`p-3 ${result.success ? 'bg-[#38B000] bg-opacity-10 border border-[#38B000] border-opacity-20 text-[#264653]' : 'bg-[#E63946] bg-opacity-10 border border-[#E63946] border-opacity-20 text-[#E63946]'} rounded-lg mt-3`}>
            <div className="font-medium">{result.message}</div>
            {result.success && result.data && (
              <>
                <div className="mt-3 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
                      <h6 className="font-medium text-[#264653]">{customer1.name}</h6>
                      <div className="text-sm text-[#6C757D]">NIC: {customer1.nic}</div>
                    </div>
                    
                    <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
                      <h6 className="font-medium text-[#264653]">{customer2.name}</h6>
                      <div className="text-sm text-[#6C757D]">NIC: {customer2.nic}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
                    <h6 className="font-medium text-[#264653]">Account Details</h6>
                    <div className="text-sm text-[#2A9D8F] font-medium">Account No: {result.data.account_no}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#6C757D] hover:bg-opacity-90 text-white rounded-lg transition-all"
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
                  className="px-4 py-2 bg-[#6C757D] hover:bg-opacity-90 text-white rounded-lg transition-all"
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