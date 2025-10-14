import React, { useState, useEffect } from 'react';
import { branchApi, type BranchDetails } from '../../api/branch';

interface SearchBranchFormProps {
    onSelect?: (branch: BranchDetails) => void;
    // If true, render results at the bottom of the container (requires parent to allow flexible height)
    pushResultsToBottom?: boolean;
}

const SearchBranchForm: React.FC<SearchBranchFormProps> = ({
    onSelect,
    pushResultsToBottom = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'name' | 'id'>('name');
    const [allBranches, setAllBranches] = useState<BranchDetails[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<BranchDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all branches on component mount
    useEffect(() => {
        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                const branches = await branchApi.getAll();
                setAllBranches(branches);
                setFilteredBranches(branches); // Show all branches initially
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // Filter branches based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBranches(allBranches);
            return;
        }

        const filtered = allBranches.filter(branch => {
            if (searchType === 'name') {
                return branch.name?.toLowerCase().includes(searchQuery.toLowerCase());
            } else {
                return branch.branch_id.toLowerCase().includes(searchQuery.toLowerCase());
            }
        });

        setFilteredBranches(filtered);
    }, [searchQuery, searchType, allBranches]);

    return (
        <div className="space-y-4 flex flex-col min-h-full">
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder={searchType === 'name' ? "Search by branch name..." : "Search by branch ID..."}
                        />
                    </div>
                    <div className="flex items-center">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as 'name' | 'id')}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="name">Search by Name</option>
                            <option value="id">Search by ID</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredBranches && filteredBranches.length > 0 && (
                <div className={`mt-4 ${pushResultsToBottom ? 'mt-auto' : ''}`}>
                    <h3 className="text-lg font-semibold mb-2">
                        {searchQuery.trim() ? 'Search Results' : 'All Branches'} ({filteredBranches.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredBranches.map((branch: BranchDetails) => (
                            <div
                                key={branch.branch_id}
                                className="p-3 border rounded-lg hover:bg-blue-50 transition-colors duration-150 border-blue-100 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-medium">{branch.name}</div>
                                    <div className="text-sm text-gray-600">{branch.address}</div>
                                    <div className="text-xs text-gray-400">ID: {branch.branch_id}</div>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        onClick={() => onSelect?.(branch)}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Loading branches...</div>
                </div>
            )}

            {!isLoading && filteredBranches.length === 0 && searchQuery.trim() && (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">No branches found matching "{searchQuery}"</div>
                </div>
            )}
        </div>
    );
};

export default SearchBranchForm;
