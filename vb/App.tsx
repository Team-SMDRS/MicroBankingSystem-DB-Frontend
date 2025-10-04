import { useState } from 'react';
import { LayoutDashboard, CreditCard, Users, FileText, ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, Building2, TrendingUp, Wallet, UserPlus, Landmark, UserCog } from 'lucide-react';
import { BankTransferForm } from './components/BankTransferForm';
import { WithdrawalForm } from './components/WithdrawalForm';
import { DepositForm } from './components/DepositForm';
import { BranchSummary, TransactionSummary, AccountSummary } from './components/SummaryTables';

type MainTab = 'transactions' | 'summary' | 'accounts' | 'create-account' | 'users';
type SubTab = string;

function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transactions');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('bank-transfer');

  const mainTabs = [
    { id: 'transactions' as MainTab, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'summary' as MainTab, label: 'Summary', icon: LayoutDashboard },
    { id: 'accounts' as MainTab, label: 'Accounts', icon: Wallet },
    { id: 'create-account' as MainTab, label: 'Create Account', icon: UserPlus },
    { id: 'users' as MainTab, label: 'Users', icon: Users },
  ];

  const subTabsConfig: Record<MainTab, Array<{ id: string; label: string; icon: any }>> = {
    transactions: [
      { id: 'bank-transfer', label: 'Bank Transfer', icon: ArrowLeftRight },
      { id: 'withdrawal', label: 'Withdrawal', icon: ArrowDownToLine },
      { id: 'deposit', label: 'Deposit', icon: ArrowUpFromLine },
    ],
    summary: [
      { id: 'branch-summary', label: 'Branch Summary', icon: Building2 },
      { id: 'transaction-summary', label: 'Transaction Summary', icon: TrendingUp },
      { id: 'account-summary', label: 'Account Summary', icon: FileText },
    ],
    accounts: [
      { id: 'fixed-deposit', label: 'Fixed Deposit Accounts', icon: Landmark },
      { id: 'joint-accounts', label: 'Joint Accounts', icon: Users },
      { id: 'current-accounts', label: 'Current Accounts', icon: CreditCard },
    ],
    'create-account': [
      { id: 'fixed-deposit-new', label: 'Fixed Deposit Account', icon: Landmark },
      { id: 'joint-account-new', label: 'Joint Account', icon: Users },
      { id: 'current-account-new', label: 'Current Account', icon: CreditCard },
    ],
    users: [
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'transfer-agent', label: 'Transfer Agent', icon: ArrowLeftRight },
      { id: 'deposit-withdrawal-agent', label: 'Deposit/Withdrawal Agent', icon: UserCog },
      { id: 'account-agent', label: 'Account Agent', icon: UserPlus },
    ],
  };

  const handleMainTabChange = (tabId: MainTab) => {
    setActiveMainTab(tabId);
    setActiveSubTab(subTabsConfig[tabId][0].id);
  };

  const currentSubTabs = subTabsConfig[activeMainTab];

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
                    onClick={() => handleMainTabChange(tab.id)}
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
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {mainTabs.find((t) => t.id === activeMainTab)?.label}
            </h2>
            <p className="text-slate-600">
              Manage your {activeMainTab} efficiently and securely
            </p>
          </div>

          {/* Sub Tabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentSubTabs.map((subTab) => {
              const Icon = subTab.icon;
              const isActive = activeSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`relative p-8 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-600/30 scale-105'
                      : 'bg-white hover:shadow-xl hover:scale-102 shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-white/20'
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isActive ? 'text-white' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          isActive ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {subTab.label}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        Click to manage
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl ring-4 ring-blue-400/50 ring-offset-2"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          {activeMainTab === 'transactions' && (
            <>
              {activeSubTab === 'bank-transfer' && <BankTransferForm />}
              {activeSubTab === 'withdrawal' && <WithdrawalForm />}
              {activeSubTab === 'deposit' && <DepositForm />}
            </>
          )}

          {activeMainTab === 'summary' && (
            <>
              {activeSubTab === 'branch-summary' && <BranchSummary />}
              {activeSubTab === 'transaction-summary' && <TransactionSummary />}
              {activeSubTab === 'account-summary' && <AccountSummary />}
            </>
          )}

          {(activeMainTab === 'accounts' || activeMainTab === 'create-account' || activeMainTab === 'users') && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                {(() => {
                  const currentTab = currentSubTabs.find((t) => t.id === activeSubTab);
                  const Icon = currentTab?.icon;
                  return (
                    <>
                      {Icon && (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {currentTab?.label}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {activeMainTab === 'create-account'
                            ? `Create a new ${currentTab?.label.toLowerCase()}`
                            : `View and manage ${currentTab?.label.toLowerCase()}`}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
