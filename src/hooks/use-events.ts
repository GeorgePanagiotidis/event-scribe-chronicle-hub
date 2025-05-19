
import { useState, useEffect } from "react";
import { getEvents, Event } from "@/services/eventService";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch events"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
