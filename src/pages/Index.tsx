
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import NetworkBackground from '@/components/NetworkBackground';

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
    <div className="relative h-screen w-full overflow-hidden flex flex-col">
      {/* Animated network background */}
      <NetworkBackground />
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-4">
          {/* Main title */}
          <h1 className="mb-8 text-5xl md:text-6xl font-bold text-white text-center tracking-wider">
            ΚΕ.Ε.Η.ΕΠ
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-white">ΗΜΕΡΟΛΟΓΙΟ ΚΑΤΑΓΡΑΦΗΣ ΣΥΜΒΑΝΤΩΝ</h2>
              <p className="text-white/70 mt-2">Ασφαλής είσοδος στην εφαρμογή</p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 w-full transition-all" 
                onClick={() => navigate('/login')}
              >
                Είσοδος
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 w-full transition-all" 
                onClick={() => navigate('/register')}
              >
                Εγγραφή
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-white/50 text-sm">
            <p>Σύστημα Καταγραφής Συμβάντων 473 ΤΕΠΠ</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 py-4 px-6 text-center text-white/70 text-sm border-t border-white/10 backdrop-blur-sm bg-background/30">
        <p>Created by Επ.οπ Επχίας (ΔΒ) Παναγιωτίδης Γεώργιος</p>
      </div>
    </div>
  );
};

export default Index;
