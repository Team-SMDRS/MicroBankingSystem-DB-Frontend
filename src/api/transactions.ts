import api from './axios';

// Types for transaction API
export interface WithdrawalRequest {
  amount: number;
  description: string;
  account_no: number;
}

export interface DepositRequest {
  amount: number;
  description: string;
  account_no: number;
}

export interface BankTransferRequest {
  from_account_no: number;
  to_account_no: number;
  amount: number;
  description: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  reference_no: string;
  timestamp: string;
  balance?: number;
}

export interface TransactionHistoryParams {
  account_no?: number;
  from_date?: string;
  to_date?: string;
  transaction_type?: 'withdrawal' | 'deposit' | 'transfer';
  limit?: number;
  offset?: number;
}

export interface Transaction {
  transaction_id: string;
  account_no: number;
  transaction_type: string;
  amount: number;
  description: string;
  timestamp: string;
  reference_no: string;
  status: string;
}

// Transaction API service
export const transactionApi = {
  // Process withdrawal
  withdrawal: async (data: WithdrawalRequest): Promise<TransactionResponse> => {
    const response = await api.post('/api/transactions/withdraw', data);
    return response.data;
  },

  // Process deposit
  deposit: async (data: DepositRequest): Promise<TransactionResponse> => {
    const response = await api.post('/api/transactions/deposit', data);
    return response.data;
  },

  // Process bank transfer
  transfer: async (data: BankTransferRequest): Promise<TransactionResponse> => {
    const response = await api.post('/api/transactions/transfer', data);
    return response.data;
  },

  // Get transaction history
  getHistory: async (params: TransactionHistoryParams = {}): Promise<Transaction[]> => {
    const response = await api.get('/api/transactions/history', { params });
    return response.data;
  },

  // Get transaction by ID
  getById: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get(`/api/transactions/${transactionId}`);
    return response.data;
  },

  // Get account transaction summary
  getSummary: async (accountNo: number, period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
    const response = await api.get(`/api/transactions/summary/${accountNo}`, {
      params: { period }
    });
    return response.data;
  },

  // Reverse/cancel transaction (if supported)
  reverse: async (transactionId: string, reason: string): Promise<TransactionResponse> => {
    const response = await api.post(`/api/transactions/${transactionId}/reverse`, { reason });
    return response.data;
  }
};

export default transactionApi;
