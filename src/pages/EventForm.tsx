import React from "react";
import { Layout } from "@/components/Layout";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Event, createEvent, getEvent, updateEvent } from '@/services/eventService';
import { toast } from 'sonner';

const EventForm = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const loadEvent = async () => {
        try {
          const eventData = await getEvent(id!);
          if (eventData) {
            setTitle(eventData.title);
            setDescription(eventData.description);
            setDate(new Date(eventData.date));
            setTime(eventData.time);
            setNotes(eventData.notes);
            setImageUrls(eventData.imageUrls || []);
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

      loadEvent();
    }
  }, [isAuthenticated, navigate, id, isEditMode]);

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    // For this demo, we'll just add a placeholder image URL
    setImageUrls([...imageUrls, '/placeholder.svg']);
    toast.success('Image uploaded successfully!');
  };

  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: Omit<Event, 'id'> = {
        title,
        description,
        date,
        time,
        notes,
        imageUrls,
        createdBy: user?.name || 'Unknown User',
        createdById: user?.id || 'unknown'
      };

      if (isEditMode) {
        await updateEvent(id!, eventData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(eventData);
        toast.success('Event created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading event details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Update the details of your existing event' 
              : 'Fill in the details to create a new event report'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Basic information about the event</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the event"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input 
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information or observations"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle>Images</CardTitle>
              <CardDescription>Attach relevant images to this event</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleImageUpload}
                >
                  Upload Image
                </Button>
              </div>
              
              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Event image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No images attached to this event yet
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              className="bg-event-blue-600 hover:bg-event-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EventForm;
