import api from './axios';

// Types
export interface SavingsPlanCreateRequest {
  plan_name: string;
  interest_rate: number;
  min_balance: number;
}

export interface SavingsPlanCreateResponse {
  savings_plan_id: string;
}

export interface SavingsPlan {
  savings_plan_id: string;
  plan_name: string;
  interest_rate: number;
  min_balance: number;
}

// API functions
export const savingsPlanApi = {
  // Create a new savings plan
  createSavingsPlan: async (data: SavingsPlanCreateRequest): Promise<SavingsPlanCreateResponse> => {
    try {
      const response = await api.post<SavingsPlanCreateResponse>(
        '/api/savings-plan/savings_plan/create',
        data
      );
      return response.data;
    } catch (error: any) {
      // This ensures errors are properly propagated to the caller
      console.error('Savings plan creation error:', error.response?.data || error.message);
      throw error; // Re-throw to be handled by the form component
    }
  },

  // Get all savings plans (you can implement this later)
  getAllSavingsPlans: async (): Promise<SavingsPlan[]> => {
    const response = await api.get<SavingsPlan[]>('/api/savings-plan/savings_plan/all');
    return response.data;
  },
};

export default savingsPlanApi;