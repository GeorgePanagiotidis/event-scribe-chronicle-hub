
import React from 'react';
import { UserRole } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  role: UserRole;
  status: string;
}

interface UserTableProps {
  users: UserData[];
  currentUserId?: string;
  isPendingTable?: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  isPendingTable = false,
  onRoleChange,
  onApprove,
  onReject,
  onResetPassword,
  onDeleteUser
}) => {
  return (
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
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              {isPendingTable ? 'Δεν υπάρχουν εκκρεμείς εγκρίσεις' : 'Δεν υπάρχουν ενεργοί χρήστες'}
            </TableCell>
          </TableRow>
        ) : (
          users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => onRoleChange(user.id, value as UserRole)}
                  disabled={user.id === currentUserId}
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
                {isPendingTable ? (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove && onApprove(user.id)}
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      Έγκριση
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject && onReject(user.id)}
                    >
                      Απόρριψη
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => onResetPassword(user.id)}
                      disabled={user.id === currentUserId}
                    >
                      Επαναφορά κωδικού
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteUser(user.id)}
                      disabled={user.id === currentUserId}
                    >
                      Διαγραφή
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
