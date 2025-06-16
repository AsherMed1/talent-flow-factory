
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Database, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roles', label: 'Role Templates', icon: GitBranch },
    { id: 'pipeline', label: 'Hiring Pipeline', icon: Users },
    { id: 'crm', label: 'Talent Vault', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          PatientPro Hiring
        </h1>
        <p className="text-sm text-gray-500 mt-1">Smart Hiring Platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors",
                    activeView === item.id
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Patient Pro Marketing
        </div>
      </div>
    </div>
  );
};
