
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/auth";

const Dashboard = () => {
  const { events, isLoading } = useEvents();
  const { isAdmin } = useAuth();

  // Get today's events
  const todayEvents = React.useMemo(() => {
    if (!events?.length) return [];
    const today = format(new Date(), 'yyyy-MM-dd');
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === today
    );
  }, [events]);

  return (
    <Layout>
      <PageHeader title="ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ" />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading events...</p>
              ) : todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map(event => (
                    <div key={event.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No events scheduled for today.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/events/new">
            <Button>Νέο Συμβάν</Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline">View Calendar</Button>
          </Link>
          {isAdmin && (
            <Link to="/users">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Διαχείριση Χρηστών</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
