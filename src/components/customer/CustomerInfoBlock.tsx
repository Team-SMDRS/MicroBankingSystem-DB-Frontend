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
    <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
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
          {error && <div className="mt-4 text-[#E63946]">{error}</div>}
          {customerDetails && (
            <div className="mt-6 border border-[#E9ECEF] rounded-lg p-6 bg-[#F8F9FA] shadow-md relative">
              <div className="flex items-center mb-4 gap-3">
                <div className="bg-[#2A9D8F] bg-opacity-10 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div className="font-semibold text-xl text-[#264653]">{customerDetails.full_name}</div>
                  <div className="text-sm text-[#6C757D]">Customer ID: <span className="font-mono">{customerDetails.customer_id}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#264653] w-36">NIC:</span>
                  <span className="font-mono text-[#264653]">{customerDetails.nic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#264653] w-36">Phone:</span>
                  <span className="text-[#264653]">{customerDetails.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#264653] w-36">Address:</span>
                  <span className="text-[#264653]">{customerDetails.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#264653] w-36">Date of Birth:</span>
                  <span className="text-[#264653]">{customerDetails.dob}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#264653] w-36">Created By:</span>
                  <span className="text-[#264653]">{customerDetails.created_by_user_name}</span>
                </div>
              </div>
              
              {/* Action buttons moved to the bottom */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="text-white bg-[#2A9D8F] hover:bg-[#238579] font-medium px-4 py-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-opacity-50"
                  onClick={() => onUpdateDetails && onUpdateDetails(customerDetails.customer_id)}
                  title="Update Details"
                  aria-label="Update customer details"
                >
                  Edit Details
                </button>
                <button
                  className="text-[#264653] hover:text-white hover:bg-[#E63946] font-medium px-4 py-2 rounded-lg border border-[#E63946] border-opacity-20 bg-[#E63946] bg-opacity-5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-50"
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
        <div className="text-[#6C757D]">Customer accounts functionality will be implemented here.</div>
      )}
    </div>
  );
};

export default CustomerInfoBlock;
