
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
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

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserManagement = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' },
    { id: '3', name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and an admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if email is already in use
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast.error('Email is already in use');
      return;
    }
    
    // Add new user
    const newId = (users.length + 1).toString();
    setUsers([...users, { ...newUser, id: newId }]);
    
    // Reset form
    setNewUser({ name: '', email: '', role: 'user' });
    
    toast.success('User added successfully');
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    // Prevent changing own role
    if (userId === user?.id) {
      toast.error('You cannot change your own role');
      return;
    }
    
    // Update user role
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    
    toast.success('User role updated');
  };

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting own account
    if (userId === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    // Delete user
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted successfully');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Role</th>
                        <th className="pb-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b last:border-0">
                          <td className="py-3">{u.name}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3">
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value as 'admin' | 'user')}
                              disabled={u.id === user?.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3">
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === user?.id}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value as 'admin' | 'user' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      className="w-full bg-event-blue-600 hover:bg-event-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Adding...' : 'Add User'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
