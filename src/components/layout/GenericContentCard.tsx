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
  children?: React.ReactNode;
}

const GenericContentCard = ({ activeSubTab, subTabs, description, children }: GenericContentCardProps) => {
  const currentTab = subTabs.find((t) => t.id === activeSubTab);
  const Icon = currentTab?.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#2A9D8F]">
      <div className="flex items-center gap-4 pb-6 border-b border-[#E9ECEF]">
        {Icon && (
          <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#2A9D8F]" />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-semibold text-[#264653]">
            {currentTab?.label}
          </h3>
          <p className="text-sm text-[#6C757D]">
            {description} {currentTab?.label.toLowerCase()}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        {children ? children : (
          <div className="text-center py-12">
            <p className="text-[#6C757D]">Content for {currentTab?.label} will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericContentCard;
