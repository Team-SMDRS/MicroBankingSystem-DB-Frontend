import React, { useState } from "react";
import { User, Wallet } from 'lucide-react';
import SubTabGrid from '../../components/layout/SubTabGrid';
import SectionHeader from "../../components/layout/SectionHeader";
import CustomerInfoBlock from "../../components/customer/CustomerInfoBlock";
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
    // State for NIC input and loading
    const [nicNumber, setNICNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState<import("../../api/customers").CustomerDetails | null>(null);
    const [error, setError] = useState("");

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

    return (
        <div className="p-8">
            <SectionHeader
                title="Customer Details"
                description="View and manage customer information and accounts"
            />

            <SubTabGrid
                subTabs={subTabs}
                activeSubTab={activeSubTab}
                onSubTabChange={setActiveSubTab}
            />

            {showContent && (
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
        </div>
    );
};

export default CustomerDetailsSection;
