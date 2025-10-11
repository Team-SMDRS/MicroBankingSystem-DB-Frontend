import { useState } from 'react';
import { accountApi } from '../../api/accounts';

export interface AccountDetails {
  customer_names: string;
  customer_nics: string;
  customer_phone_numbers: string;
  customer_addresses: string;
  account_id: string;
  account_no?: number;
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

    setIsLoadingAccount(true);
    setError(null);
    setAccountDetails(null);

    try {
      const result = await accountApi.getDetails(parseInt(accountNo));
      
      setAccountDetails(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch account details';
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
