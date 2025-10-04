import type { LucideIcon } from 'lucide-react';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface GenericContentCardProps {
  activeSubTab: string;
  subTabs: SubTab[];
  description: string;
}

const GenericContentCard = ({ activeSubTab, subTabs, description }: GenericContentCardProps) => {
  const currentTab = subTabs.find((t) => t.id === activeSubTab);
  const Icon = currentTab?.icon;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
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
            {description} {currentTab?.label.toLowerCase()}
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-center py-12">
        <p className="text-slate-500">Content for {currentTab?.label} will be implemented here.</p>
      </div>
    </div>
  );
};

export default GenericContentCard;
