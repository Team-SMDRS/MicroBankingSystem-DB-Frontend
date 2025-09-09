// src/types/index.ts

export interface Branch {
  branchId: string;
  name: string;
  location: string;
}

export interface Agent {
  agentId: string;
  name: string;
  branchId: string;
}

export interface Customer {
  customerId: string;
  name: string;
  nic: string;
  address: string;
  assignedAgentId: string;
  isJoint: boolean; // To identify joint account holders
  registrationDate: string; // ISO date string
}

export interface SavingsAccount {
  accountId: string;
  customerId: string; // or an array of customerIds for joint accounts
  planName: 'Children' | 'Teen' | 'Adult' | 'Senior' | 'Joint'; // [cite: 14, 15, 16, 17, 18]
  balance: number;
  interestRate: number; // e.g., 12 for 12%
  minBalance: number; // [cite: 15, 16, 17, 18]
  status: 'Active' | 'Inactive';
}

export interface FixedDeposit {
  fdId: string;
  linkedAccountId: string;
  principal: number;
  interestRate: number;
  term: 6 | 12 | 36; // In months [cite: 22, 24, 25]
  startDate: string; // ISO date string
  nextPayoutDate: string; // 
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  agentId: string;
  type: 'Deposit' | 'Withdrawal' | 'InterestCredit'; // [cite: 20, 27]
  amount: number;
  timestamp: string; // ISO date string [cite: 20]
}