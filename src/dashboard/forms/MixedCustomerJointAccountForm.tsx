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
    <div className="mt-5 p-4 border rounded bg-white">
      <h5 className="text-md font-medium mb-3">Create Joint Account with Existing and New Customer</h5>
      
      {!result && (
        <div className="space-y-5">
          {apiError && (
            <div className="p-3 bg-red-50 text-red-800 rounded">
              {apiError}
            </div>
          )}
          
          <div>
            <h6 className="font-medium mb-2">Existing Customer</h6>
            <div className="p-3 border rounded bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{existingCustomer?.name}</div>
                  <div className="text-sm text-slate-600">NIC: {existingCustomer?.nic}</div>
                  <div className="text-sm text-slate-600">Customer ID: {existingCustomer?.customerId}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-medium mb-2">New Customer Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={newCustomer.nic}
                  readOnly
                  className="p-2 border rounded w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={newCustomer.full_name}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded w-full ${errors.new_customer_full_name ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_full_name && (
                  <div className="text-sm text-red-600">{errors.new_customer_full_name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded w-full ${errors.new_customer_address ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_address && (
                  <div className="text-sm text-red-600">{errors.new_customer_address}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={newCustomer.phone_number}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded w-full ${errors.new_customer_phone_number ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_phone_number && (
                  <div className="text-sm text-red-600">{errors.new_customer_phone_number}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={newCustomer.dob}
                  onChange={handleNewCustomerChange}
                  className={`p-2 border rounded w-full ${errors.new_customer_dob ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.new_customer_dob && (
                  <div className="text-sm text-red-600">{errors.new_customer_dob}</div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-medium mb-2">Account Information</h6>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Initial Balance (LKR)</label>
              <input
                type="number"
                name="balance"
                value={balance as any}
                onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className={`p-2 border rounded w-full ${errors.balance ? 'border-red-500' : ''}`}
                disabled={createLoading}
              />
              {errors.balance && (
                <div className="text-sm text-red-600">{errors.balance}</div>
              )}
            </div>
          </div>
          
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleCreateJointAccount}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Joint Account'}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="p-3 bg-green-50 text-green-800 rounded mt-3">
          <div className="font-medium">Joint account created successfully!</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded bg-white">
              <h6 className="font-medium">{existingCustomer?.name}</h6>
              <div className="text-sm mt-2">
                <div>Customer ID: {result.existing_customer_id}</div>
                <div>NIC: {existingCustomer?.nic}</div>
              </div>
            </div>
            
            <div className="p-3 border rounded bg-white">
              <h6 className="font-medium">{newCustomer.full_name}</h6>
              <div className="text-sm mt-2">
                <div>Customer ID: {result.new_customer_id}</div>
                <div>NIC: {newCustomer.nic}</div>
                <div>Username: {result.new_customer_login.username}</div>
                <div>Password: {result.new_customer_login.password}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-3 border rounded bg-white">
            <h6 className="font-medium">Account Details</h6>
            <div className="text-sm mt-2">
              <div>Account Number: {result.account_no}</div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
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