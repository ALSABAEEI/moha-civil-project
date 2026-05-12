import { create } from 'zustand';
import type { Role } from '@/types';

interface AuthState {
  signedIn: boolean;
  role: Role | null;
  /** Person id from PEOPLE mock — identifies "me" for filtering assigned projects/tasks. */
  personId: string | null;
  signIn: () => void;
  setRole: (role: Role, personId?: string) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  signedIn: false,
  role: null,
  personId: null,
  signIn: () => set({ signedIn: true }),
  setRole: (role, personId) =>
    set({ role, personId: personId ?? defaultPersonForRole(role) }),
  signOut: () => set({ signedIn: false, role: null, personId: null }),
}));

function defaultPersonForRole(role: Role): string {
  switch (role) {
    case 'admin': return 'na';
    case 'pm': return 'fa';
    case 'engineer': return 'ms';
    case 'finance': return 'sl';
    case 'vendor': return 'ah';
  }
}
