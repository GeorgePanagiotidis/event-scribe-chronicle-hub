
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-event-blue-600 mb-6">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. The page might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="bg-event-blue-600 hover:bg-event-blue-700 w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
