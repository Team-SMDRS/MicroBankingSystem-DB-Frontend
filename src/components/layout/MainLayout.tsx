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
  userPermissions?: string[];
}

const MainLayout = ({ children, user, activeMainTab, onMainTabChange, onLogout, userPermissions = [] }: MainLayoutProps) => {
  const allMainTabs = [
    { id: 'overview' as MainTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions' as MainTab, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'summary' as MainTab, label: 'Summary', icon: LayoutDashboard },
    { id: 'accounts' as MainTab, label: 'Accounts Details', icon: Wallet },
    { id: 'fixed-deposits' as MainTab, label: 'Fixed Deposits', icon: PiggyBank },
    { id: 'create-account' as MainTab, label: 'Account Management', icon: UserPlus },
    { id: 'users' as MainTab, label: 'Users', icon: Users },
    { id: 'customer-details' as MainTab, label: 'Customer Details', icon: Users },
    { id: 'branches' as MainTab, label: 'Branch Management', icon: Building2 },
    { id: 'savings-plans' as MainTab, label: 'Savings Plans', icon: PiggyBank },
  ];

  // Filter tabs based on permissions
  const mainTabs = allMainTabs.filter((tab) => {
    // Only show 'users' tab if user has 'admin' permission
    if (tab.id === 'users') {
      return userPermissions.includes('admin');
    }
    // Only show 'savings-plans' tab if user has 'admin' permission
    if (tab.id === 'savings-plans') {
      return userPermissions.includes('admin');
    }
    // Only show 'branches' tab if user has 'admin' permission
    if (tab.id === 'branches') {
      return userPermissions.includes('admin');
    }
    // Show all other tabs
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-white shadow-lg border-r border-borderLight flex flex-col">
        <div className="p-6 border-b border-borderLight flex-shrink-0 animate-slide-in-left">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-white/0 transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: `url(${logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-primary"><span className="text-textSecondary">B</span>Trust Bank</h1>
              <p className="text-xs text-tertiary font-medium">Management System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {mainTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <li key={tab.id} style={{ animation: `slide-in-left 0.4s ease-out ${index * 0.05}s both` }}>
                  <button
                    onClick={() => onMainTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive
                        ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/30'
                        : 'text-primary hover:bg-borderLight hover:text-textSecondary'
                      }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-textSecondary'}`} />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-borderLight bg-background/50 flex-shrink-0">
          <button
            onClick={() => onMainTabChange('my-profile' as MainTab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${activeMainTab === 'my-profile'
              ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/30'
              : 'bg-white hover:shadow-md text-primary hover:text-textSecondary border border-borderLight'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-highlight to-highlightHover rounded-full flex items-center justify-center text-primary font-semibold flex-shrink-0 shadow-md">
              {user?.username?.slice(0, 2).toUpperCase() || 'JD'}
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-semibold ${activeMainTab === 'my-profile' ? 'text-white' : 'text-primary'}`}>
                {user?.username || 'John Doe'}
              </p>
              <p className={`text-xs font-medium ${activeMainTab === 'my-profile' ? 'text-white/70' : 'text-tertiary'}`}>View Profile</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${activeMainTab === 'my-profile'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-tertiary hover:text-red-600 hover:bg-red-50'
              }`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </button>
        </div>
      </aside>

      {/* Main Content with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-72 overflow-auto animate-slide-in-right">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
