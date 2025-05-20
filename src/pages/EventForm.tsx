
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useEvents } from "@/hooks/use-events";

// We're importing the existing EventForm component
const EventFormContent = React.lazy(() => 
  import("@/components/EventFormContent").catch(() => {
    // This is a fallback in case the import fails
    return { default: () => <div>Loading form content...</div> };
  })
);

const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEvents();

  // If we're editing, make sure the event exists
  if (id && !events?.find(event => event.id === id)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <PageHeader title="ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ" />
      
      <div className="container mx-auto p-4">
        <React.Suspense fallback={<div>Loading form...</div>}>
          <EventFormContent eventId={id} />
        </React.Suspense>
      </div>
    </Layout>
  );
};

export default EventForm;
