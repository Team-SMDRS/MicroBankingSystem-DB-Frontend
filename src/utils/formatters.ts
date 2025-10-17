/**
 * Utility functions for formatting data
 */

/**
 * Format transaction type for display
 * Handles both backend format (BankTransfer-In) and display format
 */
export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'Deposit': 'Deposit',
    'Withdrawal': 'Withdrawal',
    'Interest': 'Interest',
    'BankTransfer': 'Bank Transfer',
    'BankTransfer-In': 'Bank Transfer (Incoming)',
    'BankTransfer-Out': 'Bank Transfer (Outgoing)',
    'deposit': 'Deposit',
    'withdrawal': 'Withdrawal',
    'transfer': 'Bank Transfer',
  };

  return typeMap[type] || type;
};

/**
 * Get transaction type badge color
 */
export const getTransactionTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'Deposit': 'bg-[#38B000] bg-opacity-10 text-[#38B000]',
    'deposit': 'bg-[#38B000] bg-opacity-10 text-[#38B000]',
    'BankTransfer-In': 'bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F]',
    'Withdrawal': 'bg-[#E63946] bg-opacity-10 text-[#E63946]',
    'withdrawal': 'bg-[#E63946] bg-opacity-10 text-[#E63946]',
    'BankTransfer-Out': 'bg-[#E9C46A] bg-opacity-10 text-[#E9C46A]',
    'Interest': 'bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F]',
    'BankTransfer': 'bg-[#264653] bg-opacity-10 text-[#264653]',
    'transfer': 'bg-[#264653] bg-opacity-10 text-[#264653]',
  };

  return colorMap[type] || 'bg-[#6C757D] bg-opacity-10 text-[#6C757D]';
};

/**
 * Format amount to LKR currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

/**
 * Format datetime to readable format
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};