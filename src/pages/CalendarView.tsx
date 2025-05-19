
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker, DayProps } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/services/eventService';
import { useNavigate } from 'react-router-dom';

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  // Helper functions for dates
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  // Get events for the selected date
  const selectedDateEvents = events?.filter(event => 
    event.date && isSameDay(new Date(event.date), date)
  ) || [];

  // Get unique dates with events
  const datesWithEvents = events?.reduce<Date[]>((acc, event) => {
    if (event.date) {
      const eventDate = new Date(event.date);
      if (!acc.some(date => isSameDay(date, eventDate))) {
        acc.push(eventDate);
      }
    }
    return acc;
  }, []) || [];

  // Handle day click
  const handleDaySelect = (day: Date | undefined) => {
    if (day) {
      setDate(day);
    }
  };

  // Function to render events for selected date
  const renderEvents = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      );
    }

    if (selectedDateEvents.length === 0) {
      return (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">No events for this date.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {selectedDateEvents.map((event) => (
          <Card key={event.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate(`/events/${event.id}`)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.time || 'No time specified'}
                  </p>
                </div>
                <Badge variant={event.category === 'important' ? 'destructive' : 'outline'}>
                  {event.category || 'General'}
                </Badge>
              </div>
              {event.description && (
                <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Calendar day renderer with correct type for DayPicker
  const renderDay = (props: DayProps) => {
    const { date: dayDate, ...dayProps } = props;
    const isDateWithEvent = datesWithEvents.some(eventDate => isSameDay(eventDate, dayDate));
    
    return (
      <div
        {...dayProps}
        className={cn(
          dayProps.className,
          isDateWithEvent && "calendar-day-with-events"
        )}
      >
        {dayDate.getDate()}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
          {/* Calendar */}
          <div className="bg-card rounded-lg border shadow p-4">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleDaySelect}
              className="border-none"
              components={{
                Day: renderDay
              }}
              modifiers={{
                today: new Date(),
              }}
              modifiersStyles={{
                selected: { 
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))'
                },
                today: { 
                  fontWeight: 'bold',
                  border: '1px solid hsl(var(--primary))'
                }
              }}
            />
          </div>
          
          {/* Events for selected date */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                Events for {format(date, 'MMMM d, yyyy')}
              </h2>
            </div>
            
            <div className="bg-card rounded-lg border shadow p-4">
              {renderEvents()}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => navigate('/events/new')} className="bg-event-blue-600 hover:bg-event-blue-700">
                Add New Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
