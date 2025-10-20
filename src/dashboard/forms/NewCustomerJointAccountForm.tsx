import React, { useState } from 'react';
import { jointAccountApi } from '../../api';

interface NewCustomerJointAccountFormProps {
  nic1: string;
  nic2: string;
  onReset?: () => void; // Optional callback to reset the parent form
}

interface CustomerInfo {
  full_name: string;
  address: string;
  phone_number: string;
  nic: string;
  dob: string;
}

interface CreateWithNewCustomersResult {
  customer1: {
    customer_id: string;
    nic: string;
    username: string;
    password: string;
  };
  customer2: {
    customer_id: string;
    nic: string;
    username: string;
    password: string;
  };
  acc_id: string;
  account_no: number;
}

const NewCustomerJointAccountForm: React.FC<NewCustomerJointAccountFormProps> = ({ nic1, nic2, onReset }) => {
  // Form fields state for customer 1
  const [customer1, setCustomer1] = useState<CustomerInfo>({
    full_name: '',
    address: '',
    phone_number: '',
    nic: nic1,
    dob: ''
  });

  // Form fields state for customer 2
  const [customer2, setCustomer2] = useState<CustomerInfo>({
    full_name: '',
    address: '',
    phone_number: '',
    nic: nic2,
    dob: ''
  });

  const [balance, setBalance] = useState<number | ''>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<CreateWithNewCustomersResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle customer 1 field changes
  const handleCustomer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer1({
      ...customer1,
      [name]: value
    });
    if (errors[`customer1_${name}`]) {
      setErrors({
        ...errors,
        [`customer1_${name}`]: ''
      });
    }
  };

  // Handle customer 2 field changes
  const handleCustomer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer2({
      ...customer2,
      [name]: value
    });
    if (errors[`customer2_${name}`]) {
      setErrors({
        ...errors,
        [`customer2_${name}`]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate customer 1
    if (!customer1.full_name) newErrors.customer1_full_name = 'Name is required';
    if (!customer1.address) newErrors.customer1_address = 'Address is required';
    if (!customer1.phone_number) newErrors.customer1_phone_number = 'Phone number is required';
    if (!customer1.dob) newErrors.customer1_dob = 'Date of birth is required';

    // Validate customer 2
    if (!customer2.full_name) newErrors.customer2_full_name = 'Name is required';
    if (!customer2.address) newErrors.customer2_address = 'Address is required';
    if (!customer2.phone_number) newErrors.customer2_phone_number = 'Phone number is required';
    if (!customer2.dob) newErrors.customer2_dob = 'Date of birth is required';

    // Validate balance
    if (!balance || Number(balance) <= 0) newErrors.balance = 'Please enter a valid initial balance';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateJointAccount = async () => {
    // Validate form
    if (!validateForm()) return;

    setCreateLoading(true);
    setApiError(null);

    try {
      const response = await jointAccountApi.createJointAccountWithNewCustomers({
        customer1,
        customer2,
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
    setCustomer1({
      full_name: '',
      address: '',
      phone_number: '',
      nic: nic1,
      dob: ''
    });
    setCustomer2({
      full_name: '',
      address: '',
      phone_number: '',
      nic: nic2,
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
      <h5 className="text-lg font-semibold text-primary mb-6">Create Joint Account with New Customers</h5>
      
      {!result && (
        <div className="space-y-6">
          {apiError && (
            <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200">
              {apiError}
            </div>
          )}
          
          <div>
            <h6 className="font-semibold text-primary mb-4">Customer 1 Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={customer1.nic}
                  readOnly
                  className="input-field w-full opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label-text">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={customer1.full_name}
                  onChange={handleCustomer1Change}
                  className={`input-field w-full ${errors.customer1_full_name ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer1_full_name && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer1_full_name}</div>
                )}
              </div>
              <div>
                <label className="label-text">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customer1.address}
                  onChange={handleCustomer1Change}
                  className={`input-field w-full ${errors.customer1_address ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer1_address && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer1_address}</div>
                )}
              </div>
              <div>
                <label className="label-text">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={customer1.phone_number}
                  onChange={handleCustomer1Change}
                  className={`input-field w-full ${errors.customer1_phone_number ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer1_phone_number && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer1_phone_number}</div>
                )}
              </div>
              <div>
                <label className="label-text">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={customer1.dob}
                  onChange={handleCustomer1Change}
                  className={`input-field w-full ${errors.customer1_dob ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer1_dob && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer1_dob}</div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold text-primary mb-4">Customer 2 Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={customer2.nic}
                  readOnly
                  className="input-field w-full opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label-text">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={customer2.full_name}
                  onChange={handleCustomer2Change}
                  className={`input-field w-full ${errors.customer2_full_name ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer2_full_name && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer2_full_name}</div>
                )}
              </div>
              <div>
                <label className="label-text">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customer2.address}
                  onChange={handleCustomer2Change}
                  className={`input-field w-full ${errors.customer2_address ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer2_address && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer2_address}</div>
                )}
              </div>
              <div>
                <label className="label-text">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={customer2.phone_number}
                  onChange={handleCustomer2Change}
                  className={`input-field w-full ${errors.customer2_phone_number ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer2_phone_number && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer2_phone_number}</div>
                )}
              </div>
              <div>
                <label className="label-text">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={customer2.dob}
                  onChange={handleCustomer2Change}
                  className={`input-field w-full ${errors.customer2_dob ? 'border-red-500' : ''}`}
                  disabled={createLoading}
                />
                {errors.customer2_dob && (
                  <div className="text-sm text-red-600 mt-1">{errors.customer2_dob}</div>
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
              <h6 className="font-semibold text-primary mb-2">{customer1.full_name}</h6>
              <div className="text-sm text-secondary space-y-1">
                <div>Customer ID: {result.customer1.customer_id}</div>
                <div>NIC: {result.customer1.nic}</div>
                <div className="font-mono">Username: {result.customer1.username}</div>
                <div className="font-mono">Password: {result.customer1.password}</div>
              </div>
            </div>
            
            <div className="p-4 border border-borderLight rounded-2xl bg-white">
              <h6 className="font-semibold text-primary mb-2">{customer2.full_name}</h6>
              <div className="text-sm text-secondary space-y-1">
                <div>Customer ID: {result.customer2.customer_id}</div>
                <div>NIC: {result.customer2.nic}</div>
                <div className="font-mono">Username: {result.customer2.username}</div>
                <div className="font-mono">Password: {result.customer2.password}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 border border-borderLight rounded-2xl bg-white">
            <h6 className="font-semibold text-primary mb-2">Account Details</h6>
            <div className="text-sm text-secondary">
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

export default NewCustomerJointAccountForm;