import api from './axios';

// Types for creating joint account with existing customers
export interface JointAccountCreateRequest {
  nic1: string;
  nic2: string;
  balance: number;
}

export interface JointAccountCreateResponse {
  acc_id: string;
  account_no: number;
}

// Types for creating joint account with new customers
export interface CustomerInfo {
  full_name: string;
  address: string;
  phone_number: string;
  nic: string;
  dob: string;
}

export interface JointAccountWithNewCustomersRequest {
  customer1: CustomerInfo;
  customer2: CustomerInfo;
  balance: number;
}

export interface CustomerCreationResult {
  customer_id: string;
  nic: string;
  username: string;
  password: string;
}

export interface JointAccountWithNewCustomersResponse {
  customer1: CustomerCreationResult;
  customer2: CustomerCreationResult;
  acc_id: string;
  account_no: number;
}

// Types for mixed joint account (one existing + one new customer)
export interface MixedJointAccountRequest {
  existing_customer_nic: string;
  new_customer: CustomerInfo;
  balance: number;
}

export interface MixedJointAccountResponse {
  existing_customer_id: string;
  new_customer_id: string;
  acc_id: string;
  account_no: number;
  new_customer_login: {
    username: string;
    password: string;
  };
}

export const jointAccountApi = {
  // Create joint account with existing customers
  createJointAccount: async (data: JointAccountCreateRequest): Promise<JointAccountCreateResponse> => {
    const response = await api.post('/api/joint-account/joint-account/create', data);
    return response.data;
  },
  
  // Create joint account with new customers
  createJointAccountWithNewCustomers: async (data: JointAccountWithNewCustomersRequest): Promise<JointAccountWithNewCustomersResponse> => {
    const response = await api.post('/api/joint-account/joint-account/create-with-new-customers', data);
    return response.data;
  },
  
  // Create joint account with one existing and one new customer
  createJointAccountWithExistingAndNew: async (data: MixedJointAccountRequest): Promise<MixedJointAccountResponse> => {
    const response = await api.post('/api/joint-account/joint-account/create-with-existing-and-new-customer', data);
    return response.data;
  }
};

export default jointAccountApi;