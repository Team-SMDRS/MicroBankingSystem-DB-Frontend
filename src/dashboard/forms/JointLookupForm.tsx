import React, { useState } from 'react';
import api from '../../api/axios';
import { CheckCircle } from 'lucide-react';
import JointAccountCreateForm from './JointAccountCreateForm';
import NewCustomerJointAccountForm from './NewCustomerJointAccountForm';
import MixedCustomerJointAccountForm from './MixedCustomerJointAccountForm';

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

const JointLookupForm: React.FC = () => {
  const [nic1, setNic1] = useState('');
  const [nic2, setNic2] = useState('');
  const [found1, setFound1] = useState<any | null>(null);
  const [found2, setFound2] = useState<any | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const lookupBoth = async () => {
    setLoading(true);
    setFound1(null);
    setFound2(null);
    setErrors([]);
    const errs: string[] = [];
    try {
      // Validate that both NICs are provided
      if (!nic1.trim()) errs.push('Please enter NIC for Customer 1');
      if (!nic2.trim()) errs.push('Please enter NIC for Customer 2');
      
      if (nic1.trim() && nic2.trim()) {
        const [r1, r2] = await Promise.all([
          api.get(`/customer_data/by-nic/${encodeURIComponent(nic1.trim())}`).catch(e => e),
          api.get(`/customer_data/by-nic/${encodeURIComponent(nic2.trim())}`).catch(e => e),
        ]);
  
        let c1 = null;
        let c2 = null;
        if (!(r1 instanceof Error)) {
          const d1 = r1.data;
          c1 = { customerId: d1.customer_id, name: d1.full_name, nic: d1.nic };
        } else errs.push(`No customer found with NIC '${nic1}'.`);
  
        if (!(r2 instanceof Error)) {
          const d2 = r2.data;
          c2 = { customerId: d2.customer_id, name: d2.full_name, nic: d2.nic };
        } else errs.push(`No customer found with NIC '${nic2}'.`);
  
        if (c1 && c2 && c1.customerId === c2.customerId) {
          errs.push('Please select two different customers for a joint account.');
        }
        setFound1(c1);
        setFound2(c2);
      }
      
      setErrors(errs);
    } catch (err: any) {
      setErrors([err.message || 'Lookup failed']);
    } finally {
      setLoading(false);
    }
  };

  const bothCustomersFound = found1 && found2 && errors.length === 0;
  const bothNICsProvided = nic1.trim() !== '' && nic2.trim() !== '';
  
  // Only show the new customer form when both customers are not found
  const showNewCustomerForm = bothNICsProvided && 
    errors.length === 2 && 
    errors.every(err => err.includes('No customer found with NIC'));
    
  // Show mixed form when exactly one customer is found and one is not found
  const showMixedCustomerForm = 
    ((found1 && !found2) || (!found1 && found2)) && 
    errors.length === 1 && 
    errors.some(err => err.includes('No customer found with NIC'));
    
  // Determine which customer is found and which isn't for the mixed form
  const existingCustomer = found1 || found2;
  const newCustomerNic = found1 ? nic2 : nic1;
  
  const resetForm = () => {
    setNic1('');
    setNic2('');
    setFound1(null);
    // setFound2(null);
    // setErrors([]);
    setFound2(null);
    setErrors([]);
  };

  return (
    <div>
      <h4 className="text-lg font-medium mb-3">Joint Account - Lookup Two Customers</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={nic1} onChange={e => setNic1(e.target.value)} placeholder="Enter NIC for Customer 1" className="p-2 border rounded w-full" />
        <input value={nic2} onChange={e => setNic2(e.target.value)} placeholder="Enter NIC for Customer 2" className="p-2 border rounded w-full" />
      </div>
      <div className="mt-3 flex gap-3">
        <button 
          type="button" 
          onClick={lookupBoth} 
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Find Both'}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {errors.length > 0 && errors.filter(err => !err.includes('No customer found with NIC')).map((er, idx) => (
          <div key={idx} className="text-red-600">{er}</div>
        ))}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>{found1 ? <CustomerSummary customer={found1} /> : <div className="text-slate-500">Customer 1 not found</div>}</div>
          <div>{found2 ? <CustomerSummary customer={found2} /> : <div className="text-slate-500">Customer 2 not found</div>}</div>
        </div>
        
      </div>
      
      {/* Show the appropriate form based on the conditions */}
      {bothCustomersFound && (
        <JointAccountCreateForm 
          customer1={found1} 
          customer2={found2} 
          onReset={resetForm}
        />
      )}
      
      {showNewCustomerForm && (
        <NewCustomerJointAccountForm 
          nic1={nic1} 
          nic2={nic2} 
          onReset={resetForm}
        />
      )}
      
      {showMixedCustomerForm && (
        <MixedCustomerJointAccountForm 
          existingCustomer={existingCustomer}
          newCustomerNic={newCustomerNic}
          onReset={resetForm}
        />
      )}
    </div>
  );
};

export default JointLookupForm;
