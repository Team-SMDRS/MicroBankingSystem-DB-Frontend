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
    'Deposit': 'bg-green-100 text-green-800',
    'deposit': 'bg-green-100 text-green-800',
    'BankTransfer-In': 'bg-green-100 text-green-800',
    'Withdrawal': 'bg-red-100 text-red-800',
    'withdrawal': 'bg-red-100 text-red-800',
    'BankTransfer-Out': 'bg-red-100 text-red-800',
    'Interest': 'bg-blue-100 text-blue-800',
    'BankTransfer': 'bg-purple-100 text-purple-800',
    'transfer': 'bg-purple-100 text-purple-800',
  };

  return colorMap[type] || 'bg-gray-100 text-gray-800';
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