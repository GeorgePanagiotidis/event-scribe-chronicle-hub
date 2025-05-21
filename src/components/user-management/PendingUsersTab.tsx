
import React from 'react';
import { UserRole } from '@/contexts/auth/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserTable from './UserTable';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

interface PendingUsersTabProps {
  pendingUsers: UserData[];
  onRoleChange: (userId: string, role: UserRole) => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const PendingUsersTab: React.FC<PendingUsersTabProps> = ({
  pendingUsers,
  onRoleChange,
  onApprove,
  onReject,
  onResetPassword,
  onDeleteUser
}) => {
  return (
    <Card>
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle>Εκκρεμείς Εγκρίσεις</CardTitle>
        <CardDescription>Χρήστες που περιμένουν έγκριση</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <UserTable
          users={pendingUsers}
          isPendingTable={true}
          onRoleChange={onRoleChange}
          onApprove={onApprove}
          onReject={onReject}
          onResetPassword={onResetPassword}
          onDeleteUser={onDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default PendingUsersTab;
