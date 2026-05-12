import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile } from '@/data/api';
import type { Role, User } from '@/types';

interface AuthState {
  signedIn: boolean;
  bootstrapped: boolean;
  role: Role | null;
  personId: string | null;
  profile: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /** Called once on app mount to restore an existing Supabase session. */
  bootstrap: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  signedIn: false,
  bootstrapped: false,
  role: null,
  personId: null,
  profile: null,

  bootstrap: async () => {
    if (!supabase) { set({ bootstrapped: true }); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const profile = await getCurrentUserProfile();
      set({
        signedIn: true,
        role: profile?.role ?? null,
        personId: profile?.id ?? null,
        profile,
      });
    }
    set({ bootstrapped: true });

    // Listen for future session changes (sign-in / sign-out elsewhere)
    supabase.auth.onAuthStateChange(async (_event, sess) => {
      if (sess) {
        const profile = await getCurrentUserProfile();
        set({
          signedIn: true,
          role: profile?.role ?? null,
          personId: profile?.id ?? null,
          profile,
        });
      } else {
        set({ signedIn: false, role: null, personId: null, profile: null });
      }
    });
  },

  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await getCurrentUserProfile();
    set({
      signedIn: true,
      role: profile?.role ?? null,
      personId: profile?.id ?? null,
      profile,
    });
  },

  signOut: async () => {
    // Use scope: 'local' to clear the session immediately without waiting
    // on a server round-trip — the server-side token will expire on its own.
    // We also catch any error so local state is always cleared.
    try {
      if (supabase) await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn('supabase.auth.signOut failed (clearing local state anyway):', err);
    }
    set({ signedIn: false, role: null, personId: null, profile: null });
  },

  refreshProfile: async () => {
    const profile = await getCurrentUserProfile();
    set({
      role: profile?.role ?? get().role,
      personId: profile?.id ?? get().personId,
      profile,
    });
  },
}));
