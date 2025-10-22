import api from './axios';

// Types for branch API
export interface BranchDetails {
  branch_id: string;
  branch_name?: string; // API might return this in some endpoints
  name?: string;        // API returns this for branch listing endpoint
  branch_code?: string;
  city?: string;
  address?: string;
  contact_number?: string;
  manager_name?: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
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
  ,
  // Download branch transaction report as PDF
  downloadBranchTransactionReport: async (
    branchId: string,
    params: BranchReportParams
  ): Promise<Blob> => {
    // Backend route: /admin/daily_transactions_by_branch/report/pdf (returns 404 otherwise)
    const response = await api.get(`/api/pdf-reports/admin/daily_transactions_by_branch/report/pdf`, {
      params: { branch_id: branchId, start_date: params.start_date, end_date: params.end_date },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default branchApi;
