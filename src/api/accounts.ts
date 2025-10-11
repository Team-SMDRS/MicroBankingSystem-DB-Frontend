import api from './axios';

// Types for account API
export interface AccountDetails {
  customer_names: string;
  customer_nics: string;
  customer_phone_numbers: string;
  customer_addresses: string;
  account_id: string;
  account_no: number;
  branch_name: string;
  branch_id: string;
  balance: number;
  status: string;
  account_type: string;
  created_date: string;
  last_transaction_date?: string;
}

export interface CreateAccountRequest {
  customer_name: string;
  customer_nic: string;
  customer_phone: string;
  customer_address: string;
  account_type: 'savings' | 'current' | 'fixed_deposit' | 'loan' | 'business';
  branch_id: string;
  initial_deposit: number;
}

export interface UpdateAccountRequest {
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  status?: 'active' | 'inactive' | 'closed';
}

export interface AccountSearchParams {
  account_no?: number;
  customer_name?: string;
  customer_nic?: string;
  account_type?: string;
  branch_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface AccountBalance {
  account_no: number;
  balance: number;
  available_balance: number;
  last_updated: string;
}

// Account API service
export const accountApi = {
  // Get all accounts by NIC
  getAccountsByNic: async (nic: string): Promise<any[]> => {
    const response = await api.get(`/api/account-management/accounts/by-nic/${nic}`);
    return response.data;
  },
  // Get account details by account number
  getDetails: async (accountNo: number): Promise<AccountDetails> => {
    const response = await api.get(`/api/account-management/account/details/${accountNo}`);
    return response.data;
  },

  // Get account details by NIC
  getDetailsByNic: async (nic: string): Promise<AccountDetails> => {
    const response = await api.get(`/api/account-management/account/details/${nic}`);
    return response.data;
  },

  // Get account balance
  getBalance: async (accountNo: number): Promise<AccountBalance> => {
    const response = await api.get(`/api/account-management/account/balance/${accountNo}`);
    return response.data;
  },

  // Create new account
  create: async (data: CreateAccountRequest): Promise<AccountDetails> => {
    const response = await api.post('/api/account-management/account/create', data);
    return response.data;
  },

  // Update account information
  update: async (accountNo: number, data: UpdateAccountRequest): Promise<AccountDetails> => {
    const response = await api.put(`/api/account-management/account/${accountNo}`, data);
    return response.data;
  },

  // Search accounts
  search: async (params: AccountSearchParams): Promise<AccountDetails[]> => {
    const response = await api.get('/api/account-management/accounts/search', { params });
    return response.data;
  },

  // Get all accounts (with pagination)
  getAll: async (limit = 50, offset = 0): Promise<AccountDetails[]> => {
    const response = await api.get('/api/account-management/accounts', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Close account
  close: async (accountNo: number, reason: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/api/account-management/account/${accountNo}/close`, { reason });
    return response.data;
  },

  // Activate/Deactivate account
  updateStatus: async (accountNo: number, status: 'active' | 'inactive'): Promise<AccountDetails> => {
    const response = await api.patch(`/api/account-management/account/${accountNo}/status`, { status });
    return response.data;
  },

  // Get account types
  getAccountTypes: async (): Promise<Array<{ type: string; name: string; description: string }>> => {
    const response = await api.get('/api/account-management/account-types');
    return response.data;
  }
};

export default accountApi;
