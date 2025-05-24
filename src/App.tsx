
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EventForm from "./pages/EventForm";
import EventView from "./pages/EventView";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import CalendarView from "./pages/CalendarView";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/auth";

/**
 * Initialize the React Query client for data fetching
 */
const queryClient = new QueryClient();

/**
 * App - Root application component
 * 
 * This component:
 * - Sets up global providers for authentication, data fetching, UI components
 * - Configures the application routing
 * - Establishes the foundation for the entire application
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Authentication provider for user management across the app */}
    <AuthProvider>
      {/* UI component providers */}
      <TooltipProvider>
        <Toaster /> {/* Toast notifications from shadcn/ui */}
        <Sonner /> {/* Additional toast system from sonner */}
        <BrowserRouter>
          {/* Sidebar provider for responsive layout */}
          <SidebarProvider>
            {/* Application routes */}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Authenticated routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events/new" element={<EventForm />} />
              <Route path="/events/edit/:id" element={<EventForm />} />
              <Route path="/events/:id" element={<EventView />} />
              <Route path="/calendar" element={<CalendarView />} />
              
              {/* Admin routes */}
              <Route path="/users" element={<UserManagement />} />
              
              {/* 404 fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
