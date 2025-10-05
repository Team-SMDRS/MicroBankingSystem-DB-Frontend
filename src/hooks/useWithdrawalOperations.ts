import { useState } from 'react';
import api from '../api/axios';
import { useAccountOperations } from './useAccountOperations';

interface WithdrawalData {
  amount: number;
  description: string;
  account_no: number;
}

interface TransactionResult {
  success: boolean;
  message: string;
  transaction_id: string;
  reference_no: string;
  timestamp: string;
}

export const useWithdrawalOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const accountOperations = useAccountOperations();

  const submitWithdrawal = async (withdrawalData: WithdrawalData) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      accountOperations.setError('Authentication token not found. Please login again.');
      return false;
    }

    // Validate withdrawal amount against balance
    if (accountOperations.accountDetails && withdrawalData.amount > accountOperations.accountDetails.balance) {
      accountOperations.setError('Insufficient balance for this withdrawal');
      return false;
    }

    accountOperations.setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/transactions/withdraw', withdrawalData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.success) {
        setSuccess(true);
        setTransactionResult(response.data);
        
        // Refresh account details to show updated balance
        await accountOperations.fetchAccountDetails(withdrawalData.account_no.toString());
        
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.response?.status === 401 
        ? 'Authentication failed. Please login again.'
        : err.response?.data?.message || err.message || 'Failed to process withdrawal';
      
      accountOperations.setError(errorMessage);
      console.error('Withdrawal error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWithdrawal = () => {
    setSuccess(false);
    setTransactionResult(null);
    accountOperations.setError(null);
  };

  return {
    ...accountOperations,
    isSubmitting,
    success,
    transactionResult,
    submitWithdrawal,
    resetWithdrawal,
  };
};
