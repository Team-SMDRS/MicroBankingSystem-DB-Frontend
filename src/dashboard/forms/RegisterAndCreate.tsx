import React, { useState } from 'react';
import api from '../../api/axios';

type Plan = { id: string; name: string };

const RegisterAndCreate: React.FC<{ defaultNic?: string; plans: Plan[]; plansLoading: boolean; plansError: string | null }> = ({ defaultNic = '', plans, plansLoading, plansError }) => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [nicVal, setNicVal] = useState(defaultNic);
  const [dob, setDob] = useState('');
  const [balance, setBalance] = useState<number | ''>('');
  const [planId, setPlanId] = useState('');
  const status = 'active';

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; nicVal?: string; balance?: string; planId?: string }>({});

  // plans come from parent component state (fetched on mount)

  const handleRegisterAndCreate = async () => {
    setErrorMsg(null);
    setSuccessData(null);
    const errs: any = {};
    if (!fullName) errs.fullName = 'Please enter full name';
    if (!nicVal) errs.nicVal = 'Please enter NIC';
    if (!planId) errs.planId = 'Please select a savings plan';
    if (balance === '' || Number(balance) <= 0) errs.balance = 'Please enter a valid initial balance';
    if (Object.keys(errs).length) return setFieldErrors(errs);
    setFieldErrors({});

    setLoadingCreate(true);
    try {
      const payload = {
        full_name: fullName,
        address,
        phone_number: phone,
        nic: nicVal,
        dob,
        balance: Number(balance),
        savings_plan_id: planId,
        status,
      };
      const res = await api.post('/api/account-management/register_customer_with_account', payload);
      // Expecting response to include username, password, account_no
      setSuccessData(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-2xl shadow-md border border-borderLight p-6 animate-slide-in-right">
      {errorMsg && <div className="text-red-600 p-4 bg-red-50 border border-red-200 rounded-2xl">{errorMsg}</div>}
      {successData ? (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="font-semibold text-emerald-800 mb-4">Customer & Account Created</div>
          <div className="mt-3 text-sm text-textSecondary">Username: <span className="font-mono bg-background px-2 py-1 rounded text-primary">{successData.username}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.username)} className="ml-2 text-xs px-2 py-1 bg-secondary text-white rounded">Copy</button>
          </div>
          <div className="text-sm text-textSecondary mt-2">Password: <span className="font-mono bg-background px-2 py-1 rounded text-primary">{successData.password}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.password)} className="ml-2 text-xs px-2 py-1 bg-secondary text-white rounded">Copy</button>
          </div>
          <div className="text-sm text-textSecondary mt-2">Account No: <span className="font-mono bg-background px-2 py-1 rounded text-primary">{successData.account_no || successData.acc_no || successData.accId}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.account_no || successData.acc_no || successData.accId)} className="ml-2 text-xs px-2 py-1 bg-secondary text-white rounded">Copy</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="label-text">Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className={`input-field w-full ${fieldErrors.fullName ? 'border-red-500' : ''}`} />
            {fieldErrors.fullName && <div className="text-sm text-red-600 mt-1">{fieldErrors.fullName}</div>}
          </div>

          <div>
            <label className="label-text">NIC</label>
            <input value={nicVal} onChange={e => setNicVal(e.target.value)} className={`input-field w-full ${fieldErrors.nicVal ? 'border-red-500' : ''}`} />
            {fieldErrors.nicVal && <div className="text-sm text-red-600 mt-1">{fieldErrors.nicVal}</div>}
          </div>

          <div>
            <label className="label-text">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="input-field w-full" />
          </div>

          <div>
            <label className="label-text">Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field w-full" />
          </div>

          <div>
            <label className="label-text">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="input-field w-full" />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Initial Balance (LKR)</label>
            <input type="number" value={balance as any} onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))} className={`p-2 border rounded w-full ${fieldErrors.balance ? 'border-red-500' : ''}`} />
            {fieldErrors.balance && <div className="text-sm text-red-600">{fieldErrors.balance}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Savings Plan</label>
            <select value={planId} onChange={e => setPlanId(e.target.value)} className={`p-2 border rounded w-full ${fieldErrors.planId ? 'border-red-500' : ''}`}>
              <option value="">{plansLoading ? 'Loading plans...' : 'Select a plan'}</option>
              {plans.map((p: Plan) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {fieldErrors.planId && <div className="text-sm text-red-600">{fieldErrors.planId}</div>}
            {plansError && <div className="text-sm text-red-600 mt-1">{plansError}</div>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleRegisterAndCreate} disabled={loadingCreate || plansLoading} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">
              {loadingCreate ? 'Creating...' : 'Register & Create Account'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterAndCreate;
