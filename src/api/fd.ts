import api from './axios';

export interface FDPlan {
  fd_plan_id: string;
  duration: number;
  interest_rate: string;
  min_amount: number;
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

export const updateFDPlanStatus = async (planId: string, status: 'active' | 'inactive'): Promise<FDPlan> => {
  const response = await api.put(`/api/fd/fd-plans/${planId}/status?status=${status}`);
  return response.data;
};

interface CreateFDPlanRequest {
  duration_months: number;
  interest_rate: number;
  min_amount: number;
}

export const createFDPlan = async (data: CreateFDPlanRequest): Promise<{ message: string; fd_plan: FDPlan }> => {
  const response = await api.post(`/api/fd/fd-plans?duration_months=${data.duration_months}&interest_rate=${data.interest_rate}&min_amount=${data.min_amount}`);
  return response.data;
};

export interface CloseFDResponse {
  message: string;
  fd_account_no: string;
  status: string;
  withdrawn_amount: string;
}

export const closeFixedDeposit = async (fdAccountNo: string): Promise<CloseFDResponse> => {
  const response = await api.post(`/api/fd/close-fixed-deposit/${fdAccountNo}`);
  return response.data;
};
