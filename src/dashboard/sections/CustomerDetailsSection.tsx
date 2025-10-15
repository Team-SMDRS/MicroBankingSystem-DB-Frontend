import { useState, useRef, useEffect } from "react";
import { User } from 'lucide-react';
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

            {/* Update Customer Form (shown when update button is clicked) */}
            {showContent && showUpdateForm && (
                <div ref={updateFormRef}>
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
    );
};

export default CustomerDetailsSection;
