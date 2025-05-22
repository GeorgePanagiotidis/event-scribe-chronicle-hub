
export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthContextType {
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
  getUsername: (email: string) => string;
}
