import React from "react";
import { Layout } from "@/components/Layout";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Event, deleteEvent, getEvent } from '@/services/eventService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const EventView = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        if (!id) {
          toast.error('Invalid event ID');
          navigate('/dashboard');
          return;
        }
        
        const eventData = await getEvent(id);
        if (eventData) {
          setEvent(eventData);
        } else {
          toast.error('Event not found');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to load event:', error);
        toast.error('Failed to load event details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [isAuthenticated, navigate, id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = user && event && (user.id === event.createdById || user.role === 'admin');

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Event not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
          
          {canEdit && (
            <div className="flex space-x-2">
              <Button
                variant="outline" 
                onClick={() => navigate(`/events/edit/${id}`)}
              >
                Edit Event
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Event</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event and
                      all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <Card className="shadow-lg border-2 border-blue-100">
          <CardHeader className="bg-blue-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                Created by {event.createdBy}
              </div>
            </div>
            <div className="flex items-center text-event-blue-600">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}</span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            {event.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                <p className="whitespace-pre-line">{event.notes}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Images</h3>
              {event.imageUrls && event.imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.imageUrls.map((url, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Event image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No images attached to this event</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventView;
