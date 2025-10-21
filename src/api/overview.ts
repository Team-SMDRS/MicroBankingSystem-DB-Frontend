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
};

export default overviewApi;
