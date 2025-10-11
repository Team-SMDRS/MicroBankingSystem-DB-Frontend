import React, { useState } from 'react';
import api from '../../api/axios';

type Plan = { id: string; name: string };

const CreateAccountForExisting: React.FC<{ customer: any; plans: Plan[]; plansLoading: boolean; plansError: string | null }> = ({ customer, plans, plansLoading, plansError }) => {
  const [balance, setBalance] = useState<number | ''>('');
  const [planId, setPlanId] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ balance?: string; planId?: string }>({});
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // plans come from parent component state (fetched on mount)

  const handleCreate = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const errs: any = {};
    if (!planId) errs.planId = 'Please select a savings plan';
    if (balance === '' || Number(balance) <= 0) errs.balance = 'Please enter a valid initial balance';
    if (Object.keys(errs).length) return setFieldErrors(errs);
    setFieldErrors({});

    setLoadingCreate(true);
    try {
      const payload = { nic: customer.nic, balance: Number(balance), savings_plan_id: planId };
      const res = await api.post('/api/account-management/existing_customer/open_account', payload);
      const acctNo = res.data.account_no || res.data.acc_id || res.data.accId || res.data.acc_no;
      setSuccessMsg(acctNo ? `Account created: ${acctNo}` : 'Account created successfully');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Create failed');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="mt-3">
      {successMsg ? (
        <div className="p-3 bg-green-50 text-green-800 rounded">{successMsg}</div>
      ) : (
        <div className="space-y-3">
          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
          <div>
            <label className="block text-sm text-slate-600 mb-1">Initial Balance (LKR)</label>
            <input type="number" value={balance as any} onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))} className={`p-2 border rounded w-full ${fieldErrors.balance ? 'border-red-500' : ''}`} />
            {fieldErrors.balance && <div className="text-sm text-red-600">{fieldErrors.balance}</div>}
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Savings Plan</label>
            <select value={planId} onChange={e => setPlanId(e.target.value)} className="p-2 border rounded w-full">
              <option value="">{plansLoading ? 'Loading plans...' : 'Select a plan'}</option>
              {plans.map((p: Plan) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {fieldErrors.planId && <div className="text-sm text-red-600">{fieldErrors.planId}</div>}
            {plansError && <div className="text-sm text-red-600 mt-1">{plansError}</div>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCreate} disabled={loadingCreate || plansLoading} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">
              {loadingCreate ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccountForExisting;
