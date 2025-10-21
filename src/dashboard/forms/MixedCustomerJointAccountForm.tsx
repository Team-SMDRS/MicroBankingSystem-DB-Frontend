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
    <div className="mt-5 p-8 border border-borderLight rounded-2xl bg-white shadow-md animate-slide-in-right">
      <h5 className="text-lg font-semibold text-primary mb-6">Create Joint Account with Existing and New Customer</h5>
      
      {!result && (
        <div className="space-y-6">
          {apiError && (
            <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200">
              {apiError}
            </div>
          )}
          
          <div>
            <h6 className="font-semibold text-primary mb-3">Existing Customer</h6>
            <div className="p-4 border border-borderLight rounded-2xl bg-background">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-primary">{existingCustomer?.name}</div>
                  <div className="text-sm text-textSecondary">NIC: {existingCustomer?.nic}</div>
                  <div className="text-sm text-tertiary">Customer ID: {existingCustomer?.customerId}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold text-primary mb-4">New Customer Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={newCustomer.nic}
                  readOnly
                  className="input-field w-full opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label-text">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={newCustomer.full_name}
                  onChange={handleNewCustomerChange}
                  className={`input-field w-full ${errors.new_customer_full_name ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_full_name && (
                  <div className="text-sm text-red-600 mt-1">{errors.new_customer_full_name}</div>
                )}
              </div>
              <div>
                <label className="label-text">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleNewCustomerChange}
                  className={`input-field w-full ${errors.new_customer_address ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_address && (
                  <div className="text-sm text-red-600 mt-1">{errors.new_customer_address}</div>
                )}
              </div>
              <div>
                <label className="label-text">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={newCustomer.phone_number}
                  onChange={handleNewCustomerChange}
                  className={`input-field w-full ${errors.new_customer_phone_number ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_phone_number && (
                  <div className="text-sm text-red-600 mt-1">{errors.new_customer_phone_number}</div>
                )}
              </div>
              <div>
                <label className="label-text">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={newCustomer.dob}
                  onChange={handleNewCustomerChange}
                  className={`input-field w-full ${errors.new_customer_dob ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_dob && (
                  <div className="text-sm text-red-600 mt-1">{errors.new_customer_dob}</div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold text-primary mb-4">Account Information</h6>
            <div>
              <label className="label-text">Initial Balance (LKR)</label>
              <input
                type="number"
                name="balance"
                value={balance as any}
                onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className={`input-field w-full ${errors.balance ? 'border-red-500' : ''}`}
                disabled={createLoading}
              />
              {errors.balance && (
                <div className="text-sm text-red-600 mt-1">{errors.balance}</div>
              )}
            </div>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCreateJointAccount}
              className="button-primary px-4 py-2"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Joint Account'}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 mt-4">
          <div className="font-semibold text-lg mb-4">Joint account created successfully!</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-borderLight rounded-2xl bg-white">
              <h6 className="font-semibold text-primary mb-2">{existingCustomer?.name}</h6>
              <div className="text-sm text-textSecondary space-y-1">
                <div>Customer ID: {result.existing_customer_id}</div>
                <div>NIC: {existingCustomer?.nic}</div>
              </div>
            </div>
            
            <div className="p-4 border border-borderLight rounded-2xl bg-white">
              <h6 className="font-semibold text-primary mb-2">{newCustomer.full_name}</h6>
              <div className="text-sm text-textSecondary space-y-1">
                <div>Customer ID: {result.new_customer_id}</div>
                <div>NIC: {newCustomer.nic}</div>
                <div className="font-mono">Username: {result.new_customer_login.username}</div>
                <div className="font-mono">Password: {result.new_customer_login.password}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 border border-borderLight rounded-2xl bg-white">
            <h6 className="font-semibold text-primary mb-2">Account Details</h6>
            <div className="text-sm text-textSecondary">
              <div>Account Number: {result.account_no}</div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="button-secondary px-4 py-2"
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