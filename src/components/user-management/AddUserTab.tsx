
import React from 'react';
import { UserRole } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddUserForm from './AddUserForm';

interface AddUserTabProps {
  newUser: {
    name: string;
    email: string;
    role: UserRole;
    password: string;
  };
  setNewUser: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    role: UserRole;
    password: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const AddUserTab: React.FC<AddUserTabProps> = ({
  newUser,
  setNewUser,
  onSubmit,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle>Προσθήκη Νέου Χρήστη</CardTitle>
        <CardDescription>Δημιουργία νέου λογαριασμού χρήστη</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <AddUserForm 
          newUser={newUser}
          setNewUser={setNewUser}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AddUserTab;
