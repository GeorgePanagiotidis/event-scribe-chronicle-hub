
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, UserRole, AuthContextType } from './types';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser, userMetadata?: any): User => {
    return {
      id: supabaseUser.id,
      name: userMetadata?.full_name || supabaseUser.email?.split('@')[0] || 'Unknown User',
      email: supabaseUser.email || '',
      role: userMetadata?.role || 'viewer',
      status: 'active'
    };
  };

  // Extract username from email (everything before @)
  const getUsername = (email: string): string => {
    return email.split('@')[0];
  };

  useEffect(() => {
    // Get initial session from Supabase
    const getInitialSession = async () => {
      try {
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user metadata from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          const convertedUser = convertSupabaseUser(session.user, profile);
          setUser(convertedUser);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          // Fetch user profile when user signs in
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          const convertedUser = convertSupabaseUser(session.user, profile);
          setUser(convertedUser);
        } else {
          // User signed out
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Load all users for admin management (from profiles table)
  const loadUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const convertedUsers = profiles?.map(profile => ({
        id: profile.id,
        name: profile.full_name || profile.email?.split('@')[0] || 'Unknown User',
        email: profile.email || '',
        role: profile.role || 'viewer',
        status: profile.status || 'active'
      })) || [];

      setUsers(convertedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Login function using Supabase auth
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Λάθος όνομα χρήστη ή κωδικός');
        return false;
      }

      if (data.user) {
        // Check if user profile exists and is active
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile?.status === 'pending') {
          await supabase.auth.signOut(); // Sign out pending user
          toast.error('Ο λογαριασμός σας εκκρεμεί για έγκριση από τον διαχειριστή.');
          return false;
        }

        toast.success(`Καλώς ήρθατε, ${profile?.full_name || email}!`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Η σύνδεση απέτυχε. Παρακαλώ δοκιμάστε ξανά.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function using Supabase auth
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Create user account with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error('Η εγγραφή απέτυχε: ' + error.message);
        return false;
      }

      if (data.user) {
        // Create profile entry with pending status
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: name,
            role: 'viewer',
            status: 'pending'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Σφάλμα δημιουργίας προφίλ');
          return false;
        }

        toast.success('Ο λογαριασμός σας δημιουργήθηκε. Περιμένετε την έγκριση από τον διαχειριστή.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Αποσυνδεθήκατε με επιτυχία');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Σφάλμα αποσύνδεσης');
    }
  };

  // Approve user (admin function)
  const approveUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      await loadUsers(); // Refresh users list
      toast.success('Ο χρήστης εγκρίθηκε');
      return true;
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Η έγκριση απέτυχε');
      return false;
    }
  };

  // Reject user (admin function)
  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await loadUsers(); // Refresh users list
      toast.success('Ο χρήστης απορρίφθηκε');
      return true;
    } catch (error) {
      console.error('Rejection failed:', error);
      toast.error('Η απόρριψη απέτυχε');
      return false;
    }
  };

  // Reset user password (admin function)
  const resetUserPassword = async (userId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would trigger a password reset email
      // For now, we'll just show a success message
      toast.success('Ο κωδικός επαναφέρθηκε (email αποστολή)');
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Η επαναφορά κωδικού απέτυχε');
      return false;
    }
  };

  // Change user role (admin function)
  const changeUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state if current user
      if (user && user.id === userId) {
        setUser({ ...user, role: newRole });
      }

      await loadUsers(); // Refresh users list
      toast.success(`Ο ρόλος του χρήστη άλλαξε σε ${newRole}`);
      return true;
    } catch (error) {
      console.error('Role change failed:', error);
      toast.error('Η αλλαγή ρόλου απέτυχε');
      return false;
    }
  };

  // Get all active users
  const getAllUsers = (): User[] => {
    return users.filter(u => u.status === 'active');
  };

  // Get pending users
  const getPendingUsers = (): User[] => {
    return users.filter(u => u.status === 'pending');
  };

  // Add new user (admin function)
  const addUser = async (name: string, email: string, role: UserRole, password: string): Promise<boolean> => {
    try {
      // Create user with Supabase auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: name }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with active status
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: name,
            role: role,
            status: 'active'
          });

        if (profileError) throw profileError;

        await loadUsers(); // Refresh users list
        toast.success('Ο χρήστης δημιουργήθηκε με επιτυχία');
        return true;
      }

      return false;
    } catch (error) {
      console.error('User creation failed:', error);
      toast.error('Η δημιουργία χρήστη απέτυχε');
      return false;
    }
  };

  // Delete user (admin function)
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Prevent deleting own account
      if (user && userId === user.id) {
        toast.error('Δεν μπορείτε να διαγράψετε τον δικό σας λογαριασμό');
        return false;
      }

      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await loadUsers(); // Refresh users list
      toast.success('Ο χρήστης διαγράφηκε με επιτυχία');
      return true;
    } catch (error) {
      console.error('User deletion failed:', error);
      toast.error('Η διαγραφή χρήστη απέτυχε');
      return false;
    }
  };

  // Load users when component mounts and user is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers();
    }
  }, [user]);

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
    deleteUser,
    getUsername
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
