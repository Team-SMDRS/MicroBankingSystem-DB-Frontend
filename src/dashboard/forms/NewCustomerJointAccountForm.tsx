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
    <div className="mt-5 p-4 border rounded-lg bg-white border-t-4 border-t-[#2A9D8F]">
      <h5 className="text-md font-medium mb-3 text-[#264653]">Create Joint Account with New Customers</h5>
      
      {!result && (
        <div className="space-y-5">
          {apiError && (
            <div className="p-3 bg-[#E63946] bg-opacity-10 border border-[#E63946] border-opacity-20 text-[#E63946] rounded-lg">
              {apiError}
            </div>
          )}
          
          <div>
            <h6 className="font-medium mb-2 text-[#264653]">Customer 1 Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={customer1.nic}
                  readOnly
                  className="p-2 border border-[#DEE2E6] rounded-lg w-full bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={customer1.full_name}
                  onChange={handleCustomer1Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer1_full_name ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer1_full_name && (
                  <div className="text-sm text-[#E63946]">{errors.customer1_full_name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customer1.address}
                  onChange={handleCustomer1Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer1_address ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer1_address && (
                  <div className="text-sm text-[#E63946]">{errors.customer1_address}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={customer1.phone_number}
                  onChange={handleCustomer1Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer1_phone_number ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer1_phone_number && (
                  <div className="text-sm text-[#E63946]">{errors.customer1_phone_number}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={customer1.dob}
                  onChange={handleCustomer1Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer1_dob ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer1_dob && (
                  <div className="text-sm text-[#E63946]">{errors.customer1_dob}</div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-medium mb-2 text-[#264653]">Customer 2 Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={customer2.nic}
                  readOnly
                  className="p-2 border border-[#DEE2E6] rounded-lg w-full bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={customer2.full_name}
                  onChange={handleCustomer2Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer2_full_name ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer2_full_name && (
                  <div className="text-sm text-[#E63946]">{errors.customer2_full_name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customer2.address}
                  onChange={handleCustomer2Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer2_address ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer2_address && (
                  <div className="text-sm text-[#E63946]">{errors.customer2_address}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={customer2.phone_number}
                  onChange={handleCustomer2Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer2_phone_number ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer2_phone_number && (
                  <div className="text-sm text-[#E63946]">{errors.customer2_phone_number}</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={customer2.dob}
                  onChange={handleCustomer2Change}
                  className={`p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] ${errors.customer2_dob ? 'border-[#E63946]' : 'border-[#DEE2E6]'}`}
                  disabled={createLoading}
                />
                {errors.customer2_dob && (
                  <div className="text-sm text-[#E63946]">{errors.customer2_dob}</div>
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
              className="px-4 py-2 bg-[#2A9D8F] hover:bg-opacity-90 text-white rounded-lg"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Joint Account'}
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="p-3 bg-[#38B000] bg-opacity-10 text-[#264653] rounded-lg mt-3 border border-[#38B000] border-opacity-20">
          <div className="font-medium text-[#38B000]">Joint account created successfully!</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
              <h6 className="font-medium text-[#264653]">{customer1.full_name}</h6>
              <div className="text-sm mt-2 text-[#6C757D]">
                <div>Customer ID: <span className="text-[#264653]">{result.customer1.customer_id}</span></div>
                <div>NIC: <span className="text-[#264653]">{result.customer1.nic}</span></div>
                <div>Username: <span className="text-[#264653]">{result.customer1.username}</span></div>
                <div>Password: <span className="text-[#264653]">{result.customer1.password}</span></div>
              </div>
            </div>
            
            <div className="p-3 border border-[#DEE2E6] rounded-lg bg-white">
              <h6 className="font-medium text-[#264653]">{customer2.full_name}</h6>
              <div className="text-sm mt-2 text-[#6C757D]">
                <div>Customer ID: <span className="text-[#264653]">{result.customer2.customer_id}</span></div>
                <div>NIC: <span className="text-[#264653]">{result.customer2.nic}</span></div>
                <div>Username: <span className="text-[#264653]">{result.customer2.username}</span></div>
                <div>Password: <span className="text-[#264653]">{result.customer2.password}</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-3 border border-[#DEE2E6] rounded-lg bg-white">
            <h6 className="font-medium text-[#264653]">Account Details</h6>
            <div className="text-sm mt-2 text-[#6C757D]">
              <div>Account Number: <span className="text-[#264653]">{result.account_no}</span></div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#6C757D] hover:bg-opacity-90 text-white rounded-lg"
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