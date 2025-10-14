import { useState } from 'react';
import { branchApi, type BranchDetails, type CreateBranch, type UpdateBranch } from '../../api/branch';

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
            if (Array.isArray(data)) {
                setBranches(data);
                if (data.length === 0) {
                    setError('No branches found with this name');
                }
            } else {
                console.error('Unexpected response format:', data);
                setError('Received invalid data format from server');
            }
            return data;
        } catch (err: any) {
            console.error('Search branches error:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to search branches';
            setError(errorMessage);
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
            // Validate input data
            if (!branchId) {
                throw new Error('Branch ID is required');
            }
            if (!updateData.name && !updateData.address) {
                throw new Error('At least one field (name or address) must be provided for update');
            }

            console.log('Updating branch:', { branchId, updateData }); // Log update attempt
            const data = await branchApi.update(branchId, updateData);

            if (!data) {
                throw new Error('No data received after update');
            }

            console.log('Update successful:', data); // Log success
            await getAllBranches(); // Refresh the list
            setSelectedBranch(data);
            return data;
        } catch (err: any) {
            console.error('Update branch error in hook:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to update branch';
            setError(errorMessage);
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