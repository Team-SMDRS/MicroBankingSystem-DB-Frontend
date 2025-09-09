import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import { useAuth } from '../store/authContex';

const RegisterCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { agent } = useAuth();
  
  // State for form fields
  const [customerName, setCustomerName] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [accountType, setAccountType] = useState('Adult (18+)');
  const [initialDeposit, setInitialDeposit] = useState('');

  // Savings account options are derived from the project requirements
  const savingsAccountPlans = [
    { name: 'Children', details: '12% interest, no minimum balance' },
    { name: 'Teen', details: '11% interest, min LKR 500' },
    { name: 'Adult (18+)', details: '10% interest, min LKR 1000' },
    { name: 'Senior (60+)', details: '13% interest, min LKR 1000' },
    { name: 'Joint', details: '7% interest, min LKR 5000' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend API
    console.log({
      customerName,
      nic,
      address,
      accountType,
      initialDeposit,
      createdByAgent: agent?.agentId
    });
    
    alert(`New customer "${customerName}" created successfully!`);
    // Redirect back to the dashboard after successful creation
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Customer</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
            </div>

            {/* NIC Number */}
            <div>
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC Number</label>
              <input type="text" id="nic" value={nic} onChange={(e) => setNic(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
            </div>

            <hr className="md:col-span-2 my-2"/>

            {/* Account Type */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">Savings Account Plan</label>
              <select id="accountType" value={accountType} onChange={(e) => setAccountType(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
                {savingsAccountPlans.map(plan => (
                  <option key={plan.name} value={plan.name}>{plan.name} - ({plan.details})</option>
                ))}
              </select>
            </div>

            {/* Initial Deposit */}
            <div>
              <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700">Initial Deposit (LKR)</label>
              <input type="number" id="initialDeposit" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button  onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button>
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomerPage;