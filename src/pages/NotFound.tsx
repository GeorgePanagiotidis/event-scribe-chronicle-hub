
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * NotFound - 404 error page component
 * 
 * This component:
 * - Displays when a user attempts to access a non-existent route
 * - Logs the attempted route to the console for debugging
 * - Provides navigation options back to valid routes
 * - Has a visually distinct design to indicate error state
 */
const NotFound = () => {
  // Get current location to log the non-existent route
  const location = useLocation();

  // Log the 404 error for debugging purposes
  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="text-center max-w-md">
        {/* Large error code for emphasis */}
        <div className="text-8xl font-bold text-event-blue-600 mb-6">404</div>
        
        {/* Error message and explanation */}
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. The page might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Navigation options */}
        <div className="space-y-4">
          {/* Primary action - go to dashboard */}
          <Button asChild className="bg-event-blue-600 hover:bg-event-blue-700 w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          
          {/* Secondary action - go to home */}
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
