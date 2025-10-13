import api from "./axios";

export interface CustomerDetails {
  customer_id: string;
  full_name: string;
  nic: string;
  address: string;
  phone_number: string;
  dob: string;
  created_by_user_name: string;
}

export const fetchCustomerDetailsByNIC = async (nic: string): Promise<CustomerDetails> => {
  const response = await api.get(`/customer_data/details/by-nic/${nic}`);
  return response.data;
};
