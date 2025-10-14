import api from './axios';

export interface JointAccountCreateRequest {
  nic1: string;
  nic2: string;
  balance: number;
}

export interface JointAccountCreateResponse {
  acc_id: string;
  account_no: number;
}

export const jointAccountApi = {
  createJointAccount: async (data: JointAccountCreateRequest): Promise<JointAccountCreateResponse> => {
    const response = await api.post('/api/joint-account/joint-account/create', data);
    return response.data;
  }
};

export default jointAccountApi;