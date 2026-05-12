/**
 * AppDataProvider — fetches "reference" data (people, vendors, disciplines) once
 * after sign-in and exposes it through context. Components that need this data
 * read from here synchronously instead of re-querying Supabase on every render.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { listDisciplines, listPeople, listVendors, type Discipline } from '@/data/api';
import { useAuth } from '@/stores/auth';
import type { Person, Vendor } from '@/types';

interface AppDataValue {
  people: Person[];
  vendors: Vendor[];
  disciplines: Discipline[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataValue>({
  people: [],
  vendors: [],
  disciplines: [],
  loading: false,
  refresh: async () => {},
});

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { signedIn } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!signedIn) {
      setPeople([]);
      setVendors([]);
      setDisciplines([]);
      return;
    }
    setLoading(true);
    try {
      const [p, v, d] = await Promise.all([listPeople(), listVendors(), listDisciplines()]);
      setPeople(p);
      setVendors(v);
      setDisciplines(d);
    } catch {
      // RLS may block until session ready; ignore — next refresh will pick up.
    } finally {
      setLoading(false);
    }
  }, [signedIn]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppDataContext.Provider value={{ people, vendors, disciplines, loading, refresh }}>
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
