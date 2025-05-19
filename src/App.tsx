
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
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events/new" element={<EventForm />} />
              <Route path="/events/edit/:id" element={<EventForm />} />
              <Route path="/events/:id" element={<EventView />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
