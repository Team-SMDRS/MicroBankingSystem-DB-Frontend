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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {subTabs.map((subTab) => {
        const Icon = subTab.icon;
        const isActive = activeSubTab === subTab.id;
        const isDanger = !!subTab.danger;
        return (
          <button
            key={subTab.id}
            onClick={() => onSubTabChange(subTab.id)}
            className={`relative p-8 rounded-xl transition-all duration-300 group ${
              isActive
                ? (isDanger ? 'bg-[#E63946] shadow-lg border border-[#E63946] scale-105' : 'bg-[#2A9D8F] shadow-lg border border-[#2A9D8F] scale-105')
                : 'bg-white hover:shadow-xl hover:scale-102 shadow-md border border-[#E9ECEF]'
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? (isDanger ? 'bg-white/10' : 'bg-white/20')
                    : 'bg-[#2A9D8F] bg-opacity-10 group-hover:bg-opacity-20'
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${
                    isActive ? 'text-white' : (isDanger ? 'text-[#E63946]' : 'text-[#2A9D8F]')
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isActive ? 'text-white' : 'text-[#264653]'
                  }`}
                >
                  {subTab.label}
                </h3>
                <p
                  className={`text-sm ${
                    isActive ? 'text-white text-opacity-80' : 'text-[#6C757D]'
                  }`}
                >
                  Click to manage
                </p>
              </div>
            </div>
            {isActive && (
              <div className={`absolute inset-0 rounded-xl ${isDanger ? 'ring-2 ring-[#E63946] ring-offset-2' : 'ring-2 ring-[#2A9D8F] ring-offset-2'}`}></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SubTabGrid;
