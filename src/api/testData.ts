import type { Customer, SavingsAccount, FixedDeposit, Transaction } from '../types';

// Let's assume our logged-in agent is AGENT01 for this example
export const mockCustomers: Customer[] = [
  // Customers assigned to our agent (AGENT01)
  { customerId: 'CUST001', name: 'Nimali Perera', nic: '199012345V', address: 'Kandy', assignedAgentId: 'AGENT01', isJoint: false, registrationDate: '2025-08-15T00:00:00Z' },
  { customerId: 'CUST002', name: 'Sunil Jayasuriya', nic: '198554321V', address: 'Galle', assignedAgentId: 'AGENT01', isJoint: false, registrationDate: '2025-07-20T00:00:00Z' },
  { customerId: 'CUST003', name: 'Kamala Silva', nic: '199298765V', address: 'Matara', assignedAgentId: 'AGENT01', isJoint: false, registrationDate: '2025-09-01T00:00:00Z' },
  
  
  // Customers assigned to another agent (AGENT02)
  { customerId: 'CUST004', name: 'Fathima Rizwan', nic: '198811223V', address: 'Colombo', assignedAgentId: 'AGENT02', isJoint: false, registrationDate: '2025-08-15T00:00:00Z'},
  { customerId: 'CUST005', name: 'David Costa', nic: '197512399V', address: 'Negombo', assignedAgentId: 'AGENT02', isJoint: false, registrationDate: '2025-07-20T00:00:00Z' },

  // Unassigned or assigned to other agents
  { customerId: 'CUST006', name: 'Lakshmi Kumar', nic: '200512345V', address: 'Jaffna', assignedAgentId: 'AGENT03', isJoint: false, registrationDate: '2025-08-15T00:00:00Z' },
  { customerId: 'CUST007', name: 'Ravi Fernando', nic: '196012345V', address: 'Kandy', assignedAgentId: 'AGENT01', isJoint: false, registrationDate: '2025-07-20T00:00:00Z' },
];

export const mockSavingsAccounts: SavingsAccount[] = [
  { accountId: 'SA001', customerId: 'CUST001', planName: 'Adult', balance: 75500, interestRate: 10, minBalance: 1000, status: 'Active' },
  { accountId: 'SA008', customerId: 'CUST001', planName: 'Senior', balance: 150000, interestRate: 13, minBalance: 1000, status: 'Active' },
  { accountId: 'SA002', customerId: 'CUST002', planName: 'Adult', balance: 120000, interestRate: 10, minBalance: 1000, status: 'Active' },
  { accountId: 'SA003', customerId: 'CUST003', planName: 'Teen', balance: 15000, interestRate: 11, minBalance: 500, status: 'Active' },
  { accountId: 'SA004', customerId: 'CUST004', planName: 'Senior', balance: 250000, interestRate: 13, minBalance: 1000, status: 'Active' },
  { accountId: 'SA009', customerId: 'CUST004', planName: 'Senior', balance: 250000, interestRate: 13, minBalance: 1000, status: 'Active' },
  { accountId: 'SA005', customerId: 'CUST005', planName: 'Joint', balance: 500000, interestRate: 7, minBalance: 5000, status: 'Active' },
  { accountId: 'SA006', customerId: 'CUST006', planName: 'Children', balance: 5000, interestRate: 12, minBalance: 0, status: 'Active' },
  { accountId: 'SA007', customerId: 'CUST007', planName: 'Senior', balance: 80000, interestRate: 13, minBalance: 1000, status: 'Active' },
];

export const mockFixedDeposits: FixedDeposit[] = [
  { fdId: 'FD001', linkedAccountId: 'SA002', principal: 100000, interestRate: 14, term: 12, startDate: '2024-09-01T00:00:00Z', nextPayoutDate: '2025-10-01T00:00:00Z' },
  { fdId: 'FD002', linkedAccountId: 'SA004', principal: 200000, interestRate: 15, term: 36, startDate: '2023-01-15T00:00:00Z', nextPayoutDate: '2025-09-15T00:00:00Z' },
  { fdId: 'FD003', linkedAccountId: 'SA007', principal: 50000, interestRate: 13, term: 6, startDate: '2025-06-10T00:00:00Z', nextPayoutDate: '2025-12-10T00:00:00Z' },
];

// NEW: Add mock data for Transactions
export const mockTransactions: Transaction[] = [
  { transactionId: 'TRN001', accountId: 'SA001', agentId: 'AGENT01', type: 'Deposit', amount: 25000, timestamp: '2025-09-02T10:00:00Z' },
  { transactionId: 'TRN002', accountId: 'SA001', agentId: 'AGENT01', type: 'Withdrawal', amount: 5000, timestamp: '2025-09-01T14:30:00Z' },
  { transactionId: 'TRN003', accountId: 'SA002', agentId: 'AGENT02', type: 'Deposit', amount: 10000, timestamp: '2025-08-28T11:00:00Z' },
  { transactionId: 'TRN004', accountId: 'SA001', agentId: 'AGENT01', type: 'InterestCredit', amount: 620.50, timestamp: '2025-08-31T23:59:59Z' },
  { transactionId: 'TRN005', accountId: 'SA003', agentId: 'AGENT01', type: 'Deposit', amount: 15000, timestamp: '2025-08-25T09:00:00Z' },
];

// NEW: Add mock data for System Notifications
export const mockNotifications = [
  { id: 1, message: 'System maintenance scheduled for Sep 5th at 10 PM.', timestamp: '2025-09-02T11:00:00Z' },
  { id: 2, message: 'New interest rates for Senior accounts are now active.', timestamp: '2025-09-01T09:00:00Z' },
];