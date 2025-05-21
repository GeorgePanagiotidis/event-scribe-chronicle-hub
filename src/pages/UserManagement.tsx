
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

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
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle>Ενεργοί Χρήστες</CardTitle>
                <CardDescription>Διαχείριση λογαριασμών και δικαιωμάτων</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ονοματεπώνυμο</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ρόλος</TableHead>
                      <TableHead>Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          Δεν υπάρχουν ενεργοί χρήστες
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeUsers.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value as UserRole)}
                              disabled={u.id === user?.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Επιλέξτε ρόλο" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Διαχειριστής</SelectItem>
                                <SelectItem value="editor">Συντάκτης</SelectItem>
                                <SelectItem value="viewer">Αναγνώστης</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(u.id)}
                              disabled={u.id === user?.id}
                            >
                              Επαναφορά κωδικού
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === user?.id}
                            >
                              Διαγραφή
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pending Users Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle>Εκκρεμείς Εγκρίσεις</CardTitle>
                <CardDescription>Χρήστες που περιμένουν έγκριση</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ονοματεπώνυμο</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ρόλος</TableHead>
                      <TableHead>Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          Δεν υπάρχουν εκκρεμείς εγκρίσεις
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingUsers.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value as UserRole)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Επιλέξτε ρόλο" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Διαχειριστής</SelectItem>
                                <SelectItem value="editor">Συντάκτης</SelectItem>
                                <SelectItem value="viewer">Αναγνώστης</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveUser(u.id)}
                              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            >
                              Έγκριση
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectUser(u.id)}
                            >
                              Απόρριψη
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Add User Tab */}
          <TabsContent value="add">
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle>Προσθήκη Νέου Χρήστη</CardTitle>
                <CardDescription>Δημιουργία νέου λογαριασμού χρήστη</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ονοματεπώνυμο</Label>
                    <Input 
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="πχ. Επχίας Παπαδόπουλος Κωνσταντίνος"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="example@mail.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Κωδικός</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Ρόλος</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε ρόλο" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Διαχειριστής</SelectItem>
                        <SelectItem value="editor">Συντάκτης</SelectItem>
                        <SelectItem value="viewer">Αναγνώστης</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Προσθήκη...' : 'Προσθήκη Χρήστη'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagement;
