import api from './axios';

// Types for authentication API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    email?: string;
    role: string;
    branch_id?: string;
    permissions: string[];
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'manager' | 'teller' | 'clerk';
  branch_id?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  username: string;
  email: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Authentication API service
export const authApi = {
  // User login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // User registration (admin only)
  register: async (userData: RegisterRequest): Promise<{ success: boolean; message: string; user: any }> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // User logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/change-password', data);
    return response.data;
  },

  // Reset password request
  resetPassword: async (data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/reset-password', data);
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; user?: any }> => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<LoginResponse['user']> => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: { email?: string; phone?: string }): Promise<LoginResponse['user']> => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  // Get user data (profile info)
  getUserData: async (): Promise<any> => {
    const response = await api.get('/api/auth/user_data');
    return response.data;
  },

  // Get user transactions history
  getUserTransactions: async (): Promise<any> => {
    const response = await api.get('/api/auth/user/transactions_history');
    return response.data;
  },

  // Update password
  updatePassword: async (data: { old_password: string; new_password: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/update_password', data);
    return response.data;
  },

  // Get today's transactions
  getTodayTransactions: async (): Promise<any> => {
    const response = await api.get('/api/auth/user/today_transactions');
    return response.data;
  },

  // Get transactions by date range
  getTransactionsByDateRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get('/api/auth/user/transactions_by_date_range', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Get user's branch information
  getUserBranch: async (userId: string): Promise<{
    user_id: string;
    branch_id: string;
    branch_name: string;
  }> => {
    const response = await api.get(`/api/auth/user/branch/${userId}`);
    return response.data;
  },

  // Assign a branch to a user
  assignBranchToUser: async (userId: string, branchId: string): Promise<{
    success: boolean;
    message: string;
    user_id: string;
    branch_id: string;
    branch_name: string;
  }> => {
    const response = await api.put('/api/auth/user/assign-branch', {
      user_id: userId,
      branch_id: branchId
    });
    return response.data;
  },

  // Download today's transaction report as PDF
  downloadTodayTransactionReport: async (): Promise<Blob> => {
    const response = await api.get('/api/pdf-reports/users/transaction/today_report', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download all transactions report as PDF
  downloadAllTransactionsReport: async (): Promise<Blob> => {
    const response = await api.get('/api/pdf-reports/users/report/pdf', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download user transactions report by date range as PDF
  downloadTransactionsReportByDateRange: async (startDate: string, endDate: string): Promise<Blob> => {
    const response = await api.get('/api/pdf-reports/users/daily_branch_transactions/report/pdf', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob'
    });
    return response.data;
  },

};

export default authApi;
