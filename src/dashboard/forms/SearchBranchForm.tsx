import React, { useState } from 'react';
import { SubmitButton } from '../../components/common';
import type { BranchDetails } from '../../features/branch';

interface SearchBranchFormProps {
    onSearch: (query: string, type: 'name' | 'id') => Promise<void>;
    isLoading?: boolean;
    results?: BranchDetails[];
    onSelect?: (branch: BranchDetails) => void;
    // If true, render results at the bottom of the container (requires parent to allow flexible height)
    pushResultsToBottom?: boolean;
}

const SearchBranchForm: React.FC<SearchBranchFormProps> = ({
    onSearch,
    isLoading,
    results,
    onSelect,
    pushResultsToBottom = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'name' | 'id'>('name');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSearch(searchQuery, searchType);
    };

    return (
        <div className="space-y-4 flex flex-col min-h-full">
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
                <div className={`mt-4 ${pushResultsToBottom ? 'mt-auto' : ''}`}>
                    <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                    <div className="space-y-2">
                        {results.map(branch => (
                            <div
                                key={branch.branch_id}
                                className="p-3 border rounded-lg hover:bg-blue-50 transition-colors duration-150 border-blue-100 flex items-center justify-between"
                            >
                                <div className="font-medium">{branch.name}</div>
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
        </div>
    );
};

export default SearchBranchForm;
