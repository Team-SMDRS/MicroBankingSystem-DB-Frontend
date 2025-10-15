import api from '../../api/axios';

export interface FDPlanDetails {
    fd_plan_id: string;
    duration: number;
    interest_rate: string;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export interface FDDetails {
    fd_id: string;
    plan_id: string;
    account_id: string;
    amount: number;
    maturity_date: string;
    interest_rate: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFDPlan {
    duration_months: number;
    interest_rate: number;
}

export interface CreateFD {
    plan_id: string;
    amount: number;
}

export const fdApi = {
    // FD Plan operations
    createPlan: async (data: CreateFDPlan): Promise<FDPlanDetails> => {
        const response = await api.post('/api/fd/fd-plans', null, {
            params: {
                duration_months: data.duration_months,
                interest_rate: data.interest_rate
            }
        });
        return response.data.fd_plan;
    },

    getPlans: async (): Promise<FDPlanDetails[]> => {
        const response = await api.get('/api/fd/fd-plans');
        return response.data.fd_plans;
    },

    // FD operations
    createDeposit: async (data: CreateFD): Promise<FDDetails> => {
        const response = await api.post('/api/fd/deposits', data);
        return response.data.deposit;
    },

    getDeposits: async (): Promise<FDDetails[]> => {
        const response = await api.get('/api/fd/deposits');
        return response.data.deposits;
    },

    getDepositById: async (id: string): Promise<FDDetails> => {
        const response = await api.get(`/api/fd/deposits/${id}`);
        return response.data.deposit;
    }
};