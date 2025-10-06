import api from './axios';

// Types for user management API
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'manager' | 'teller' | 'clerk';
  branch_id?: string;
  branch_name?: string;
  status: 'active' | 'inactive';
  created_date: string;
  last_login?: string;
  permissions: string[];
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'manager' | 'teller' | 'clerk';
  branch_id?: string;
  permissions?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  role?: 'admin' | 'manager' | 'teller' | 'clerk';
  branch_id?: string;
  status?: 'active' | 'inactive';
  permissions?: string[];
}

export interface UserSearchParams {
  username?: string;
  role?: string;
  branch_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: string[];
}

// User management API service
export const userApi = {
  // Get all users
  getAll: async (params: UserSearchParams = {}): Promise<User[]> => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  // Get user by ID
  getById: async (userId: string): Promise<User> => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // Create new user (admin only)
  create: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  // Update user
  update: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  },

  // Activate/Deactivate user
  updateStatus: async (userId: string, status: 'active' | 'inactive'): Promise<User> => {
    const response = await api.patch(`/api/users/${userId}/status`, { status });
    return response.data;
  },

  // Reset user password (admin only)
  resetPassword: async (userId: string): Promise<{ success: boolean; temporary_password: string }> => {
    const response = await api.post(`/api/users/${userId}/reset-password`);
    return response.data;
  },

  // Get user permissions
  getPermissions: async (userId: string): Promise<Permission[]> => {
    const response = await api.get(`/api/users/${userId}/permissions`);
    return response.data;
  },

  // Update user permissions
  updatePermissions: async (userId: string, permissions: string[]): Promise<User> => {
    const response = await api.put(`/api/users/${userId}/permissions`, { permissions });
    return response.data;
  },

  // Get all available permissions
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/api/users/permissions');
    return response.data;
  },

  // Get all roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/api/users/roles');
    return response.data;
  },

  // Search users
  search: async (params: UserSearchParams): Promise<User[]> => {
    const response = await api.get('/api/users/search', { params });
    return response.data;
  }
};

export default userApi;
