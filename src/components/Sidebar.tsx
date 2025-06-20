import { useState } from 'react';
import { 
  BarChart, 
  Briefcase, 
  Users, 
  FileText, 
  ClipboardList,
  Upload, 
  Database, 
  TrendingUp, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'roles', label: 'Job Roles', icon: Briefcase },
    { id: 'pipeline', label: 'Candidate Pipeline', icon: Users },
    { id: 'interview-notes', label: 'Interview Notes', icon: FileText },
    { id: 'interview-guides', label: 'Interview Guides', icon: ClipboardList },
    { id: 'import', label: 'Import Candidates', icon: Upload },
    { id: 'crm', label: 'Talent Vault', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <aside className={`
      ${isMobile ? 'fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300' : 'w-64 flex-shrink-0 bg-gray-50 border-r'}
      ${isMobile ? (isMenuOpen ? 'translate-x-0' : '-translate-x-full') : ''}
    `}>
      {isMobile && (
        <div className="p-4 flex justify-end">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">TalentTracker</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your recruitment process</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div key={item.id} className="px-2 py-1">
            <Button
              variant="ghost"
              className={`w-full justify-start h-12 ${activeView === item.id ? 'bg-gray-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => {
                setActiveView(item.id);
                if (isMobile) {
                  setIsMenuOpen(false);
                }
              }}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          </div>
        ))}
      </nav>
      {isMobile && !isMenuOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow">
          <Button className="w-full" onClick={toggleMenu}>
            <Menu className="w-4 h-4 mr-2" />
            Open Menu
          </Button>
        </div>
      )}
    </aside>
  );
};
