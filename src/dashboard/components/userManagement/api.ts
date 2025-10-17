import api from '../../../api/axios';
import type { User, UserStatus } from './types';

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/api/auth/api/all_users');
  return response.data.users;
};

export const fetchUserStatus = async (userId: string): Promise<UserStatus> => {
  if (!userId) throw new Error('User ID is required');
  
  const response = await api.get(`/api/auth/user/status/${userId}`);
  return response.data;
};

export const activateUser = async (userId: string): Promise<UserStatus> => {
  if (!userId) throw new Error('User ID is required');
  
  await api.put('/api/auth/user/activate', { user_id: userId });
  return await fetchUserStatus(userId);
};

export const deactivateUser = async (userId: string): Promise<UserStatus> => {
  if (!userId) throw new Error('User ID is required');
  
  await api.put('/api/auth/user/deactivate', { user_id: userId });
  return await fetchUserStatus(userId);
};

export const resetUserPassword = async (username: string, newPassword: string): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!username) throw new Error('Username is required');
  
  try {
    await api.post('/api/auth/users_password_reset', {
      username: username,
      new_password: newPassword
    });
    
    return { success: true, message: "Password reset successfully" };
  } catch (err: any) {
    console.error(`Error resetting password for user ${username}:`, err);
    return { 
      success: false, 
      message: err.response?.data?.detail || 'Failed to reset password' 
    };
  }
};