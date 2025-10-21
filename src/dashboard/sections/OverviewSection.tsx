import { Building2, Users, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from '../../components/layout/SectionHeader';
import SubTabGrid from '../../components/layout/SubTabGrid';

interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const OverviewSection = ({ activeSubTab, setActiveSubTab }: { activeSubTab: string; setActiveSubTab: (tab: string) => void }) => {
  const subTabs: SubTab[] = [
    { id: 'my-branch', label: 'My Branch', icon: Building2 },
    { id: 'selected-branch', label: 'Selected Branch', icon: Users },
    { id: 'all-bank-system', label: 'All Bank System', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'my-branch':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">My Branch Overview</h3>
                <p className="text-slate-600">View statistics and details for your assigned branch</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">Branch-specific information and metrics will be displayed here.</p>
            </div>
          </div>
        );

      case 'selected-branch':
        return (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Selected Branch Overview</h3>
                <p className="text-slate-600">View details for a specific branch you select</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">Selected branch information and analytics will be displayed here.</p>
            </div>
          </div>
        );

      case 'all-bank-system':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Bank System Overview</h3>
                <p className="text-slate-600">View comprehensive statistics for the entire banking system</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">System-wide metrics and analytics will be displayed here.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <SectionHeader title="Overview" description="View system and branch statistics at a glance" />
      
      <SubTabGrid subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />

      <div className="bg-white rounded-xl border border-slate-200">
        {renderContent()}
      </div>
    </div>
  );
};

export default OverviewSection;
