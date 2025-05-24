
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import NetworkBackground from '@/components/NetworkBackground';

/**
 * Login - User authentication component
 * 
 * This component handles:
 * - User login with username and password
 * - Form validation
 * - Authentication state management
 * - Redirecting authenticated users
 * - Rendering login form with visual feedback
 */
const Login = () => {
  // State for form fields and submission state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Authentication context and navigation
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - prevents accessing login when already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Form submission handler
   * Validates inputs, manages loading state, attempts authentication
   * and handles navigation upon success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Input validation
    if (!username || !password) {
      toast.error('Παρακαλώ συμπληρώστε όνομα χρήστη και κωδικό');
      return;
    }

    // Handle submission state for UI feedback
    setIsSubmitting(true);
    
    try {
      // Attempt login and navigate on success
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      // Reset submission state regardless of outcome
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative p-4">
      {/* Animated background for visual appeal */}
      <NetworkBackground />
      
      <div className="w-full max-w-md z-10">
        {/* Header with application title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ</h1>
          <p className="text-white/70 mt-2">Είσοδος στην εφαρμογή</p>
        </div>
        
        {/* Login form card with translucent effect */}
        <Card className="border border-white/10 bg-white/10 backdrop-blur-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Είσοδος</CardTitle>
            <CardDescription className="text-white/70">Συνδεθείτε στον λογαριασμό σας</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Username field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Όνομα Χρήστη</Label>
                <Input 
                  id="username"
                  type="text" 
                  placeholder="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              
              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Κωδικός</Label>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Demo account information */}
              <div className="text-sm text-white/70">
                <p>Δοκιμαστικοί λογαριασμοί:</p>
                <p>- Admin: admin@example.com (οποιοσδήποτε κωδικός)</p>
                <p>- User: user@example.com (οποιοσδήποτε κωδικός)</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              {/* Submit button with loading state */}
              <Button 
                type="submit" 
                className="w-full bg-white text-blue-900 hover:bg-blue-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Σύνδεση...' : 'Είσοδος'}
              </Button>
              
              {/* Registration link */}
              <div className="text-center text-sm text-white">
                Δεν έχετε λογαριασμό;{' '}
                <Link to="/register" className="text-white hover:text-white/90 font-medium">
                  Εγγραφή
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        {/* Back to home link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-white hover:text-white/90">
            ← Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
