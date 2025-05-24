
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useEvents } from "@/hooks/use-events";

/**
 * EventForm - Event creation and editing container component
 * 
 * This component:
 * - Acts as a wrapper for the actual form content
 * - Handles routing parameters for edit mode
 * - Validates that edited events exist
 * - Provides fallback UI during form loading
 * - Uses React.lazy for code splitting and performance
 */

// Lazy load the form content component for better performance
const EventFormContent = React.lazy(() => 
  import("@/components/EventFormContent").catch(() => {
    // This is a fallback in case the import fails
    return { default: () => <div>Loading form content...</div> };
  })
);

const EventForm = () => {
  // Get event ID from URL parameters (undefined for new events)
  const { id } = useParams<{ id: string }>();
  // Retrieve all events to validate the requested event exists
  const { events } = useEvents();

  // Redirect if trying to edit a non-existent event
  if (id && !events?.find(event => event.id === id)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <PageHeader title="ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ" />
      
      <div className="container mx-auto p-4">
        {/* Wrap the lazy-loaded component in a suspense boundary */}
        <React.Suspense fallback={<div>Loading form...</div>}>
          {/* Pass the event ID to the form content component */}
          <EventFormContent eventId={id} />
        </React.Suspense>
      </div>
    </Layout>
  );
};

export default EventForm;
