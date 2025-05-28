
// Environment configuration for Supabase connection
// These values will be used when connecting to your self-hosted Supabase instance

export const config = {
  // Supabase URL - will be your Docker host IP and port
  // Default for local Docker setup is http://localhost:8000
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:8000',
  
  // Supabase Anonymous Key - this is the default anon key for self-hosted setups
  // You should generate your own keys for production use
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMAs_-EmCU',
  
  // Database configuration
  database: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: import.meta.env.VITE_DB_PORT || '5432',
    name: import.meta.env.VITE_DB_NAME || 'postgres',
  },
  
  // Storage configuration for file uploads
  storage: {
    bucketName: 'event-images',
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
};

// Helper function to validate environment setup
export const validateEnvironment = () => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using default values for development');
  }
  
  return missing.length === 0;
};
