import type { LucideIcon } from 'lucide-react';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SubTabGridProps {
  subTabs: SubTab[];
  activeSubTab: string;
  onSubTabChange: (tabId: string) => void;
}

const SubTabGrid = ({ subTabs, activeSubTab, onSubTabChange }: SubTabGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {subTabs.map((subTab) => {
        const Icon = subTab.icon;
        const isActive = activeSubTab === subTab.id;
        return (
          <button
            key={subTab.id}
            onClick={() => onSubTabChange(subTab.id)}
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
  );
};

export default SubTabGrid;
