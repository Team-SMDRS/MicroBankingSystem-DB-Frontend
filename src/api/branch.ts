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
    // Get all branches (canonical route)
    getAll: async (): Promise<BranchDetails[]> => {
        const res = await api.get('/api/branch/branches');
        return res.data;
    },

    // Get branch by ID (canonical route)
    getById: async (branchId: string): Promise<BranchDetails> => {
        const res = await api.get(`/api/branch/branches/${branchId}`);
        return res.data;
    },

    // Get branch by name (can return multiple branches)
    // Get branch by name (canonical route)
    getByName: async (branchName: string): Promise<BranchDetails[]> => {
        const res = await api.get(`/api/branch/branches/name/${branchName}`);
        return Array.isArray(res.data) ? res.data : [res.data];
    },

    // Create a new branch (canonical route)
    create: async (branchData: CreateBranch): Promise<BranchDetails> => {
        const res = await api.post('/api/branch/branches', branchData);
        return res.data;
    },

    // Update branch by ID
    // Update branch by ID (canonical route)
    update: async (branchId: string, updateData: UpdateBranch): Promise<BranchDetails> => {
        const res = await api.put(`/api/branch/branches/${branchId}`, updateData);
        return res.data;
    },
};

export default branchApi;
