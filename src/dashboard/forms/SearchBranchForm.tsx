import React, { useState } from 'react';
import { SubmitButton } from '../../components/common';
import type { BranchDetails } from '../../features/branch';

interface SearchBranchFormProps {
    onSearch: (query: string, type: 'name' | 'id') => Promise<void>;
    isLoading?: boolean;
    results?: BranchDetails[];
    onSelect?: (branch: BranchDetails) => void;
}

const SearchBranchForm: React.FC<SearchBranchFormProps> = ({
    onSearch,
    isLoading,
    results,
    onSelect
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'name' | 'id'>('name');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSearch(searchQuery, searchType);
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder={searchType === 'name' ? "Enter branch name to search" : "Enter branch ID to search"}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as 'name' | 'id')}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="name">Search by Name</option>
                            <option value="id">Search by ID</option>
                        </select>
                        <SubmitButton isSubmitting={!!isLoading}>
                            Search
                        </SubmitButton>
                    </div>
                </div>
            </form>

            {results && results.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                    <div className="space-y-2">
                        {results.map(branch => (
                            <div
                                key={branch.branch_id}
                                className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-blue-100"
                                onClick={() => onSelect?.(branch)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{branch.name}</p>
                                        <p className="text-sm text-gray-600">{branch.address}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        ID: {branch.branch_id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBranchForm;
