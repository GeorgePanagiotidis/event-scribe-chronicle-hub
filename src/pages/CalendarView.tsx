import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";

// Add this type to ensure we can use category property
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  category?: string;
  // ... other properties
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { events } = useEvents();
  
  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    
    events?.forEach((event) => {
      const dateString = format(new Date(event.date), 'yyyy-MM-dd');
      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      grouped[dateString].push(event as Event);
    });
    
    return grouped;
  }, [events]);
  
  // Get events for selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate[dateString] || [];
  }, [selectedDate, eventsByDate]);
  
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
  
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Calendar View</h1>
        
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events for this date.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
