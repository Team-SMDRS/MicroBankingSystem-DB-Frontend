import React, { useState } from "react";
import { User, Wallet } from 'lucide-react';
import SubTabGrid from '../../components/layout/SubTabGrid';
import SectionHeader from "../../components/layout/SectionHeader";
import CustomerInfoBlock from "../../components/customer/CustomerInfoBlock";
import UpdateCustomerForm from "../../components/customer/UpdateCustomerForm";
import { fetchCustomerDetailsByNIC } from "../../api/customers";

interface CustomerDetailsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const subTabs = [
  { id: 'customer-info', label: 'Customer Details', icon: User },
  { id: 'customer-accounts', label: 'Update Customer Details', icon: Wallet },
];

const CustomerDetailsSection = ({ activeSubTab, setActiveSubTab }: CustomerDetailsSectionProps) => {
    // State for NIC input and loading (Customer Details tab)
    const [nicNumber, setNICNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState<import("../../api/customers").CustomerDetails | null>(null);
    const [error, setError] = useState("");

    // State for Update Customer Details tab
    const [customerIdInput, setCustomerIdInput] = useState("");
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // Only show content if a tab is selected
    const showContent = !!activeSubTab;

    const handleFetchDetails = async () => {
        setIsLoading(true);
        setError("");
        setCustomerDetails(null);
        try {
            const details = await fetchCustomerDetailsByNIC(nicNumber);
            setCustomerDetails(details);
        } catch (err) {
            setError("Customer not found or error fetching details.");
        } finally {
            setIsLoading(false);
        }
    };

    // Hardcoded token for demo; replace with context or prop in production
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMiIsInVzZXJfaWQiOiI2Yjk5NzIxNy05Y2U1LTRkZGEtYTlhZS04N2JmNTg5YjkyYTUiLCJleHAiOjE3NjAzODA2MDh9.rYU5uAWeZoyeSw_kXEPiHC-9hoZXAOUrRXC0cPlXVL8";

    return (
        <div className="p-8">
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
                }}
            />

            {/* Customer Details Tab (existing) */}
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
                />
            )}

            {/* Update Customer Details Tab */}
            {showContent && activeSubTab === "customer-accounts" && !showUpdateForm && (
                <div className="mt-8 w-full max-w-6xl mx-auto p-4 border rounded bg-white">
                    <h2 className="text-lg font-bold mb-2">Enter Customer ID</h2>
                    <input
                        type="text"
                        value={customerIdInput}
                        onChange={e => setCustomerIdInput(e.target.value)}
                        placeholder="Customer ID"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={!customerIdInput}
                        onClick={() => setShowUpdateForm(true)}
                    >
                        Fetch Details
                    </button>
                </div>
            )}

            {showContent && activeSubTab === "customer-accounts" && showUpdateForm && (
                <React.Suspense fallback={<div>Loading form...</div>}>
                    {/* Lazy load the update form */}
                    {/* @ts-ignore */}
                    <UpdateCustomerForm
                        customerId={customerIdInput}
                        token={token}
                        onClose={() => {
                            setShowUpdateForm(false);
                            setCustomerIdInput("");
                        }}
                    />
                </React.Suspense>
            )}
        </div>
    );
};

export default CustomerDetailsSection;
