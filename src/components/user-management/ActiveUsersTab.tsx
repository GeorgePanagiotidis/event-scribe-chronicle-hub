
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

interface ActiveUsersTabProps {
  activeUsers: UserData[];
  currentUserId?: string;
  onRoleChange: (userId: string, role: UserRole) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const ActiveUsersTab: React.FC<ActiveUsersTabProps> = ({
  activeUsers,
  currentUserId,
  onRoleChange,
  onResetPassword,
  onDeleteUser
}) => {
  return (
    <Card>
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle>Ενεργοί Χρήστες</CardTitle>
        <CardDescription>Διαχείριση λογαριασμών και δικαιωμάτων</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <UserTable
          users={activeUsers}
          currentUserId={currentUserId}
          onRoleChange={onRoleChange}
          onResetPassword={onResetPassword}
          onDeleteUser={onDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default ActiveUsersTab;
