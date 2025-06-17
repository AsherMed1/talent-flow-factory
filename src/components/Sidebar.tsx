
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Briefcase, 
  GitBranch, 
  Users, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { useApplicationStats } from '@/hooks/useApplications';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: stats } = useApplicationStats();
  const isMobile = useIsMobile();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'roles', 
      label: 'Job Roles', 
      icon: Briefcase,
      badge: null
    },
    { 
      id: 'pipeline', 
      label: 'Pipeline', 
      icon: GitBranch,
      badge: stats?.activeApplications || 0
    },
    { 
      id: 'interview-notes', 
      label: 'Interview Notes', 
      icon: FileText,
      badge: null
    },
    { 
      id: 'crm', 
      label: 'Talent Vault', 
      icon: Users,
      badge: null
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp,
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      badge: null
    },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white h-screen shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } border-r border-gray-200`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">Hiring Hub</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <div className="flex items-center w-full">
                <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "destructive"}
                        className="ml-2"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
