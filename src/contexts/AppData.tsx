/**
 * AppDataProvider — fetches "reference" data (people, vendors) once after sign-in
 * and exposes it through context. The Avatar/Sidebar components read from here
 * synchronously, so we don't pepper every render with a separate Supabase query.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { listPeople, listVendors } from '@/data/api';
import { useAuth } from '@/stores/auth';
import type { Person, Vendor } from '@/types';

interface AppDataValue {
  people: Person[];
  vendors: Vendor[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataValue>({
  people: [],
  vendors: [],
  loading: false,
  refresh: async () => {},
});

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { signedIn } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!signedIn) {
      setPeople([]);
      setVendors([]);
      return;
    }
    setLoading(true);
    try {
      const [p, v] = await Promise.all([listPeople(), listVendors()]);
      setPeople(p);
      setVendors(v);
    } catch {
      // RLS may block until session ready; ignore — next refresh will pick up.
    } finally {
      setLoading(false);
    }
  }, [signedIn]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppDataContext.Provider value={{ people, vendors, loading, refresh }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}

export function usePerson(id: string | null | undefined): Person | undefined {
  const { people } = useAppData();
  if (!id) return undefined;
  return people.find((p) => p.id === id);
}
