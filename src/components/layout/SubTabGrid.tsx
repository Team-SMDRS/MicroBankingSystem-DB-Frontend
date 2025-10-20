import type { LucideIcon } from 'lucide-react';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
}

interface SubTabGridProps {
  subTabs: SubTab[];
  activeSubTab: string;
  onSubTabChange: (tabId: string) => void;
}

const SubTabGrid = ({ subTabs, activeSubTab, onSubTabChange }: SubTabGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
      {subTabs.map((subTab, index) => {
        const Icon = subTab.icon;
        const isActive = activeSubTab === subTab.id;
        const isDanger = !!subTab.danger;
        return (
          <button
            key={subTab.id}
            onClick={() => onSubTabChange(subTab.id)}
            style={{ animation: `scale-pop 0.4s ease-out ${index * 0.05}s both` }}
            className={`relative p-8 rounded-2xl transition-all duration-300 group transform hover:scale-105 ${
              isActive
                ? (isDanger ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/30 scale-105' : 'bg-gradient-to-br from-secondary to-secondary/80 shadow-lg shadow-secondary/30 scale-105')
                : 'bg-white hover:shadow-lg shadow-md border border-borderLight'
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? (isDanger ? 'bg-white/10' : 'bg-white/20')
                    : 'bg-gradient-to-br from-highlight/20 to-highlight/10 group-hover:from-highlight/30 group-hover:to-highlight/20'
                }`}
              >
                <Icon
                  className={`w-8 h-8 transition-transform duration-300 ${
                    isActive ? 'text-white scale-110' : (isDanger ? 'text-red-600' : 'text-secondary')
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`text-lg font-bold mb-1 ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                >
                  {subTab.label}
                </h3>
                <p
                  className={`text-sm font-medium ${
                    isActive ? (isDanger ? 'text-red-100' : 'text-white/70') : 'text-tertiary'
                  }`}
                >
                  Click to manage
                </p>
              </div>
            </div>
            {isActive && (
              <div className={`absolute inset-0 rounded-2xl ${isDanger ? 'ring-4 ring-red-400/40 ring-offset-2' : 'ring-4 ring-highlight ring-offset-2'}`}></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SubTabGrid;
