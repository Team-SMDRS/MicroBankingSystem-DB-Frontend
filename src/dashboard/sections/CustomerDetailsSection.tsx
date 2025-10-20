import { useState, useRef, useEffect } from "react";
import { User, Search } from 'lucide-react';
import SubTabGrid from '../../components/layout/SubTabGrid';
import SectionHeader from "../../components/layout/SectionHeader";
import CustomerInfoBlock from "../../components/customer/CustomerInfoBlock";
import UpdateCustomerForm from "../../components/customer/UpdateCustomerForm";
import { fetchCustomerDetailsByNIC, searchCustomersByName } from "../../api/customers";
import type { CustomerSearchResult } from "../../api/customers";

interface CustomerDetailsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const subTabs = [
  { id: 'customer-info', label: 'Customer Details', icon: User },
  { id: 'customer-search', label: 'Search Customer', icon: Search },
];

const CustomerDetailsSection = ({ activeSubTab, setActiveSubTab }: CustomerDetailsSectionProps) => {
    // State for NIC input and loading (Customer Details tab)
    const [nicNumber, setNICNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState<{
        customer_id: string;
        full_name: string;
        nic: string;
        address: string;
        phone_number: string;
        dob: string;
        created_by_user_name: string;
    } | null>(null);
    const [error, setError] = useState("");

    // State for Customer Search tab
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    // State for Update Customer Details tab
    const [customerIdInput, setCustomerIdInput] = useState("");
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    
    // Ref for update form section for auto-scrolling
    const updateFormRef = useRef<HTMLDivElement>(null);

    // Only show content if a tab is selected
    const showContent = !!activeSubTab;
    
    // Effect to scroll to the update form when it becomes visible
    useEffect(() => {
        if (showUpdateForm && updateFormRef.current) {
            // Smooth scroll to the update form with a slight delay to ensure render is complete
            setTimeout(() => {
                updateFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [showUpdateForm]);

    const handleFetchDetails = async () => {
        setIsLoading(true);
        setError("");
        setCustomerDetails(null);
        try {
            const details = await fetchCustomerDetailsByNIC(nicNumber);
            // Map the API response to the expected format
            setCustomerDetails({
                customer_id: details.customer_id,
                full_name: details.full_name,
                nic: details.nic,
                address: details.address,
                phone_number: details.phone_number,
                dob: details.dob,
                created_by_user_name: details.created_by_user_name || "N/A"
            });
        } catch (err) {
            setError("Customer not found or error fetching details.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSearchCustomers = async () => {
        if (!searchTerm.trim()) {
            setSearchError("Please enter a search term");
            return;
        }
        
        setSearchLoading(true);
        setSearchError("");
        setSearchResults([]);
        
        try {
            const results = await searchCustomersByName(searchTerm);
            setSearchResults(results);
            if (results.length === 0) {
                setSearchError("No customers found matching your search");
            }
        } catch (err) {
            setSearchError("Error searching for customers");
            console.error("Customer search error:", err);
        } finally {
            setSearchLoading(false);
        }
    };

 
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    title="Customer Details"
                    description="View and manage customer information and accounts"
                />

                <SubTabGrid
                    subTabs={subTabs}
                    activeSubTab={activeSubTab}
                    onSubTabChange={tab => {
                        setActiveSubTab(tab);
                        setShowUpdateForm(false);
                        setCustomerIdInput("");
                        
                        // Reset search state when switching tabs
                        if (tab === "customer-search") {
                            setSearchTerm("");
                            setSearchResults([]);
                            setSearchError("");
                        } else if (tab === "customer-info") {
                            // Keep existing functionality for customer-info tab
                            // but reset results if needed
                        }
                    }}
                />

                {/* Customer Details Tab with Update functionality */}
                {showContent && activeSubTab === "customer-info" && (
                    <CustomerInfoBlock
                        activeSubTab={activeSubTab}
                        nicNumber={nicNumber}
                        setNICNumber={setNICNumber}
                        handleFetchDetails={handleFetchDetails}
                        isLoading={isLoading}
                        error={error}
                        customerDetails={customerDetails}
                        onCloseDetails={() => setCustomerDetails(null)}
                        onUpdateDetails={(customerId) => {
                            setCustomerIdInput(customerId);
                            setShowUpdateForm(true);
                        }}
                    />
                )}

                {/* Customer Search Tab */}
                {showContent && activeSubTab === "customer-search" && (
                    <div className="mt-6 bg-white p-6 rounded-2xl shadow-md border border-borderLight animate-slide-in-right">
                        <div className="mb-6">
                            <label htmlFor="customerSearch" className="label-text">
                                Search Customer by Name
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="customerSearch"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 input-field"
                                    placeholder="Enter customer name"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchCustomers()}
                                />
                                <button
                                    onClick={handleSearchCustomers}
                                    disabled={searchLoading}
                                    className="button-secondary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {searchLoading ? (
                                        <span className="inline-block w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin mr-2" />
                                    ) : (
                                        <Search className="w-4 h-4 mr-2 inline" />
                                    )}
                                    Search
                                </button>
                            </div>
                            {searchError && <p className="mt-2 text-sm text-red-600 font-medium">{searchError}</p>}
                        </div>
                        
                        {searchResults.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-primary mb-3">Search Results</h3>
                                <div className="overflow-x-auto rounded-2xl border border-borderLight">
                                    <table className="min-w-full divide-y divide-borderLight">
                                        <thead className="bg-background">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                                    NIC
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                                    Address
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                                    Phone
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-borderLight">
                                            {searchResults.map((customer) => (
                                                <tr key={customer.customer_id} className="hover:bg-background transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                                                        {customer.full_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-mono">
                                                        {customer.nic}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary">
                                                        {customer.address}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-tertiary">
                                                        {customer.phone_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => {
                                                                // Set the NIC for the customer details tab
                                                                setNICNumber(customer.nic);
                                                                // Switch to customer details tab
                                                                setActiveSubTab("customer-info");
                                                                // Fetch details automatically
                                                                setTimeout(() => handleFetchDetails(), 100);
                                                            }}
                                                            className="text-highlight hover:text-highlightHover font-semibold transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                        
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Update Customer Form (shown when update button is clicked) */}
                {showContent && showUpdateForm && (
                    <div ref={updateFormRef} className="mt-6 animate-slide-in-right">
                        <UpdateCustomerForm
                            customerId={customerIdInput}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setCustomerIdInput("");
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetailsSection;
