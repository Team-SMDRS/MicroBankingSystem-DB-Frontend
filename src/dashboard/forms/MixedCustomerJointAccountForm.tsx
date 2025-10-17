import React, { useState } from 'react';
import { jointAccountApi } from '../../api';

interface MixedCustomerJointAccountFormProps {
  existingCustomer: { 
    customerId: string;
    name: string;
    nic: string;
  } | null;
  newCustomerNic: string;
  onReset?: () => void; // Optional callback to reset the parent form
}

interface CustomerInfo {
  full_name: string;
  address: string;
  phone_number: string;
  nic: string;
  dob: string;
}

interface MixedCustomerResult {
  existing_customer_id: string;
  new_customer_id: string;
  acc_id: string;
  account_no: number;
  new_customer_login: {
    username: string;
    password: string;
  };
}

const MixedCustomerJointAccountForm: React.FC<MixedCustomerJointAccountFormProps> = ({ 
  existingCustomer, 
  newCustomerNic,
  onReset 
}) => {
  // Form fields state for the new customer
  const [newCustomer, setNewCustomer] = useState<CustomerInfo>({
    full_name: '',
    address: '',
    phone_number: '',
    nic: newCustomerNic,
    dob: ''
  });

  const [balance, setBalance] = useState<number | ''>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<MixedCustomerResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle new customer field changes
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value
    });
    if (errors[`new_customer_${name}`]) {
      setErrors({
        ...errors,
        [`new_customer_${name}`]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate new customer
    if (!newCustomer.full_name) newErrors.new_customer_full_name = 'Name is required';
    if (!newCustomer.address) newErrors.new_customer_address = 'Address is required';
    if (!newCustomer.phone_number) newErrors.new_customer_phone_number = 'Phone number is required';
    if (!newCustomer.dob) newErrors.new_customer_dob = 'Date of birth is required';

    // Validate balance
    if (!balance || Number(balance) <= 0) newErrors.balance = 'Please enter a valid initial balance';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateJointAccount = async () => {
    if (!existingCustomer) {
      setApiError("Missing existing customer information");
      return;
    }

    // Validate form
    if (!validateForm()) return;

    setCreateLoading(true);
    setApiError(null);

    try {
      const response = await jointAccountApi.createJointAccountWithExistingAndNew({
        existing_customer_nic: existingCustomer.nic,
        new_customer: newCustomer,
        balance: Number(balance)
      });

      setResult(response);
    } catch (err: any) {
      setApiError(err.response?.data?.detail || err.message || 'Failed to create joint account');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleReset = () => {
    setNewCustomer({
      full_name: '',
      address: '',
      phone_number: '',
      nic: newCustomerNic,
      dob: ''
    });
    setBalance('');
    setErrors({});
    setResult(null);
    setApiError(null);
    
    // Call parent reset function if provided
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="mt-5 p-4 border rounded-lg border-t-4 border-t-[#2A9D8F] bg-white">
      <h5 className="text-md font-medium mb-3 text-[#264653]">Create Joint Account with Existing and New Customer</h5>
      
      {!result && (
        <div className="space-y-5">
          {apiError && (
            <div className="p-3 bg-[#E63946] bg-opacity-10 border border-[#E63946] border-opacity-20 text-[#E63946] rounded-lg">
              {apiError}
            </div>
          )}
          
          <div>
            <h6 className="font-medium mb-2 text-[#264653]">Existing Customer</h6>
            <div className="p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-[#264653]">{existingCustomer?.name}</div>
                  <div className="text-sm text-[#6C757D]">NIC: {existingCustomer?.nic}</div>
                  <div className="text-sm text-[#6C757D]">Customer ID: {existingCustomer?.customerId}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-medium mb-2 text-[#264653]">New Customer Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={newCustomer.nic}
                  readOnly
                  className="p-2 border border-[#DEE2E6] rounded-lg w-full bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={newCustomer.full_name}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.new_customer_full_name ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.new_customer_full_name && (
                  <div className="text-sm text-[#E63946]">{errors.new_customer_full_name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.new_customer_address ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.new_customer_address && (
                  <div className="text-sm text-[#E63946]">{errors.new_customer_address}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={newCustomer.phone_number}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.new_customer_phone_number ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.new_customer_phone_number && (
                  <div className="text-sm text-[#E63946]">{errors.new_customer_phone_number}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={newCustomer.dob}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.new_customer_dob ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.new_customer_dob && (
                  <div className="text-sm text-[#E63946]">{errors.new_customer_dob}</div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-medium mb-2 text-[#264653]">Account Information</h6>
            <div>
              <label className="block text-sm text-[#6C757D] mb-1">Initial Balance (LKR)</label>
              <input
                type="number"
                name="balance"
                value={balance as any}
                onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.balance ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                disabled={createLoading}
              />
              {errors.balance && (
                <div className="text-sm text-[#E63946]">{errors.balance}</div>
              )}
            </div>
          </div>
          
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleCreateJointAccount}
              className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-opacity-90 transition-all"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Joint Account'}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="p-3 bg-[#38B000] bg-opacity-10 border border-[#38B000] border-opacity-20 text-[#264653] rounded-lg mt-3">
          <div className="font-medium">Joint account created successfully!</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
              <h6 className="font-medium text-[#264653]">{existingCustomer?.name}</h6>
              <div className="text-sm mt-2">
                <div>Customer ID: <span className="text-[#2A9D8F]">{result.existing_customer_id}</span></div>
                <div>NIC: <span className="text-[#6C757D]">{existingCustomer?.nic}</span></div>
              </div>
            </div>
            
            <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
              <h6 className="font-medium text-[#264653]">{newCustomer.full_name}</h6>
              <div className="text-sm mt-2">
                <div>Customer ID: <span className="text-[#2A9D8F]">{result.new_customer_id}</span></div>
                <div>NIC: <span className="text-[#6C757D]">{newCustomer.nic}</span></div>
                <div>Username: <span className="text-[#2A9D8F] font-medium">{result.new_customer_login.username}</span></div>
                <div>Password: <span className="text-[#2A9D8F] font-medium">{result.new_customer_login.password}</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-3 border border-[#DEE2E6] rounded-lg bg-white">
            <h6 className="font-medium text-[#264653]">Account Details</h6>
            <div className="text-sm mt-2">
              <div>Account Number: <span className="text-[#2A9D8F] font-medium">{result.account_no}</span></div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#6C757D] hover:bg-opacity-90 text-white rounded-lg transition-all"
            >
              Close & Reset Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MixedCustomerJointAccountForm;