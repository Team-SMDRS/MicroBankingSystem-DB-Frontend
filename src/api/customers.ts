import api from "./axios";

export interface CustomerDetails {
  customer_id: string;
  full_name: string;
  nic: string;
  address: string;
  phone_number: string;
  dob: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  created_by_user_name?: string;
  updated_by?: string;
}

export interface CustomerSearchResult {
  customer_id: string;
  full_name: string;
  nic: string;
  address: string;
  phone_number: string;
}

export interface UpdateCustomerData {
  full_name: string;
  address: string;
  phone_number: string;
}

export const fetchCustomerDetailsByNIC = async (nic: string): Promise<CustomerDetails> => {
  const response = await api.get(`customer_data/details/by-nic/${nic}`);
  return response.data;
};

export const fetchCustomerDetailsById = async (customerId: string): Promise<CustomerDetails> => {
  const response = await api.get(`api/account-management/customer/${customerId}`);
  return response.data;
};

export const updateCustomer = async (customerId: string, data: UpdateCustomerData): Promise<CustomerDetails> => {
  const response = await api.put(`api/account-management/customer/${customerId}`, data);
  return response.data;
};

export const searchCustomersByName = async (name: string): Promise<CustomerSearchResult[]> => {
  const response = await api.get('api/customer-branch/customers/search', { params: { name } });
  return response.data;
};
