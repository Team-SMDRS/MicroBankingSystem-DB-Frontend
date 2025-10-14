import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { CheckCircle } from 'lucide-react';
import CreateAccountForExisting from './CreateAccountForExisting';
import RegisterAndCreate from './RegisterAndCreate';

const CustomerSummary = ({ customer }: { customer: any }) => (
  <div className="p-3 border rounded bg-slate-50">
    <div className="flex items-start justify-between">
      <div>
        <div className="font-semibold">{customer.name}</div>
        <div className="text-sm text-slate-600">NIC: {customer.nic}</div>
        <div className="text-sm text-slate-600">Customer ID: {customer.customerId}</div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <CheckCircle className="text-green-500" aria-label="Customer found" size={20} />
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
    <div>
      <h4 className="text-lg font-medium mb-3">Savings Account - Lookup Customer</h4>
      <div className="flex gap-3">
        <input value={nic} onChange={e => setNic(e.target.value)} placeholder="Enter NIC" className={`p-2 border rounded w-full ${nicError ? 'border-red-500' : ''}`} />
        <button type="button" onClick={lookup} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">Find</button>
      </div>
      {nicError && <div className="text-sm text-red-600 mt-1">{nicError}</div>}
      <div className="mt-3">
        {loading && <div className="text-slate-500">Searching...</div>}
        {found && <CustomerSummary customer={found} />}
        {notFound && <div className="text-red-600">{notFound}</div>}
      </div>
      {/* Create account form shown when customer is found */}
      {found && (
        <div className="mt-4 border-t pt-4">
          <h5 className="font-semibold mb-3">Create Savings Account for {found.name}</h5>
          <CreateAccountForExisting customer={found} plans={plans} plansLoading={plansLoading} plansError={plansError} />
        </div>
      )}

      {/* If not found, show registration + create form */}
      {notFound && (
        <div className="mt-4 border-t pt-4">
          <h5 className="font-semibold mb-3">Register Customer and Create Savings Account</h5>
          <RegisterAndCreate defaultNic={nic} plans={plans} plansLoading={plansLoading} plansError={plansError} />
        </div>
      )}
    </div>
  );
};

export default SavingsLookupForm;
