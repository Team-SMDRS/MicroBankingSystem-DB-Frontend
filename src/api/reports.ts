import api from './axios';

// Types for reports API
export interface ReportParams {
  from_date?: string;
  to_date?: string;
  branch_id?: string;
  account_type?: string;
  format?: 'json' | 'csv' | 'pdf';
}

export type TransactionType = 
  | 'Deposit' 
  | 'Withdrawal' 
  | 'Interest' 
  | 'BankTransfer' 
  | 'BankTransfer-In' 
  | 'BankTransfer-Out';

export interface TransactionReport {
  transaction_id: string;
  account_no: number;
  customer_name: string;
  transaction_type: TransactionType | string;
  amount: number;
  description: string;
  timestamp: string;
  branch_name: string;
}

export interface AccountSummaryReport {
  account_no: number;
  customer_name: string;
  account_type: string;
  balance: number;
  status: string;
  branch_name: string;
  last_transaction_date?: string;
}

export interface BranchSummaryReport {
  branch_id: string;
  branch_name: string;
  total_accounts: number;
  total_deposits: number;
  total_withdrawals: number;
  total_balance: number;
  active_accounts: number;
}

export interface DailyTransactionSummary {
  date: string;
  total_transactions: number;
  total_deposits: number;
  total_withdrawals: number;
  total_transfers: number;
  net_amount: number;
}

export interface CustomerReport {
  customer_nic: string;
  customer_name: string;
  phone: string;
  address: string;
  accounts: Array<{
    account_no: number;
    account_type: string;
    balance: number;
    status: string;
  }>;
  total_balance: number;
}

// Reports API service
export const reportsApi = {
  // Transaction reports
  getTransactionReport: async (params: ReportParams): Promise<TransactionReport[]> => {
    const response = await api.get('/api/reports/transactions', { params });
    return response.data;
  },

  // Account summary report
  getAccountSummary: async (params: ReportParams): Promise<AccountSummaryReport[]> => {
    const response = await api.get('/api/reports/accounts/summary', { params });
    return response.data;
  },

  // Branch summary report
  getBranchSummary: async (params: ReportParams): Promise<BranchSummaryReport[]> => {
    const response = await api.get('/api/reports/branches/summary', { params });
    return response.data;
  },

  // Daily transaction summary
  getDailyTransactionSummary: async (params: ReportParams): Promise<DailyTransactionSummary[]> => {
    const response = await api.get('/api/reports/transactions/daily-summary', { params });
    return response.data;
  },

  // Customer report
  getCustomerReport: async (customerNic?: string, params: ReportParams = {}): Promise<CustomerReport[]> => {
    const endpoint = customerNic 
      ? `/api/reports/customers/${customerNic}` 
      : '/api/reports/customers';
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  // Financial summary
  getFinancialSummary: async (params: ReportParams) => {
    const response = await api.get('/api/reports/financial-summary', { params });
    return response.data;
  },

  // Audit trail report
  getAuditTrail: async (params: ReportParams & { user_id?: string; action_type?: string }) => {
    const response = await api.get('/api/reports/audit-trail', { params });
    return response.data;
  },

  // Balance sheet report
  getBalanceSheet: async (params: ReportParams) => {
    const response = await api.get('/api/reports/balance-sheet', { params });
    return response.data;
  },

  // Export report (download file)
  exportReport: async (
    reportType: 'transactions' | 'accounts' | 'branches' | 'customers',
    params: ReportParams
  ): Promise<Blob> => {
    const response = await api.get(`/api/reports/${reportType}/export`, {
      params: { ...params, format: params.format || 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  // Get report templates
  getReportTemplates: async (): Promise<Array<{ id: string; name: string; description: string }>> => {
    const response = await api.get('/api/reports/templates');
    return response.data;
  },

  // Generate custom report
  generateCustomReport: async (templateId: string, params: ReportParams) => {
    const response = await api.post(`/api/reports/custom/${templateId}`, params);
    return response.data;
  }
};

export default reportsApi;
