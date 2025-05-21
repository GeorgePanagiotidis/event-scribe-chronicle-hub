
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from '@/contexts/auth/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddUserFormProps {
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

export const AddUserForm: React.FC<AddUserFormProps> = ({
  newUser,
  setNewUser,
  onSubmit,
  isLoading
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
};

export default AddUserForm;
