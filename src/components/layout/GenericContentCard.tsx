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
    <div className="card-base animate-scale-pop">
      <div className="flex items-center gap-4 pb-6 border-b border-borderLight">
        {Icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-highlight to-highlightHover rounded-xl flex items-center justify-center shadow-md">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-primary">
            {currentTab?.label}
          </h3>
          <p className="text-sm text-tertiary font-medium">
            {description} {currentTab?.label.toLowerCase()}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        {children ? children : (
          <div className="text-center py-12">
            <p className="text-tertiary font-medium">Content for {currentTab?.label} will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericContentCard;
