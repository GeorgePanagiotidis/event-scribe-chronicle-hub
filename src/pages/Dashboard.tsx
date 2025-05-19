
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { events, isLoading } = useEvents();

  // Get today's events
  const todayEvents = React.useMemo(() => {
    if (!events?.length) return [];
    const today = format(new Date(), 'yyyy-MM-dd');
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === today
    );
  }, [events]);
  
  // Get upcoming events (next 7 days)
  const upcomingEvents = React.useMemo(() => {
    if (!events?.length) return [];
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= nextWeek;
    }).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading events...</p>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map(event => (
                    <div key={event.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming events in the next 7 days.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 flex gap-4">
          <Link to="/events/new">
            <Button>Create Event</Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline">View Calendar</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
