
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Event, getEvents } from '@/services/eventService';
import { toast } from 'sonner';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        
        // Sort events by date, newest first
        const sortedEvents = [...data].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Calculate events by day
  const today = new Date();
  const todayEvents = events.filter(event => 
    format(event.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const recentEvents = events.slice(0, 5);

  const eventsCreatedByUser = events.filter(event => 
    event.createdById === user?.id
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            className="bg-event-blue-600 hover:bg-event-blue-700"
            onClick={() => navigate('/events/new')}
          >
            Add New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-event-blue-700">Today's Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{todayEvents.length}</div>
              <p className="text-muted-foreground mt-2">Events scheduled for today</p>
            </CardContent>
            <CardFooter className="border-t bg-blue-50 p-2">
              <Link to="/calendar" className="text-sm text-event-blue-600 hover:underline w-full text-center">
                View Calendar
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-event-blue-700">Your Reports</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{eventsCreatedByUser.length}</div>
              <p className="text-muted-foreground mt-2">Events created by you</p>
            </CardContent>
            <CardFooter className="border-t bg-blue-50 p-2">
              <Link to="/calendar" className="text-sm text-event-blue-600 hover:underline w-full text-center">
                View Your Reports
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-event-blue-700">Total Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{events.length}</div>
              <p className="text-muted-foreground mt-2">Events in the system</p>
            </CardContent>
            <CardFooter className="border-t bg-blue-50 p-2">
              <Button variant="ghost" className="text-sm text-event-blue-600 hover:text-event-blue-700 w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-blue-50 p-6 flex flex-col items-center justify-center md:w-48">
                        <CalendarIcon className="h-8 w-8 text-event-blue-500 mb-2" />
                        <div className="text-lg font-bold">{format(event.date, 'MMM d, yyyy')}</div>
                        <div>{event.time}</div>
                      </div>
                      
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <Link 
                            to={`/events/${event.id}`} 
                            className="text-xl font-semibold hover:text-event-blue-600"
                          >
                            {event.title}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                            Created by {event.createdBy}
                          </div>
                        </div>
                        
                        <p className="line-clamp-2">{event.description}</p>
                        
                        <div className="mt-4 flex justify-end">
                          <Link to={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No events found</p>
                  <Button onClick={() => navigate('/events/new')} className="mt-4">
                    Create Your First Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
