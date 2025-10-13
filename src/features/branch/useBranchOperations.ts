import { useState } from 'react';
import { branchApi } from '../../api/branch';
import type { BranchDetails, CreateBranch, UpdateBranch } from '../../api/branch';

export const useBranchOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<BranchDetails[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<BranchDetails | null>(null);

    const getAllBranches = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.getAll();
            setBranches(data);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch branches');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getBranchById = async (branchId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.getById(branchId);
            setSelectedBranch(data);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch branch details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const searchBranchesByName = async (branchName: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.getByName(branchName);
            setBranches(data);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to search branches');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createBranch = async (branchData: CreateBranch) => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.create(branchData);
            await getAllBranches(); // Refresh the list
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create branch');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateBranch = async (branchId: string, updateData: UpdateBranch) => {
        setLoading(true);
        setError(null);
        try {
            const data = await branchApi.update(branchId, updateData);
            await getAllBranches(); // Refresh the list
            setSelectedBranch(data);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update branch');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        branches,
        selectedBranch,
        setSelectedBranch,
        getAllBranches,
        getBranchById,
        searchBranchesByName,
        createBranch,
        updateBranch,
    };
};

export default useBranchOperations;