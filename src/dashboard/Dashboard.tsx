import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import TransactionSection from "./sections/TransactionSection";
import SummarySection from "./sections/SummarySection";
import AccountsSection from "./sections/AccountsSection";
import CreateAccountSection from "./sections/CreateAccountSection";
import UsersSection from "./sections/UsersSection";
import CustomerDetailsSection from "./sections/CustomerDetailsSection";
import BranchSection from "./sections/BranchSection";
import SavingsPlansSection from "./sections/SavingsPlansSection";
import MyProfileSection from "./sections/MyProfileSection";

import FixedDepositSection from "./sections/FixedDepositSection";

export type MainTab = 'transactions' | 'summary' | 'accounts' | 'create-account' | 'users' | 'customer-details' | 'branches' | 'savings-plans' | 'fixed-deposits'| 'my-profile';


const Dashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transactions');
  const [activeSubTab, setActiveSubTab] = useState<string>('bank-transfer');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleMainTabChange = (tabId: MainTab) => {
    setActiveMainTab(tabId);
    // Set default sub tab based on main tab, but none for customer-details
    const defaultSubTabs: Record<string, string> = {
      'transactions': 'bank-transfer',
      'summary': 'branch-summary',
      'accounts': 'fixed-deposit',
      'create-account': 'fixed-deposit-new',
      'users': 'customers',
      'customer-details': 'customer-info',
      'branches': 'summary',
      'savings-plans': 'create',
      'my-profile': 'details',
      'fixed-deposits': 'fixed-deposit',
    };
    setActiveSubTab(defaultSubTabs[tabId]);
  };

  const renderContent = () => {
    switch (activeMainTab) {
      case 'transactions':
        return <TransactionSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'summary':
        return <SummarySection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'accounts':
        return <AccountsSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'create-account':
        return <CreateAccountSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'users':
        return <UsersSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'customer-details':
        return <CustomerDetailsSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'branches':
        return <BranchSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'savings-plans':
        return <SavingsPlansSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'my-profile':
        return <MyProfileSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'fixed-deposits':
        return <FixedDepositSection />;
      default:
        return <TransactionSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
    }
  };

  return (
    <MainLayout
      user={user}
      activeMainTab={activeMainTab}
      onMainTabChange={handleMainTabChange}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default Dashboard;
