
import React from "react";
import { Layout } from "@/components/Layout";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
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

/**
 * EventView - Detailed event viewing component
 * 
 * This component:
 * - Fetches and displays complete details for a single event
 * - Handles loading and error states
 * - Provides edit and delete options for authorized users
 * - Shows event metadata, description, and associated images
 * - Implements delete confirmation to prevent accidental removal
 */
const EventView = () => {
  // Authentication and navigation context
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  // Event ID from URL parameters
  const { id } = useParams<{ id: string }>();
  
  // Component state
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * On component mount:
   * - Check authentication
   * - Fetch event details by ID
   * - Handle error states with appropriate redirects
   */
  useEffect(() => {
    // Redirect unauthenticated users to login
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
        
        // Fetch event data
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

  /**
   * Event deletion handler
   * - Sets deletion state for UI feedback
   * - Calls service method to delete from backend
   * - Shows success/error feedback with toast notifications
   * - Navigates back to dashboard after successful deletion
   */
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

  // Check if current user can edit/delete this event (creator or admin)
  const canEdit = user && event && (user.id === event.createdById || user.role === 'admin');

  // Loading state UI
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading event details...</p>
        </div>
      </Layout>
    );
  }

  // Error state UI (event not found)
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
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Navigation and action buttons */}
        <div className="flex items-center justify-between">
          {/* Back button */}
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            ← Επιστροφή στην Αρχική
          </Button>
          
          {/* Edit and delete buttons (for authorized users) */}
          {canEdit && (
            <div className="flex space-x-2">
              <Button
                variant="outline" 
                onClick={() => navigate(`/events/edit/${id}`)}
              >
                Επεξεργασία
              </Button>
              
              {/* Delete confirmation dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Διαγραφή</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                    <AlertDialogDescription>
                      Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Το συμβάν και όλα τα συνδεδεμένα δεδομένα θα διαγραφούν μόνιμα.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Διαγραφή...' : 'Διαγραφή'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Event details card */}
        <Card className="shadow-lg border-2 border-blue-100">
          {/* Card header with event title, creator, and date/time */}
          <CardHeader className="bg-blue-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                <div>Καταχωρήθηκε από: {event.createdBy}</div>
                {event.location && <div>Θέση: {event.location}</div>}
              </div>
            </div>
            <div className="flex flex-col items-end text-event-blue-600">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span>{format(new Date(event.date), 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="mr-2 h-5 w-5" />
                <span>Έναρξη: {event.time}</span>
              </div>
              {event.endTime && (
                <div className="flex items-center mt-1">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Λήξη: {event.endTime}</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          {/* Card content with event details */}
          <CardContent className="pt-6 space-y-6">
            {/* Description section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Περιγραφή</h3>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Image gallery section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Εικόνες</h3>
              {event.imageUrls && event.imageUrls.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {event.imageUrls.map((url, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Event image ${index + 1}`}
                        className="w-full max-h-96 object-contain"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Δεν υπάρχουν εικόνες για αυτό το συμβάν</p>
              )}
            </div>
            
            {/* Notes section (if available) */}
            {event.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Πρόσθετες Σημειώσεις</h3>
                <p className="whitespace-pre-line">{event.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventView;
