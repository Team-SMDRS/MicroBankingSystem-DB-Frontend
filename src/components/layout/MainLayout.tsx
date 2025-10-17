import type { ReactNode } from 'react';
import { LayoutDashboard, Users, Wallet, UserPlus, ArrowLeftRight, Building2, LogOut, PiggyBank } from 'lucide-react';
import logo from '../../assets/logo1.png';
import type { MainTab } from '../../dashboard/Dashboard';

interface MainLayoutProps {
  children: ReactNode;
  user: any;
  activeMainTab: MainTab;
  onMainTabChange: (tabId: MainTab) => void;
  onLogout: () => void;
}

const MainLayout = ({ children, user, activeMainTab, onMainTabChange, onLogout }: MainLayoutProps) => {
  const mainTabs = [
    { id: 'transactions' as MainTab, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'summary' as MainTab, label: 'Summary', icon: LayoutDashboard },
    { id: 'accounts' as MainTab, label: 'Accounts Details', icon: Wallet },
    { id: 'create-account' as MainTab, label: 'Account Management', icon: UserPlus },
    { id: 'users' as MainTab, label: 'Users', icon: Users },
    { id: 'customer-details' as MainTab, label: 'Customer Details', icon: Users },
    { id: 'branches' as MainTab, label: 'Branch Management', icon: Building2 },
    { id: 'savings-plans' as MainTab, label: 'Savings Plans', icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-white shadow-lg border-r border-[#E9ECEF] flex flex-col">
        <div className="p-6 border-b border-[#E9ECEF] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md bg-white/0"
              style={{
                backgroundImage: `url(${logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-[#264653]"><span className="text-[#2A9D8F]">B</span>Trust Bank</h1>
              <p className="text-xs text-[#6C757D]">Management System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => onMainTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-[#2A9D8F] text-white shadow-md'
                        : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#264653]'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#6C757D]'}`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#E9ECEF] bg-white flex-shrink-0">
          <button
            onClick={() => onMainTabChange('my-profile' as MainTab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeMainTab === 'my-profile'
              ? 'bg-[#2A9D8F] text-white shadow-md'
              : 'bg-[#F8F9FA] hover:bg-gray-100 text-[#264653] hover:text-[#264653]'
            }`}
          >
            <div className="w-10 h-10 bg-[#264653] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.username?.slice(0, 2).toUpperCase() || 'JD'}
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-semibold ${activeMainTab === 'my-profile' ? 'text-white' : 'text-[#264653]'}`}>
                {user?.username || 'John Doe'}
              </p>
              <p className={`text-xs ${activeMainTab === 'my-profile' ? 'text-white text-opacity-80' : 'text-[#6C757D]'}`}>View Profile</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className={`p-2 rounded-lg transition-colors ${activeMainTab === 'my-profile'
                ? 'text-white text-opacity-80 hover:text-white hover:bg-white/10'
                : 'text-[#6C757D] hover:text-[#E63946] hover:bg-red-50'
              }`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </button>
        </div>
      </aside>

      {/* Main Content with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-72 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
