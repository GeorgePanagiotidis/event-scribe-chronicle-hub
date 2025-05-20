
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PageHeaderProps {
  title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Top Banner with background image */}
      <div 
        className="w-full bg-cover bg-center h-32 flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('/assets/event-bg.jpg')",
          backgroundSize: "cover",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)"
        }}
      >
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="dashboard" asChild>
                <Link to="/dashboard" className="px-4">Αρχική</Link>
              </TabsTrigger>
              <TabsTrigger value="events" asChild>
                <Link to="/events/new" className="px-4">Συμβάντα</Link>
              </TabsTrigger>
              <TabsTrigger value="calendar" asChild>
                <Link to="/calendar" className="px-4">Ημερολόγιο</Link>
              </TabsTrigger>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <TabsTrigger value="contact" className="px-4">Επικοινωνία</TabsTrigger>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Στοιχεία Επικοινωνίας</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={18} />
                      <span>Τηλ.Επικοινωνίας 841-4365</span>
                    </div>
                    <div className="pl-6">
                      <p>Επχίας (ΔΒ) Παναγιωτίδης Γεώργιος</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
