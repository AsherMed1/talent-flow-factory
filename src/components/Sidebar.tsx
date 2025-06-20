
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  X,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: '/', label: 'Dashboard', icon: BarChart, path: '/' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    { id: 'video-library', label: 'Video Library', icon: Video, path: '/video-library' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
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
              className={`w-full justify-start h-12 ${location.pathname === item.path ? 'bg-gray-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => handleNavigation(item.path)}
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
