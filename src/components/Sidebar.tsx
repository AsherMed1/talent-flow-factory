import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  Users,
  Database,
  TrendingUp,
  Settings,
  Upload,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const isMobile = useIsMobile();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'roles', label: 'Job Roles', icon: Briefcase },
    { id: 'pipeline', label: 'Pipeline', icon: Users },
    { id: 'crm', label: 'Talent Vault', icon: Database },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4">
        <Avatar className="w-10 h-10">
          <AvatarFallback>HR</AvatarFallback>
        </Avatar>
        <div className="mt-2 font-semibold">HR Dashboard</div>
        <div className="text-sm text-gray-500">Your Company</div>
      </div>
      <div className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start ${activeView === item.id ? 'font-semibold' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>
      <div className="p-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Your Company
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="pl-0 pr-6">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate your dashboard and manage your HR tasks.
            </SheetDescription>
          </SheetHeader>
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-64 border-r overflow-y-auto h-screen sticky top-0">
      {renderSidebarContent()}
    </aside>
  );
};
