
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { Event } from "@/services/eventService";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const { events } = useEvents();
  
  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    
    events?.forEach((event) => {
      const dateString = format(new Date(event.date), 'yyyy-MM-dd');
      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      grouped[dateString].push(event);
    });
    
    return grouped;
  }, [events]);
  
  // Get events for selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate[dateString] || [];
  }, [selectedDate, eventsByDate]);
  
  // Handle viewing a specific event
  const viewEvent = () => {
    setShowCalendar(false);
    setCurrentEventIndex(0);
  };
  
  // Go to next event
  const goToNextEvent = () => {
    if (currentEventIndex < selectedDateEvents.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    }
  };
  
  // Go back to calendar
  const goBackToCalendar = () => {
    setShowCalendar(true);
  };
  
  // Generate content for calendar days with events
  const getDayContent = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateString];
    
    if (!dayEvents?.length) return null;
    
    return (
      <div className="w-full flex justify-center">
        <Badge variant="outline" className="absolute bottom-1 w-5 h-1 rounded-sm bg-primary" />
      </div>
    );
  };
  
  // Get current event
  const currentEvent = selectedDateEvents[currentEventIndex];
  
  return (
    <Layout>
      <PageHeader title="ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ" />
      
      <div className="container mx-auto p-4 md:p-6">
        {showCalendar ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="bg-card text-card-foreground shadow-lg rounded-lg p-4 lg:col-span-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                components={{
                  DayContent: ({ date }) => (
                    <>
                      <span>{date.getDate()}</span>
                      {getDayContent(date)}
                    </>
                  ),
                }}
                className="rounded-md border"
              />
            </div>
            
            {/* Events for Selected Date */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
              </h2>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          {event.category && (
                            <Badge variant={event.category === 'critical' ? 'destructive' : 'outline'}>
                              {event.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1">{event.description}</p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {event.location && <p>📍 {event.location}</p>}
                        </div>
                        <div className="mt-3">
                          <Button onClick={viewEvent}>View Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events for this date.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Event Detail View */}
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" onClick={goBackToCalendar}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Back to Calendar
              </Button>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm text-muted-foreground">
                  Event {currentEventIndex + 1} of {selectedDateEvents.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToNextEvent}
                  disabled={currentEventIndex >= selectedDateEvents.length - 1}
                >
                  Next Event
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {currentEvent && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{currentEvent.title}</h2>
                    {currentEvent.category && (
                      <Badge variant={currentEvent.category === 'critical' ? 'destructive' : 'outline'}>
                        {currentEvent.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-1">Description</h3>
                      <p>{currentEvent.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-1">Time</h3>
                        <p>{currentEvent.time}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Location</h3>
                        <p>{currentEvent.location || 'No location specified'}</p>
                      </div>
                    </div>
                    
                    {currentEvent.notes && (
                      <div>
                        <h3 className="font-medium mb-1">Notes</h3>
                        <p>{currentEvent.notes}</p>
                      </div>
                    )}
                    
                    {currentEvent.imageUrls && currentEvent.imageUrls.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-1">Images</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {currentEvent.imageUrls.map((url, index) => (
                            <img 
                              key={index} 
                              src={url} 
                              alt={`Event image ${index + 1}`}
                              className="rounded-md border max-h-64 object-contain"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CalendarView;
