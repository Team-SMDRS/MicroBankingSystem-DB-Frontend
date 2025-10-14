import api from './axios';

interface FixedDeposit {
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

interface SavingsAccount {
  acc_id: string;
  account_no: number;
  balance: number;
  opened_date: string;
  status: string;
  branch_name: string;
}

// Get Fixed Deposit details by FD account number
export const getFixedDeposit = async (fdAccountNo: number): Promise<FixedDeposit> => {
  const response = await api.get(`/api/fd/fixed-deposits/account/${fdAccountNo}`);
  return response.data;
};

// Get Savings Account details linked to a Fixed Deposit
export const getFDSavingsAccount = async (fdAccountNo: number): Promise<SavingsAccount> => {
  const response = await api.get(`/api/fd/fixed-deposits/${fdAccountNo}/savings-account`);
  return response.data;
};

// Get Fixed Deposits linked to a Savings Account
export const getSavingsAccountFDs = async (fdAccountNo: number): Promise<FixedDeposit[]> => {
  const response = await api.get(`/api/fd/fixed-deposits/savings/${fdAccountNo}`);
  return response.data;
};

interface OpenFixedDepositRequest {
  savingsAccountNo: number;
  amount: string;
  planDuration: number;  // in months
}

interface OpenFixedDepositResponse {
  fd_account_no: number;
  message: string;
}

// Open a new Fixed Deposit
export const openFixedDeposit = async (data: OpenFixedDepositRequest): Promise<OpenFixedDepositResponse> => {
  const response = await api.post('/api/fd/fixed-deposits/open', data);
  return response.data;
};

// Get Matured Fixed Deposits for a user
export const getMaturedFixedDeposits = async (): Promise<FixedDeposit[]> => {
  const response = await api.get('/api/fd/fixed-deposits/matured');
  return response.data;
};

// Get Matured Fixed Deposits for a specific savings account
export const getMaturedFixedDepositsForAccount = async (savingsAccountNo: number): Promise<FixedDeposit[]> => {
  const response = await api.get(`/api/fd/fixed-deposits/matured/${savingsAccountNo}`);
  return response.data;
};

// Utility functions to format dates and amounts
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR'
  }).format(numAmount);
};
