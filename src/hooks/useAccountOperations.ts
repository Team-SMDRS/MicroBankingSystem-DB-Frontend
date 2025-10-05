import { useState } from 'react';
import api from '../api/axios';

export interface AccountDetails {
  customer_names: string;
  customer_nics: string;
  customer_phone_numbers: string;
  customer_addresses: string;
  account_id: string;
  branch_name: string;
  branch_id: string;
  balance: number;
  status: string;
  account_type: string;
}

export const useAccountOperations = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountDetails = async (accountNo: string) => {
    if (!accountNo.trim()) {
      setError('Please enter an account number');
      return null;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError('Authentication token not found. Please login again.');
      return null;
    }

    setIsLoadingAccount(true);
    setError(null);
    setAccountDetails(null);

    try {
      const response = await api.get(`/api/account-management/account/details/${accountNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setAccountDetails(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.status === 401 
        ? 'Authentication failed. Please login again.'
        : err.response?.data?.message || err.message || 'Failed to fetch account details';
      
      setError(errorMessage);
      console.error('Account details fetch error:', err);
      return null;
    } finally {
      setIsLoadingAccount(false);
    }
  };

  const clearAccountDetails = () => {
    setAccountDetails(null);
    setError(null);
  };

  const checkAuthToken = () => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token starts with:', token.substring(0, 20) + '...');
    }
  };

  return {
    accountDetails,
    isLoadingAccount,
    error,
    setError,
    fetchAccountDetails,
    clearAccountDetails,
    checkAuthToken,
  };
};
