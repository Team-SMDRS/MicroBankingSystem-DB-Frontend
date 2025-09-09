// src/components/shared/NewCustomerTracker.tsx
import React, { useMemo } from 'react';
import { useAuth } from '../../store/authContex';
import { mockCustomers } from '../../api/testData';
import { FaUserPlus } from 'react-icons/fa';

const NewCustomerTracker: React.FC = () => {
  const { agent } = useAuth();

  const newCustomersThisMonth = useMemo(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return mockCustomers.filter(c => 
      c.assignedAgentId === agent?.agentId &&
      new Date(c.registrationDate) >= firstDayOfMonth
    ).length;
  }, [agent]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-3 bg-green-100 rounded-full text-green-600"><FaUserPlus size={24}/></div>
      <div>
        <p className="text-sm font-medium text-gray-500">New Customers (This Month)</p>
        <p className="text-3xl font-bold text-gray-900">{newCustomersThisMonth}</p>
      </div>
    </div>
  );
};

export default NewCustomerTracker;