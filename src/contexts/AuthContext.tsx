
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  requestedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  changeUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  getAllUsers: () => User[];
  getPendingUsers: () => User[];
  addUser: (name: string, email: string, role: UserRole, password: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

// Mock users for demo purposes (would be replaced with real authentication in production)
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Editor User', email: 'editor@example.com', role: 'editor', status: 'active' },
  { id: '3', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer', status: 'active' },
  { id: '4', name: 'Pending User', email: 'pending@example.com', role: 'viewer', status: 'pending' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only set active users as authenticated
        if (parsedUser.status === 'active') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (in a real app, you'd validate password too)
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        if (foundUser.status === 'pending') {
          toast.error('Ο λογαριασμός σας εκκρεμεί για έγκριση από τον διαχειριστή.');
          return false;
        }
        
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success(`Καλώς ήρθατε, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Λάθος όνομα χρήστη ή κωδικός');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Η σύνδεση απέτυχε. Παρακαλώ δοκιμάστε ξανά.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already taken
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Το email χρησιμοποιείται ήδη');
        return false;
      }
      
      // Create new user with pending status
      const newUser: User = {
        id: `${users.length + 1}`,
        name,
        email,
        role: 'viewer', // Default role
        status: 'pending' // New users need approval
      };
      
      // Add to users array
      setUsers([...users, newUser]);
      
      toast.success('Ο λογαριασμός σας δημιουργήθηκε. Περιμένετε την έγκριση από τον διαχειριστή.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Αποσυνδεθήκατε με επιτυχία');
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    try {
      // Find user and update status
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: 'active' as const } : u
      );
      
      setUsers(updatedUsers);
      toast.success('Ο χρήστης εγκρίθηκε');
      return true;
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Η έγκριση απέτυχε');
      return false;
    }
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      // Remove user from the list
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Ο χρήστης απορρίφθηκε');
      return true;
    } catch (error) {
      console.error('Rejection failed:', error);
      toast.error('Η απόρριψη απέτυχε');
      return false;
    }
  };

  const resetUserPassword = async (userId: string): Promise<boolean> => {
    try {
      // In a real app, this would generate a new password or a reset link
      toast.success('Ο κωδικός επαναφέρθηκε');
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Η επαναφορά κωδικού απέτυχε');
      return false;
    }
  };

  const changeUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      // Update user role
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      
      setUsers(updatedUsers);
      
      // If the current user is being updated, update the current user state too
      if (user && user.id === userId) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success(`Ο ρόλος του χρήστη άλλαξε σε ${newRole}`);
      return true;
    } catch (error) {
      console.error('Role change failed:', error);
      toast.error('Η αλλαγή ρόλου απέτυχε');
      return false;
    }
  };

  const getAllUsers = (): User[] => {
    return users.filter(u => u.status === 'active');
  };

  const getPendingUsers = (): User[] => {
    return users.filter(u => u.status === 'pending');
  };

  const addUser = async (name: string, email: string, role: UserRole, password: string): Promise<boolean> => {
    try {
      // Check if email is already in use
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Το email χρησιμοποιείται ήδη');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `${users.length + 1}`,
        name,
        email,
        role,
        status: 'active' // Users created by admin are automatically active
      };
      
      setUsers([...users, newUser]);
      toast.success('Ο χρήστης δημιουργήθηκε με επιτυχία');
      return true;
    } catch (error) {
      console.error('User creation failed:', error);
      toast.error('Η δημιουργία χρήστη απέτυχε');
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Prevent deleting own account
      if (user && userId === user.id) {
        toast.error('Δεν μπορείτε να διαγράψετε τον δικό σας λογαριασμό');
        return false;
      }
      
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Ο χρήστης διαγράφηκε με επιτυχία');
      return true;
    } catch (error) {
      console.error('User deletion failed:', error);
      toast.error('Η διαγραφή χρήστη απέτυχε');
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    canEdit: user?.role === 'admin' || user?.role === 'editor',
    approveUser,
    rejectUser,
    resetUserPassword,
    changeUserRole,
    getAllUsers,
    getPendingUsers,
    addUser,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
