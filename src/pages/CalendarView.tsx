
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { Event, getEventsByDate, getDatesWithEvents } from '@/services/eventService';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';

const CalendarView = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [datesWithEvents, setDatesWithEvents] = useState<Date[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load dates that have events for the current month view
  useEffect(() => {
    const fetchDatesWithEvents = async () => {
      try {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        const dates = await getDatesWithEvents(start, end);
        setDatesWithEvents(dates);
      } catch (error) {
        console.error('Failed to load dates with events:', error);
      }
    };
    
    fetchDatesWithEvents();
  }, [selectedDate]);

  // Load events for the selected date
  useEffect(() => {
    const fetchEventsForDate = async () => {
      setIsLoadingEvents(true);
      try {
        const events = await getEventsByDate(selectedDate);
        setEventsForSelectedDate(events);
      } catch (error) {
        console.error('Failed to load events for date:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchEventsForDate();
  }, [selectedDate]);

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    // Check if this day has events
    const hasEvents = datesWithEvents.some(date => isSameDay(date, day));
    
    return (
      <div className={`relative ${hasEvents ? 'calendar-day-with-events' : ''}`}>
        <div>{format(day, 'd')}</div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Event Calendar</h1>
          <Button 
            className="bg-event-blue-600 hover:bg-event-blue-700"
            onClick={() => navigate('/events/new')}
          >
            Add New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="shadow border-2 border-blue-100">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Select Date</h2>
                  <p className="text-sm text-muted-foreground">
                    Days with events are marked with a dot
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border shadow pointer-events-auto"
                    components={{
                      Day: renderDay,
                    }}
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Selected date: {format(selectedDate, 'MMMM d, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow border-2 border-blue-100 h-full">
              <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b">
                <h2 className="text-xl font-semibold flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-event-blue-600" />
                  Events on {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/events/new`)}
                >
                  Add Event
                </Button>
              </div>
              
              <CardContent className="pt-6">
                {isLoadingEvents ? (
                  <div className="text-center py-10">
                    <p>Loading events...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsForSelectedDate.length > 0 ? (
                      eventsForSelectedDate.map(event => (
                        <Card key={event.id} className="shadow-sm hover:shadow transition-shadow">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link to={`/events/${event.id}`} className="text-lg font-semibold hover:text-event-blue-600">
                                  {event.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  {event.time} • Created by {event.createdBy}
                                </p>
                              </div>
                              
                              <Link to={`/events/${event.id}`}>
                                <Button variant="ghost" size="sm">View</Button>
                              </Link>
                            </div>
                            
                            <p className="mt-2 line-clamp-2">{event.description}</p>
                            
                            {event.imageUrls && event.imageUrls.length > 0 && (
                              <div className="mt-3 flex space-x-2 overflow-auto">
                                {event.imageUrls.map((url, index) => (
                                  <img 
                                    key={index}
                                    src={url} 
                                    alt={`Event image ${index + 1}`}
                                    className="w-16 h-16 rounded object-cover"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No events scheduled for this date</p>
                        <Button 
                          onClick={() => navigate('/events/new')}
                          className="mt-4"
                          variant="outline"
                        >
                          Create New Event
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
