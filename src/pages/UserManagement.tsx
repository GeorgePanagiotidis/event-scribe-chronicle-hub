import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole, User } from '@/contexts/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import ActiveUsersTab from '@/components/user-management/ActiveUsersTab';
import PendingUsersTab from '@/components/user-management/PendingUsersTab';
import AddUserTab from '@/components/user-management/AddUserTab';

interface UserData extends User {}

const UserManagement = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    user, 
    getAllUsers, 
    getPendingUsers,
    approveUser,
    rejectUser,
    changeUserRole,
    resetUserPassword,
    deleteUser,
    addUser
  } = useAuth();
  const navigate = useNavigate();
  
  const [activeUsers, setActiveUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'viewer' as UserRole,
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Check if user is authenticated and an admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast.error('Δεν έχετε δικαιώματα πρόσβασης σε αυτή τη σελίδα');
      navigate('/dashboard');
    }
    
    // Load users
    loadUsers();
  }, [isAuthenticated, isAdmin, navigate]);
  
  const loadUsers = () => {
    setActiveUsers(getAllUsers());
    setPendingUsers(getPendingUsers());
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }
    
    setIsLoading(true);
    
    const success = await addUser(
      newUser.name,
      newUser.email,
      newUser.role,
      newUser.password
    );
    
    if (success) {
      // Reset form
      setNewUser({ name: '', email: '', role: 'viewer', password: '' });
      // Reload users
      loadUsers();
    }
    
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Prevent changing own role
    if (userId === user?.id) {
      toast.error('Δεν μπορείτε να αλλάξετε τον δικό σας ρόλο');
      return;
    }
    
    const success = await changeUserRole(userId, newRole);
    if (success) {
      loadUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      loadUsers();
    }
  };
  
  const handleApproveUser = async (userId: string) => {
    const success = await approveUser(userId);
    if (success) {
      loadUsers();
    }
  };
  
  const handleRejectUser = async (userId: string) => {
    const success = await rejectUser(userId);
    if (success) {
      loadUsers();
    }
  };
  
  const handleResetPassword = async (userId: string) => {
    const success = await resetUserPassword(userId);
    if (success) {
      toast.success('Ο κωδικός επαναφέρθηκε με επιτυχία');
    }
  };

  return (
    <Layout>
      <PageHeader title="Διαχείριση Χρηστών" />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Ενεργοί Χρήστες</TabsTrigger>
            <TabsTrigger value="pending">Εκκρεμείς Εγκρίσεις</TabsTrigger>
            <TabsTrigger value="add">Προσθήκη Χρήστη</TabsTrigger>
          </TabsList>
          
          {/* Active Users Tab */}
          <TabsContent value="active">
            <ActiveUsersTab 
              activeUsers={activeUsers}
              currentUserId={user?.id}
              onRoleChange={handleRoleChange}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          {/* Pending Users Tab */}
          <TabsContent value="pending">
            <PendingUsersTab 
              pendingUsers={pendingUsers}
              onRoleChange={handleRoleChange}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          {/* Add User Tab */}
          <TabsContent value="add">
            <AddUserTab 
              newUser={newUser}
              setNewUser={setNewUser}
              onSubmit={handleAddUser}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagement;
