import api from './axios';

// Branch types
export interface BranchDetails {
    branch_id: string;
    name?: string;
    address?: string;
    created_at: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
}

export interface CreateBranch {
    name: string;
    address: string;
}

export interface UpdateBranch {
    name?: string;
    address?: string;
}

// Branch API service
export const branchApi = {
    // Get all branches
    getAll: async (): Promise<BranchDetails[]> => {
        const res = await api.get('/branches');
        return res.data;
    },

    // Get branch by ID (returns first element since backend returns a list)
    getById: async (branchId: string): Promise<BranchDetails> => {
        const res = await api.get(`/branches/${branchId}`);
        return res.data[0];
    },

    // Get branch by name (can return multiple branches)
    getByName: async (branchName: string): Promise<BranchDetails[]> => {
        const res = await api.get(`/branches/name/${branchName}`);
        return res.data;
    },

    // Create a new branch
    create: async (branchData: CreateBranch): Promise<BranchDetails> => {
        const res = await api.post('/branches', branchData);
        return res.data;
    },

    // Update branch by ID
    update: async (branchId: string, updateData: UpdateBranch): Promise<BranchDetails> => {
        const res = await api.put(`/branches/${branchId}`, updateData);
        return res.data;
    },
};

export default branchApi;
