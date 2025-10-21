import api from './axios';

export interface BranchOverviewResponse {
  branch: {
    id: string;
    name: string;
    address: string;
  };
  account_statistics: {
    total_accounts: number;
    active_accounts: number;
    total_balance: number;
    average_balance: number;
  };
  accounts_by_plan: Array<{
    plan_name: string;
    count: number;
    total_balance: number;
  }>;
  daily_transactions: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  transaction_types: Array<{
    type: string;
    count: number;
    total_amount: number;
  }>;
  account_status: Array<{
    status: string;
    count: number;
    total_balance: number;
  }>;
  top_accounts: Array<{
    account_no: string;
    balance: number;
    status: string;
    plan: string;
  }>;
  monthly_trend: Array<{
    year: number;
    month: number;
    transaction_count: number;
    total_amount: number;
  }>;
  weekly_interest: Array<{
    week_start: string;
    total_interest: number;
    count: number;
  }>;
}

export interface CustomerProfile {
  customer_id: string;
  full_name: string;
  nic: string;
  address: string;
  phone_number: string;
  dob: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerAccount {
  acc_id: string;
  account_no: string;
  balance: number;
  status: string;
  opened_date: string;
  branch_name: string;
  branch_id: string;
  savings_plan: string;
}

export interface CustomerTransaction {
  transaction_id: string;
  reference_no: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  account_no: string;
}

export interface CustomerFixedDeposit {
  fd_id: string;
  fd_account_no: string;
  balance: number;
  opened_date: string;
  maturity_date: string;
  status: string;
  linked_savings_account: string;
  duration: number;
  interest_rate: number;
  branch_name: string;
}

export interface CustomerOverviewResponse {
  customer_profile: CustomerProfile;
  accounts: CustomerAccount[];
  transactions: CustomerTransaction[];
  fixed_deposits: CustomerFixedDeposit[];
  summary: {
    total_balance: number;
    total_accounts: number;
    active_accounts: number;
    total_transactions: number;
    total_fd_value: number;
  };
}

export const overviewApi = {
  // Get overview data for user's assigned branch
  getUserBranchOverview: async (): Promise<BranchOverviewResponse> => {
    const response = await api.get('/api/overview/by-users_branch');
    return response.data;
  },

  // Get overview data for a specific branch
  getSelectedBranchOverview: async (branchId: string): Promise<BranchOverviewResponse> => {
    const response = await api.get(`/api/overview/by-branch/${branchId}`);
    return response.data;
  },

  // Get overview data for the entire banking system
  getSystemOverview: async (): Promise<BranchOverviewResponse> => {
    const response = await api.get('/api/overview/system');
    return response.data;
  },

  // Get branch comparison data
  getBranchComparison: async (): Promise<{
    branches: Array<{
      branch_id: string;
      branch_name: string;
      total_accounts: number;
      active_accounts: number;
      total_balance: number;
      total_transactions: number;
      total_interest: number;
    }>;
  }> => {
    const response = await api.get('/api/overview/branch-comparison');
    return response.data;
  },

  // Get customer profile by NIC (first step)
  getCustomerProfileByNIC: async (nic: string): Promise<{
    customer_id: string;
    full_name: string;
    nic: string;
  }> => {
    const response = await api.get(`/customer_data/by-nic/${nic}`);
    return response.data;
  },

  // Get customer complete details by customer ID (second step)
  getCustomerCompleteDetails: async (customerId: string): Promise<CustomerOverviewResponse> => {
    const response = await api.get(`/api/overview/customer/complete-details/${customerId}`);
    return response.data;
  },
};

export default overviewApi;
