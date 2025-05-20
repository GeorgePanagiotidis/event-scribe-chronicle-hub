
import React from "react";
import { Link } from "react-router-dom";
import { FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkBackground from "@/components/NetworkBackground";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Network Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <NetworkBackground />
      </div>
      
      <div className="flex flex-col h-full relative z-10">
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
