import type { ReactNode } from 'react';
import { LayoutDashboard, Users, Wallet, UserPlus, ArrowLeftRight, Building2, LogOut } from 'lucide-react';
import type { MainTab } from '../../features/dashboard/Dashboard';

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
    { id: 'accounts' as MainTab, label: 'Accounts', icon: Wallet },
    { id: 'create-account' as MainTab, label: 'Create Account', icon: UserPlus },
    { id: 'users' as MainTab, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">BankPro</h1>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => onMainTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-72 p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-slate-700 font-semibold">
              {user?.username?.slice(0, 2).toUpperCase() || 'JD'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {user?.username || 'John Doe'}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
