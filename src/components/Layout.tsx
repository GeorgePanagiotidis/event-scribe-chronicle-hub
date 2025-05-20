
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Calendar, Users, Settings, Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkBackground from "@/components/NetworkBackground";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { open, setOpen } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Network Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <NetworkBackground />
      </div>
      
      <div className="flex h-full relative z-10">
        {/* Sidebar for Desktop */}
        <Sidebar
          className="border-r bg-sidebar/80 backdrop-blur-sm"
        >
          <SidebarHeader>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary text-white">
                <FileText size={24} />
              </div>
              <div className="font-bold">Event Reporter</div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/dashboard"}
                    tooltip="Dashboard"
                  >
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <FileText size={20} />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/events/new"}
                    tooltip="Create Event"
                  >
                    <Link to="/events/new" className="flex items-center gap-2">
                      <FileText size={20} />
                      <span>Create Event</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/calendar"}
                    tooltip="Calendar View"
                  >
                    <Link to="/calendar" className="flex items-center gap-2">
                      <Calendar size={20} />
                      <span>Calendar View</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {user?.role === "admin" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/users"}
                      tooltip="User Management"
                    >
                      <Link to="/users" className="flex items-center gap-2">
                        <Users size={20} />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user?.name || "User"}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.role || "User"}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
              >
                <Settings size={20} />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* User info and logout in top right corner */}
          <div className="bg-transparent p-2 flex justify-end items-center z-20">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-white hidden md:block">
                {user?.name || "User"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-white/20"
              >
                <LogOut size={18} className="mr-1" />
                <span className="hidden md:inline">Αποσύνδεση</span>
              </Button>
            </div>
          </div>

          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between bg-background/60 backdrop-blur-sm p-4 md:hidden">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                  <FileText size={18} />
                </div>
                <div className="font-bold">Event Reporter</div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
              >
                <Menu size={20} />
              </Button>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
