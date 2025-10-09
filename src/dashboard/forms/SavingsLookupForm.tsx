import React, { useState } from 'react';
import api from '../../api/axios';
import { CheckCircle } from 'lucide-react';

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
  const [found, setFound] = useState<any | null>(null);
  const [notFound, setNotFound] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
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
        <input value={nic} onChange={e => setNic(e.target.value)} placeholder="Enter NIC" className="p-2 border rounded w-full" />
        <button type="button" onClick={lookup} className="px-4 py-2 bg-blue-600 text-white rounded">Find</button>
      </div>
      <div className="mt-3">
        {loading && <div className="text-slate-500">Searching...</div>}
        {found && <CustomerSummary customer={found} />}
        {notFound && <div className="text-red-600">{notFound}</div>}
      </div>
    </div>
  );
};

export default SavingsLookupForm;
