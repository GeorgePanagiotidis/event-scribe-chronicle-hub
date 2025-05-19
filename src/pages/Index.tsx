
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect already logged in users to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-event-blue-700 mb-4">Event Reporting System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive solution for managing and tracking daily events, diary reports, and important activities within your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-event-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-event-blue-700">Daily Reports</CardTitle>
              <CardDescription>Track your daily activities efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-blue-50 rounded-md flex items-center justify-center mb-4">
                <svg className="w-20 h-20 text-event-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">Create detailed reports of events as they happen throughout your day with timestamps and important details.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-event-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-event-blue-700">Calendar View</CardTitle>
              <CardDescription>Visualize events across time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-blue-50 rounded-md flex items-center justify-center mb-4">
                <svg className="w-20 h-20 text-event-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600">Browse through events in a calendar interface, making it easy to find and review historical reports.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow">
            <CardHeader>
              <CardTitle className="text-xl">Image Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Attach images to your event reports for better context and documentation.</p>
            </CardContent>
          </Card>

          <Card className="shadow">
            <CardHeader>
              <CardTitle className="text-xl">User Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage who can view, create, and edit reports with role-based permissions.</p>
            </CardContent>
          </Card>

          <Card className="shadow">
            <CardHeader>
              <CardTitle className="text-xl">Local Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Works on your LAN for secure, fast access without internet dependencies.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center mb-6">Ready to get started?</h2>
          <div className="space-x-4">
            <Button size="lg" className="bg-event-blue-600 hover:bg-event-blue-700 text-white" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button size="lg" variant="outline" className="border-event-blue-600 text-event-blue-600" onClick={() => navigate('/register')}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
