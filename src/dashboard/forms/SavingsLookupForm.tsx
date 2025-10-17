import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { CheckCircle } from 'lucide-react';
import CreateAccountForExisting from './CreateAccountForExisting';
import RegisterAndCreate from './RegisterAndCreate';

const CustomerSummary = ({ customer }: { customer: any }) => (
  <div className="p-4 border border-[#E9ECEF] rounded-lg bg-[#F8F9FA] shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <div className="font-semibold text-[#264653]">{customer.name}</div>
        <div className="text-sm text-[#6C757D]">NIC: {customer.nic}</div>
        <div className="text-sm text-[#6C757D]">Customer ID: {customer.customerId}</div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <CheckCircle className="text-[#38B000]" aria-label="Customer found" size={24} />
      </div>
    </div>
  </div>
);

const SavingsLookupForm: React.FC = () => {
  const [nic, setNic] = useState('');
  const [nicError, setNicError] = useState<string | null>(null);
  const [found, setFound] = useState<any | null>(null);
  const [notFound, setNotFound] = useState('');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Array<{ id: string; name: string }>>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const res = await api.get('/api/savings-plan/savings_plans');
        const data = res.data;
        const mapped = (data.savings_plans || []).map((p: any) => ({ id: p.savings_plan_id, name: p.plan_name }));
        setPlans(mapped);
      } catch (err: any) {
        setPlansError(err.response?.data?.detail || err.message || 'Failed to load plans');
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const lookup = async () => {
    const trimmed = nic.trim();
    if (!trimmed) return setNicError('Please enter NIC to search');
    setNicError(null);
    setLoading(true);
    setFound(null);
    setNotFound('');
    try {
      const res = await api.get(`/customer_data/by-nic/${encodeURIComponent(nic.trim())}`);
      const data = res.data;
      const customer = { customerId: data.customer_id, name: data.full_name, nic: data.nic };
      setFound(customer);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'No customer found';
      setNotFound(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#2A9D8F]">
      <h4 className="text-xl font-semibold text-[#264653] mb-6">Savings Account - Lookup Customer</h4>
      <div className="flex gap-4">
        <input 
          value={nic} 
          onChange={e => setNic(e.target.value)} 
          placeholder="Enter NIC" 
          className={`w-full px-4 py-2 border ${nicError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]`} 
        />
        <button 
          type="button" 
          onClick={lookup} 
          disabled={loading} 
          className="px-5 py-2 bg-[#2A9D8F] text-white font-semibold rounded-xl transition-all duration-200 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none"
        >
          Find
        </button>
      </div>
      {nicError && <div className="text-sm text-red-600 mt-2">{nicError}</div>}
      <div className="mt-6">
        {loading && <div className="text-[#6C757D] font-medium">Searching...</div>}
        {found && <CustomerSummary customer={found} />}
        {notFound && <div className="text-red-600 font-medium">{notFound}</div>}
      </div>
      {/* Create account form shown when customer is found */}
      {found && (
        <div className="mt-8 border-t border-[#E9ECEF] pt-6">
          <h5 className="text-lg font-semibold text-[#264653] mb-4">Create Savings Account for {found.name}</h5>
          <CreateAccountForExisting customer={found} plans={plans} plansLoading={plansLoading} plansError={plansError} />
        </div>
      )}

      {/* If not found, show registration + create form */}
      {notFound && (
        <div className="mt-8 border-t border-[#E9ECEF] pt-6">
          <h5 className="text-lg font-semibold text-[#264653] mb-4">Register Customer and Create Savings Account</h5>
          <RegisterAndCreate defaultNic={nic} plans={plans} plansLoading={plansLoading} plansError={plansError} />
        </div>
      )}
    </div>
  );
};

export default SavingsLookupForm;
