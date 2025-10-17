import api from './axios';

export interface FDPlan {
  fd_plan_id: string;
  duration: number;
  interest_rate: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface FixedDeposit {
  fd_id: string;
  fd_account_no: number;
  balance: string;
  acc_id: string;
  opened_date: string;
  maturity_date: string;
  fd_plan_id: string;
  fd_created_at: string;
  fd_updated_at: string;
  account_no: number;
  branch_name: string;
  plan_duration: number;
  plan_interest_rate: string;
}

interface OpenFixedDepositRequest {
  savings_account_no: string;
  amount: number;
  plan_id: string;
}

export const getFDPlans = async (): Promise<FDPlan[]> => {
  const response = await api.get('/api/fd/fd-plans');
  return response.data;
};

export const openFixedDeposit = async (data: OpenFixedDepositRequest): Promise<FixedDeposit> => {
  const response = await api.post('/api/fd/fixed-deposits', data);
  return response.data;
};
