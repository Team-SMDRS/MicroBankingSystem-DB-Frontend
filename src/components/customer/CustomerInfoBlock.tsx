import React from "react";
import NICNumberInput from "../forms/NICNumberInput";

interface CustomerInfoBlockProps {
  activeSubTab: string;
  nicNumber: string;
  setNICNumber: (nic: string) => void;
  handleFetchDetails: () => void;
  isLoading: boolean;
  error: string;
  customerDetails: {
    customer_id: string;
    full_name: string;
    nic: string;
    address: string;
    phone_number: string;
    dob: string;
    created_by_user_name: string;
  } | null;
  onCloseDetails?: () => void;
  onUpdateDetails?: (customerId: string) => void;
}

const CustomerInfoBlock: React.FC<CustomerInfoBlockProps> = ({
  activeSubTab,
  nicNumber,
  setNICNumber,
  handleFetchDetails,
  isLoading,
  error,
  customerDetails,
  onCloseDetails,
  onUpdateDetails,
}) => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-md border border-borderLight p-6">
      {activeSubTab === "customer-info" && (
        <>
          {!customerDetails && (
            <NICNumberInput
              nicNumber={nicNumber}
              onNICNumberChange={setNICNumber}
              onFetchDetails={handleFetchDetails}
              isLoading={isLoading}
            />
          )}
          {error && <div className="mt-4 text-red-600">{error}</div>}
          {customerDetails && (
            <div className="mt-6 border border-borderLight rounded-2xl p-6 bg-background shadow-md relative">
              <div className="flex items-center mb-4 gap-3">
                <div className="bg-tertiary rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div className="font-bold text-xl text-primary">{customerDetails.full_name}</div>
                  <div className="text-sm text-textSecondary">Customer ID: <span className="font-mono text-primary">{customerDetails.customer_id}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textSecondary w-36">NIC:</span>
                  <span className="font-mono text-primary">{customerDetails.nic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textSecondary w-36">Phone:</span>
                  <span className="text-primary">{customerDetails.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textSecondary w-36">Address:</span>
                  <span className="text-primary">{customerDetails.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textSecondary w-36">Date of Birth:</span>
                  <span className="text-primary">{customerDetails.dob}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textSecondary w-36">Created By:</span>
                  <span className="text-primary">{customerDetails.created_by_user_name}</span>
                </div>
              </div>
              
              {/* Action buttons moved to the bottom */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="button-primary"
                  onClick={() => onUpdateDetails && onUpdateDetails(customerDetails.customer_id)}
                  title="Update Details"
                  aria-label="Update customer details"
                >
                  Edit Details
                </button>
                <button
                  className="button-secondary"
                  onClick={onCloseDetails}
                  title="Close"
                  aria-label="Close details"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {activeSubTab === "customer-accounts" && (
        <div className="text-textSecondary">Customer accounts functionality will be implemented here.</div>
      )}
    </div>
  );
};

export default CustomerInfoBlock;
