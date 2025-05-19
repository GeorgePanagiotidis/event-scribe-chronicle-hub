
import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarIcon, User, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { collapsed } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-primary font-medium px-3 py-2 rounded-md flex items-center"
      : "hover:bg-sidebar-accent/50 px-3 py-2 rounded-md flex items-center";

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
        <SidebarTrigger className="m-2 self-end" />

        <SidebarContent className="pt-4">
          <div className="flex flex-col items-center mb-6 space-y-2">
            <div className="relative w-12 h-12 bg-event-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="text-center">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.role || 'guest'}</p>
              </div>
            )}
          </div>

          <SidebarGroup defaultOpen>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard" className={getNavCls}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {!collapsed && <span>Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/events/new" className={getNavCls}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {!collapsed && <span>New Event</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/calendar" className={getNavCls}>
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {!collapsed && <span>Calendar</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/users" className={getNavCls}>
                        <Users className="w-5 h-5 mr-2" />
                        {!collapsed && <span>Users</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {!collapsed && (
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        )}
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b h-16 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Event Reporting System</h1>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-muted-foreground">{user?.email}</span>
            <User className="h-5 w-5" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
