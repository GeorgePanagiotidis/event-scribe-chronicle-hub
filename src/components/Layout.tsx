
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, FileText, Users, Settings, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarResponsive,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, setIsOpen } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex h-full">
        {/* Sidebar for Desktop */}
        <SidebarResponsive
          open={isOpen}
          onOpenChange={setIsOpen}
          breakpoint="md"
          responsive="md"
          // Correct the error by using the proper type from the interface
          className="border-r bg-sidebar"
        >
          <Sidebar>
            <SidebarHeader>
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary text-white">
                  <FileText size={24} />
                </div>
                <div className="font-bold">Event Reporter</div>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              {/* Correct the error by removing "defaultOpen" prop which doesn't exist */}
              <div>
                <SidebarNav>
                  <SidebarNavItem
                    as={Link}
                    to="/dashboard"
                    icon={<FileText size={20} />}
                    label="Dashboard"
                    isActive={location.pathname === "/dashboard"}
                  />
                  <SidebarNavItem
                    as={Link}
                    to="/events/new"
                    icon={<FileText size={20} />}
                    label="Create Event"
                    isActive={location.pathname === "/events/new"}
                  />
                  <SidebarNavItem
                    as={Link}
                    to="/calendar"
                    icon={<Calendar size={20} />}
                    label="Calendar View"
                    isActive={location.pathname === "/calendar"}
                  />
                  {user?.role === "admin" && (
                    <SidebarNavItem
                      as={Link}
                      to="/users"
                      icon={<Users size={20} />}
                      label="User Management"
                      isActive={location.pathname === "/users"}
                    />
                  )}
                </SidebarNav>
              </div>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                    {user?.avatar && <AvatarImage src={user.avatar} />}
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
        </SidebarResponsive>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between border-b bg-background p-4 md:hidden">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                  <FileText size={18} />
                </div>
                <div className="font-bold">Event Reporter</div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu size={20} />
              </Button>
            </div>
          )}

          {/* Page Content */}
          <main className="h-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
