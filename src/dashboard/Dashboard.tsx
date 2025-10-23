import { useState, useContext } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { AuthContext } from "../context/AuthContext";
import TransactionSection from "./sections/TransactionSection";
import SummarySection from "./sections/SummarySection";
import AccountsSection from "./sections/AccountsSection";
import CreateAccountSection from "./sections/CreateAccountSection";
import UsersSection from "./sections/UsersSection";
import CustomerDetailsSection from "./sections/CustomerDetailsSection";
import BranchSection from "./sections/BranchSection";
import SavingsPlansSection from "./sections/SavingsPlansSection";
import MyProfileSection from "./sections/MyProfileSection";
import OverviewSection from "./sections/OverviewSection";

import FixedDepositSection from "./sections/FixedDepositSection";

export type MainTab = 'overview' | 'transactions' | 'summary' | 'accounts' | 'create-account' | 'users' | 'customer-details' | 'branches' | 'savings-plans' | 'fixed-deposits'| 'my-profile';


const Dashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transactions');
  const [activeSubTab, setActiveSubTab] = useState<string>('bank-transfer');
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const userPermissions = authContext?.user?.permissions || [];

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
      'overview': 'my-branch',
      'transactions': 'bank-transfer',
      'summary': 'transaction-summary',
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
      case 'overview':
        return <OverviewSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'transactions':
        return <TransactionSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'summary':
        return <SummarySection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'accounts':
        return <AccountsSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'create-account':
        return <CreateAccountSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'users':
        // Only show users if user has 'admin' permission
        if (userPermissions.includes('admin')) {
          return <UsersSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
        }
        return <div className="p-8 text-center text-slate-600">You do not have permission to access this section.</div>;
      case 'customer-details':
        return <CustomerDetailsSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'branches':
        // Only show branches if user has 'admin' permission
        if (userPermissions.includes('admin')) {
          return <BranchSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
        }
        return <div className="p-8 text-center text-slate-600">You do not have permission to access this section.</div>;
      case 'savings-plans':
        // Only show savings-plans if user has 'admin' permission
        if (userPermissions.includes('admin')) {
          return <SavingsPlansSection activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
        }
        return <div className="p-8 text-center text-slate-600">You do not have permission to access this section.</div>;
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
      userPermissions={userPermissions}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default Dashboard;
