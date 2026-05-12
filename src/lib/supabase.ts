/**
 * Supabase client placeholder.
 *
 * Real Supabase credentials are read from env vars (see .env.example):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Until those are set, this module exports `supabase = null` and the app
 * falls back to the mock data layer in `src/data/`. To switch over:
 *   1. fill in the env vars in .env.local
 *   2. update src/data/* repositories to call supabase.from('table').select(...)
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseEnabled = supabase !== null;
