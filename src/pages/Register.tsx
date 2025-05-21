
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import NetworkBackground from '@/components/NetworkBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !username || !password) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Οι κωδικοί δεν ταιριάζουν');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(name, username, password);
      if (success) {
        toast.success('Ο λογαριασμός σας δημιουργήθηκε. Περιμένετε την έγκριση από τον διαχειριστή.');
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative p-4">
      {/* Network Background from home page */}
      <NetworkBackground />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">ΗΜΕΡΟΛΟΓΙΟ ΣΥΜΒΑΝΤΩΝ</h1>
          <p className="text-white/70 mt-2">Δημιουργία Λογαριασμού</p>
        </div>
        
        <Card className="border border-white/10 bg-white/10 backdrop-blur-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Εγγραφή</CardTitle>
            <CardDescription className="text-white/70">Δημιουργία νέου λογαριασμού</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Βαθμός και Ονοματεπώνυμο</Label>
                <Input 
                  id="name"
                  placeholder="πχ. Επχίας Παπαδόπουλος Κωνσταντίνος" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              
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
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Κωδικός</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Επιβεβαίωση Κωδικού</Label>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-white text-blue-900 hover:bg-blue-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Δημιουργία...' : 'Εγγραφή'}
              </Button>
              
              <div className="text-center text-sm text-white">
                Έχετε ήδη λογαριασμό;{' '}
                <Link to="/login" className="text-white hover:text-white/90 font-medium">
                  Είσοδος
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-white hover:text-white/90">
            ← Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
