import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { authApi } from '../../../api/auth';
import type { User } from './types';

interface Transaction {
  transaction_id: string;
  amount: number;
  acc_id: string;
  type: string;
  description: string;
  created_at: string;
  created_by: string;
  reference_no: number;
}

interface UserTransactionsDisplayProps {
  user: User;
}

const UserTransactionsDisplay: React.FC<UserTransactionsDisplayProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call the API to get user transactions
        const response = await authApi.getUserTransactionsByUserId(user.user_id);
        const fetchedTransactions = response.transactions || [];
        
        // Sort transactions by date in descending order (latest first)
        const sortedTransactions = fetchedTransactions.sort((a: Transaction, b: Transaction) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setTransactions(sortedTransactions);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.response?.data?.detail || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user.user_id]);

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'Deposit' || type === 'Interest') {
      return <ArrowDownLeft size={16} className="text-emerald-600" />;
    } else if (type === 'Withdrawal' || type === 'BankTransfer' || type === 'BankTransfer-Out') {
      return <ArrowUpRight size={16} className="text-red-600" />;
    } else if (type === 'BankTransfer-In') {
      return <ArrowDownLeft size={16} className="text-emerald-600" />;
    }
    return <ArrowUpRight size={16} className="text-gray-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'Deposit' || type === 'Interest') {
      return 'bg-emerald-50 hover:bg-emerald-100';
    } else if (type === 'Withdrawal' || type === 'BankTransfer' || type === 'BankTransfer-Out') {
      return 'bg-red-50 hover:bg-red-100';
    } else if (type === 'BankTransfer-In') {
      return 'bg-emerald-50 hover:bg-emerald-100';
    }
    return 'bg-gray-50 hover:bg-gray-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-6">
        <h3 className="text-lg font-semibold text-primary mb-6">Transaction History</h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-6">
        <h3 className="text-lg font-semibold text-primary mb-6">Transaction History</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-borderLight p-6">
        <h3 className="text-lg font-semibold text-primary mb-6">Transaction History</h3>
        <div className="text-center py-12">
          <p className="text-textSecondary text-lg">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-borderLight overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-background border-b border-borderLight">
        <h3 className="text-lg leading-6 font-semibold text-primary">Transaction History</h3>
        <p className="mt-1 max-w-2xl text-sm text-textSecondary">Recent transactions for this user.</p>
      </div>
      
      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderLight bg-background">
              <th className="px-6 py-3 text-left text-sm font-semibold text-textSecondary">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-textSecondary">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-textSecondary">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-textSecondary">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-textSecondary">Reference No</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.transaction_id} className={`border-b border-borderLight transition-colors ${getTransactionColor(transaction.type)}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-sm font-medium text-primary">{transaction.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'Deposit' || transaction.type === 'Interest' || transaction.type === 'BankTransfer-In'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'Deposit' || transaction.type === 'Interest' || transaction.type === 'BankTransfer-In' ? '+' : '-'}
                    Rs. {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-primary">{transaction.description}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-textSecondary">
                    {new Date(transaction.created_at).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-primary">{transaction.reference_no}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-borderLight flex justify-between items-center">
          <div className="text-sm text-textSecondary">
            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-background text-primary hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-secondary text-white'
                      : 'bg-background text-primary hover:bg-secondary hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-background text-primary hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTransactionsDisplay;
