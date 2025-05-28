
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { DatabaseEvent } from '@/lib/supabase';

// Event interface for the frontend
export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  description: string;
  notes: string;
  imageUrls: string[];
  createdBy: string;
  createdById: string;
  location?: string;
  category?: string;
  position?: string;
}

// Convert database event to frontend event format
const convertDatabaseEventToEvent = async (dbEvent: DatabaseEvent): Promise<Event> => {
  // Get creator name from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', dbEvent.created_by)
    .single();

  // Get event images
  const { data: images } = await supabase
    .from('event_images')
    .select('image_url')
    .eq('event_id', dbEvent.id)
    .order('created_at', { ascending: true });

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: new Date(dbEvent.date),
    time: dbEvent.start_time,
    endTime: dbEvent.end_time,
    description: dbEvent.description,
    notes: dbEvent.notes || '',
    imageUrls: images?.map(img => img.image_url) || [],
    createdBy: profile?.full_name || 'Unknown User',
    createdById: dbEvent.created_by,
    location: dbEvent.location,
    position: dbEvent.position
  };
};

// Get all events from database
export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching events from Supabase...');
    
    // Fetch events from database with join to get creator info
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_created_by_fkey(full_name)
      `)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    if (!events) return [];

    // Convert database events to frontend format
    const convertedEvents = await Promise.all(
      events.map(async (event) => {
        // Get event images
        const { data: images } = await supabase
          .from('event_images')
          .select('image_url')
          .eq('event_id', event.id)
          .order('created_at', { ascending: true });

        return {
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.start_time,
          endTime: event.end_time,
          description: event.description,
          notes: event.notes || '',
          imageUrls: images?.map(img => img.image_url) || [],
          createdBy: (event.profiles as any)?.full_name || 'Unknown User',
          createdById: event.created_by,
          location: event.location,
          position: event.position
        };
      })
    );

    console.log('Successfully fetched events:', convertedEvents.length);
    return convertedEvents;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

// Get single event by ID
export const getEvent = async (id: string): Promise<Event | null> => {
  try {
    console.log('Fetching event with ID:', id);
    
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_created_by_fkey(full_name)
      `)
      .eq('id', id)
      .single();

    if (error || !event) {
      console.error('Error fetching event:', error);
      return null;
    }

    // Get event images
    const { data: images } = await supabase
      .from('event_images')
      .select('image_url')
      .eq('event_id', event.id)
      .order('created_at', { ascending: true });

    const convertedEvent = {
      id: event.id,
      title: event.title,
      date: new Date(event.date),
      time: event.start_time,
      endTime: event.end_time,
      description: event.description,
      notes: event.notes || '',
      imageUrls: images?.map(img => img.image_url) || [],
      createdBy: (event.profiles as any)?.full_name || 'Unknown User',
      createdById: event.created_by,
      location: event.location,
      position: event.position
    };

    console.log('Successfully fetched event:', convertedEvent);
    return convertedEvent;
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return null;
  }
};

// Get events by specific date
export const getEventsByDate = async (date: Date): Promise<Event[]> => {
  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log('Fetching events for date:', formattedDate);
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_created_by_fkey(full_name)
      `)
      .eq('date', formattedDate)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events by date:', error);
      throw error;
    }

    if (!events) return [];

    // Convert database events to frontend format
    const convertedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: images } = await supabase
          .from('event_images')
          .select('image_url')
          .eq('event_id', event.id)
          .order('created_at', { ascending: true });

        return {
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.start_time,
          endTime: event.end_time,
          description: event.description,
          notes: event.notes || '',
          imageUrls: images?.map(img => img.image_url) || [],
          createdBy: (event.profiles as any)?.full_name || 'Unknown User',
          createdById: event.created_by,
          location: event.location,
          position: event.position
        };
      })
    );

    console.log('Successfully fetched events for date:', convertedEvents.length);
    return convertedEvents;
  } catch (error) {
    console.error('Failed to fetch events by date:', error);
    throw error;
  }
};

// Upload image to Supabase storage
const uploadImage = async (file: File, eventId: string): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}/${Date.now()}.${fileExt}`;
    
    console.log('Uploading image:', fileName);
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file);

    if (error) {
      console.error('Image upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

// Create new event in database
export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  try {
    console.log('Creating new event:', eventData.title);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Insert event into database
    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: format(eventData.date, 'yyyy-MM-dd'),
        start_time: eventData.time,
        end_time: eventData.endTime,
        location: eventData.location,
        position: eventData.position,
        notes: eventData.notes,
        created_by: user.id
      })
      .select()
      .single();

    if (error || !newEvent) {
      console.error('Error creating event:', error);
      throw error;
    }

    console.log('Event created successfully:', newEvent.id);

    // Handle image uploads if any
    if (eventData.imageUrls && eventData.imageUrls.length > 0) {
      console.log('Processing image uploads...');
      // Note: In a real implementation, images would be uploaded separately
      // and their URLs stored in the event_images table
    }

    // Return the created event in frontend format
    return await getEvent(newEvent.id) as Event;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

// Update existing event in database
export const updateEvent = async (id: string, eventData: Omit<Event, 'id'>): Promise<Event> => {
  try {
    console.log('Updating event:', id);
    
    // Update event in database
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title: eventData.title,
        description: eventData.description,
        date: format(eventData.date, 'yyyy-MM-dd'),
        start_time: eventData.time,
        end_time: eventData.endTime,
        location: eventData.location,
        position: eventData.position,
        notes: eventData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedEvent) {
      console.error('Error updating event:', error);
      throw error;
    }

    console.log('Event updated successfully:', id);

    // Return the updated event in frontend format
    return await getEvent(id) as Event;
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
};

// Delete event from database
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting event:', id);
    
    // Delete event images first (cascade should handle this, but explicit is better)
    const { error: imagesError } = await supabase
      .from('event_images')
      .delete()
      .eq('event_id', id);

    if (imagesError) {
      console.error('Error deleting event images:', imagesError);
    }

    // Delete event from database
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }

    console.log('Event deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};

// Get dates that have events (for calendar view)
export const getDatesWithEvents = async (startDate: Date, endDate: Date): Promise<Date[]> => {
  try {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    
    console.log('Fetching event dates between:', start, 'and', end);
    
    const { data: events, error } = await supabase
      .from('events')
      .select('date')
      .gte('date', start)
      .lte('date', end);

    if (error) {
      console.error('Error fetching event dates:', error);
      throw error;
    }

    // Get unique dates and convert to Date objects
    const uniqueDates = Array.from(new Set(events?.map(event => event.date) || []))
      .map(dateStr => new Date(dateStr));

    console.log('Found event dates:', uniqueDates.length);
    return uniqueDates;
  } catch (error) {
    console.error('Failed to fetch event dates:', error);
    throw error;
  }
};

// Upload multiple images for an event
export const uploadEventImages = async (files: File[], eventId: string): Promise<string[]> => {
  try {
    console.log('Uploading', files.length, 'images for event:', eventId);
    
    const uploadPromises = files.map(file => uploadImage(file, eventId));
    const imageUrls = await Promise.all(uploadPromises);
    
    // Store image URLs in database
    const imageInserts = imageUrls.map(url => ({
      event_id: eventId,
      image_url: url
    }));
    
    const { error } = await supabase
      .from('event_images')
      .insert(imageInserts);
    
    if (error) {
      console.error('Error storing image URLs:', error);
      throw error;
    }
    
    console.log('Successfully uploaded and stored', imageUrls.length, 'images');
    return imageUrls;
  } catch (error) {
    console.error('Failed to upload event images:', error);
    throw error;
  }
};
