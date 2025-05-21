
import { format } from 'date-fns';

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

// Mock event data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2025, 4, 19), // May 19, 2025
    time: '09:00',
    endTime: '10:00',
    description: 'Weekly team sync meeting to discuss project progress',
    notes: 'Remember to prepare status report',
    imageUrls: ['/placeholder.svg'],
    createdBy: 'Admin User',
    createdById: '1',
    location: 'ΕΦ ΠΛΑΓΙΕΣ',
    category: 'meeting'
  },
  {
    id: '2',
    title: 'System Maintenance',
    date: new Date(2025, 4, 19), // May 19, 2025
    time: '14:30',
    endTime: '15:30',
    description: 'Scheduled maintenance of the server infrastructure',
    notes: 'Expected downtime: 1 hour',
    imageUrls: ['/placeholder.svg'],
    createdBy: 'Admin User',
    createdById: '1',
    location: 'ΕΦ ΓΕΜΙΣΤΗΣ',
    category: 'critical'
  },
  {
    id: '3',
    title: 'Client Presentation',
    date: new Date(2025, 4, 20), // May 20, 2025
    time: '11:00',
    endTime: '12:00',
    description: 'Presentation of the new product features to the client',
    notes: 'Make sure to prepare demo environment',
    imageUrls: ['/placeholder.svg'],
    createdBy: 'Regular User',
    createdById: '2',
    location: 'ΕΠΟΧΟΥΜΕΝΟ',
    category: 'presentation'
  }
];

// Service methods
export const getEvents = async (): Promise<Event[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_EVENTS];
};

export const getEvent = async (id: string): Promise<Event | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_EVENTS.find(event => event.id === id) || null;
};

export const getEventsByDate = async (date: Date): Promise<Event[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  return MOCK_EVENTS.filter(event => 
    format(event.date, 'yyyy-MM-dd') === formattedDate
  );
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newEvent: Event = {
    ...eventData,
    id: `${MOCK_EVENTS.length + 1}`,
  };
  
  // In a real app, we would add this to the database
  // For this demo, we're just returning it (the state will be managed in the components)
  
  return newEvent;
};

export const updateEvent = async (id: string, eventData: Omit<Event, 'id'>): Promise<Event> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, we would update the database
  // For this demo, we're just returning the updated event
  
  return {
    ...eventData,
    id,
  };
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, we would delete from the database
  // For this demo, we're just returning success
  
  return true;
};

export const getDatesWithEvents = async (startDate: Date, endDate: Date): Promise<Date[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get unique dates that have events
  const dates = new Set(MOCK_EVENTS.map(event => format(event.date, 'yyyy-MM-dd')));
  
  return Array.from(dates).map(dateStr => new Date(dateStr));
};
