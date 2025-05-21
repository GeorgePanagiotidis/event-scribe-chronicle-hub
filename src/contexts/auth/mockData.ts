
import { User } from './types';

// Mock users for demo purposes (would be replaced with real authentication in production)
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Editor User', email: 'editor@example.com', role: 'editor', status: 'active' },
  { id: '3', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer', status: 'active' },
  { id: '4', name: 'Pending User', email: 'pending@example.com', role: 'viewer', status: 'pending' },
];
