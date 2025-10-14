// Main API exports
export { default as api } from './axios';
export { authApi, type LoginRequest, type LoginResponse } from './auth';
export { accountApi, type AccountDetails, type CreateAccountRequest } from './accounts';
export { transactionApi, type WithdrawalRequest, type DepositRequest, type TransactionResponse } from './transactions';
export { userApi, type User, type CreateUserRequest } from './users';
export { reportsApi, type ReportParams, type TransactionReport } from './reports';
export { jointAccountApi, type JointAccountCreateRequest, type JointAccountCreateResponse } from './jointAccounts';

// Re-export axios instance as default
export { default } from './axios';
