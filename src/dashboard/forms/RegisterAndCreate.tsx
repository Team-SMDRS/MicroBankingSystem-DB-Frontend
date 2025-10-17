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
    <div className="space-y-6">
      {errorMsg && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{errorMsg}</div>}
      {successData ? (
        <div className="p-5 bg-[#38B000] bg-opacity-10 border border-[#38B000] rounded-lg shadow-sm">
          <div className="font-semibold text-[#264653] text-lg mb-3">Customer & Account Created</div>
          <div className="mt-2 text-[#264653]">Username: <span className="font-mono font-medium">{successData.username}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.username)} className="ml-2 text-xs px-3 py-1 bg-[#F8F9FA] hover:bg-gray-200 rounded-md transition-colors shadow-sm border border-[#E9ECEF]">Copy</button>
          </div>
          <div className="text-[#264653] mt-2">Password: <span className="font-mono font-medium">{successData.password}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.password)} className="ml-2 text-xs px-3 py-1 bg-[#F8F9FA] hover:bg-gray-200 rounded-md transition-colors shadow-sm border border-[#E9ECEF]">Copy</button>
          </div>
          <div className="text-[#264653] mt-2">Account No: <span className="font-mono font-medium">{successData.account_no || successData.acc_no || successData.accId}</span>
            <button onClick={() => navigator.clipboard.writeText(successData.account_no || successData.acc_no || successData.accId)} className="ml-2 text-xs px-3 py-1 bg-[#F8F9FA] hover:bg-gray-200 rounded-md transition-colors shadow-sm border border-[#E9ECEF]">Copy</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Full Name</label>
            <input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className={`w-full px-4 py-2 border ${fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]`} 
            />
            {fieldErrors.fullName && <div className="text-sm text-red-600 mt-2">{fieldErrors.fullName}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">NIC</label>
            <input 
              value={nicVal} 
              onChange={e => setNicVal(e.target.value)} 
              className={`w-full px-4 py-2 border ${fieldErrors.nicVal ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]`} 
            />
            {fieldErrors.nicVal && <div className="text-sm text-red-600 mt-2">{fieldErrors.nicVal}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={e => setDob(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Phone Number</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Address</label>
            <input 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Initial Balance (LKR)</label>
            <input 
              type="number" 
              value={balance as any} 
              onChange={e => setBalance(e.target.value === '' ? '' : Number(e.target.value))} 
              className={`w-full px-4 py-2 border ${fieldErrors.balance ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]`} 
            />
            {fieldErrors.balance && <div className="text-sm text-red-600 mt-2">{fieldErrors.balance}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6C757D] mb-2">Savings Plan</label>
            <select 
              value={planId} 
              onChange={e => setPlanId(e.target.value)} 
              className={`w-full px-4 py-2 border ${fieldErrors.planId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F] bg-white`}
            >
              <option value="">{plansLoading ? 'Loading plans...' : 'Select a plan'}</option>
              {plans.map((p: Plan) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {fieldErrors.planId && <div className="text-sm text-red-600 mt-2">{fieldErrors.planId}</div>}
            {plansError && <div className="text-sm text-red-600 mt-2">{plansError}</div>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={handleRegisterAndCreate} 
              disabled={loadingCreate || plansLoading} 
              className="px-5 py-2 bg-[#38B000] hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none"
            >
              {loadingCreate ? 'Creating...' : 'Register & Create Account'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterAndCreate;
