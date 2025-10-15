import api from './axios';

// Types
export interface SavingsPlanCreateRequest {
  plan_name: string;
  interest_rate: number;
  minimum_balance: number;
}

export interface SavingsPlanCreateResponse {
  savings_plan_id: string;
}

export interface SavingsPlan {
  savings_plan_id: string;
  plan_name: string;
  interest_rate: number;
  minimum_balance: number;
}

export interface SavingsPlanUpdateRequest {
  savings_plan_id: string;
  plan_name: string;
  interest_rate: number;
  minimum_balance: number;
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

  // Get all savings plans details
  getSavingsPlansDetails: async (): Promise<{ savings_plans: SavingsPlan[] }> => {
    try {
      const response = await api.get<{ savings_plans: SavingsPlan[] }>(
        '/api/savings-plan/savings_plans/details'
      );
      return response.data;
    } catch (error: any) {
      console.error('Fetching savings plans error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update interest rate of an existing savings plan
  updateSavingsPlanInterestRate: async (planId: string, newInterestRate: number): Promise<{ success: boolean }> => {
    try {
      const response = await api.put<{ success: boolean }>(
        `/api/savings-plan/savings_plan/${planId}/interest_rate?new_interest_rate=${newInterestRate}`,
        {}
      );
      return response.data;
    } catch (error: any) {
      console.error('Updating savings plan interest rate error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default savingsPlanApi;