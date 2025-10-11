import React from "react";
import { User, Wallet } from 'lucide-react';
import SubTabGrid from '../../components/layout/SubTabGrid';
import SectionHeader from "../../components/layout/SectionHeader";

interface CustomerDetailsSectionProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const subTabs = [
  { id: 'customer-info', label: 'Customer Details', icon: User },
  { id: 'customer-accounts', label: 'Update Customer Details', icon: Wallet },
];

const CustomerDetailsSection = ({ activeSubTab, setActiveSubTab }: CustomerDetailsSectionProps) => {
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

            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                {activeSubTab === 'customer-info' && (
                    <div className="text-slate-600">Customer info functionality will be implemented here.</div>
                )}
                {activeSubTab === 'customer-accounts' && (
                    <div className="text-slate-600">Customer accounts functionality will be implemented here.</div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetailsSection;
