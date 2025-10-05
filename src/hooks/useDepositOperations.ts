import { useState } from 'react';
import api from '../api/axios';
import { useAccountOperations } from './useAccountOperations';

interface DepositData {
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

export const useDepositOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const accountOperations = useAccountOperations();

  const submitDeposit = async (depositData: DepositData) => {
    accountOperations.setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/transactions/deposit', depositData);

      if (response.data && response.data.success) {
        setSuccess(true);
        setTransactionResult(response.data);
        
        // Refresh account details to show updated balance
        await accountOperations.fetchAccountDetails(depositData.account_no.toString());
        
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to process deposit';
      accountOperations.setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDeposit = () => {
    setSuccess(false);
    setTransactionResult(null);
    accountOperations.setError(null);
  };

  return {
    ...accountOperations,
    isSubmitting,
    success,
    transactionResult,
    submitDeposit,
    resetDeposit,
  };
};
