import api from './axios';

// Types for branch API
export interface BranchDetails {
  branch_id: string;
  branch_name: string;
  branch_code?: string;
  city?: string;
  address?: string;
  contact_number?: string;
  manager_name?: string;
}

export interface BranchTransactionReport {
  branch_id: string;
  branch_name: string;
  total_deposits: number;
  total_withdrawals: number;
  total_transfers: number;
  transaction_count: number;
  net_amount: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
  all_accounts?: Array<{
    acc_id: string;
    acc_holder_name: string;
    transaction_count: number;
    total_volume: number;
  }>;
}

export interface BranchReportParams {
  start_date: string;
  end_date: string;
  transaction_type?: string;
}

// Branch API service
export const branchApi = {
  // Get all branches
  getAll: async (): Promise<BranchDetails[]> => {
    const response = await api.get('/api/branch/branches');
    return response.data;
  },

  // Get branch by ID
  getById: async (branchId: string): Promise<BranchDetails> => {
    const response = await api.get(`/api/branch/branches/${branchId}`);
    return response.data[0]; // API returns array
  },

  // Get branch by name
  getByName: async (branchName: string): Promise<BranchDetails[]> => {
    const response = await api.get(`/api/branch/branches/name/${branchName}`);
    return response.data;
  },

  // Get branch transaction report
  getBranchTransactionReport: async (
    branchId: string,
    params: BranchReportParams
  ): Promise<BranchTransactionReport> => {
    const response = await api.post(
      `/api/transactions/report/branch/${branchId}`,
      null,
      { params }
    );
    return response.data;
  }
};

export default branchApi;
