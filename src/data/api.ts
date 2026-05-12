/**
 * Supabase data API. Every component that needs data calls a function from here —
 * no component should import the Supabase client directly. This keeps RLS-aware
 * queries in one file and makes it easy to swap implementations later.
 */
import { supabase } from '@/lib/supabase';
import { formatDateArabic } from '@/lib/format';
import type {
  AppNotification, Expense, Payment, Person, Project, Task, Term, User, Vendor,
} from '@/types';

function client() {
  if (!supabase) throw new Error('Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.');
  return supabase;
}

/* =========================================================
   Row mappers — Supabase rows (snake_case) → app types
   ========================================================= */

function mapUser(row: any): User {
  return {
    id: row.id,
    personId: row.id,
    email: row.email,
    role: row.role,
    department: row.department ?? '',
    status: row.status,
    lastSeen: row.updated_at ? formatDateArabic(row.updated_at.slice(0, 10)) : '—',
  };
}

function mapPerson(row: any): Person {
  return {
    id: row.id,
    name: row.display_name,
    role: row.role,
    initials: row.initials || '··',
    color: row.color || 'var(--ink-700)',
    city: row.city ?? '',
  };
}

function mapProject(row: any, teamIds: string[], spent: number): Project {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    discipline: row.discipline,
    status: row.status,
    progress: row.progress,
    budget: Number(row.budget),
    spent,
    due: row.due_date ? formatDateArabic(row.due_date) : '',
    pm: row.pm_id ?? '',
    team: teamIds,
    client: row.client ?? '',
    location: row.location ?? '',
  };
}

function mapTerm(row: any): Term {
  return {
    id: row.id,
    project: row.project_id,
    title: row.title,
    type: row.type,
    amount: row.amount != null ? Number(row.amount) : undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    status: row.status,
    summary: row.summary,
    notes: row.notes ?? undefined,
  };
}

function mapTask(row: any): Task {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    status: row.status,
    assignee: row.assignee_id ?? '',
    due: row.due_date ? formatDateArabic(row.due_date) : '',
    priority: row.priority === 'high' ? 'high' : 'normal',
    project: row.project_id,
  };
}

function mapExpense(row: any): Expense {
  return {
    id: row.id,
    project: row.project_id,
    name: row.name,
    type: row.type,
    amount: Number(row.amount),
    date: row.date,
    vendor: row.vendor_id ?? null,
    term: row.term_id ?? null,
    method: row.method,
    invoiceNo: row.invoice_no ?? undefined,
    attachment: row.attachment_url ?? null,
    notes: row.notes ?? undefined,
  };
}

function mapPayment(row: any, vendorName: string): Payment {
  return {
    id: row.id,
    vendor: vendorName,
    project: row.project_code ?? row.project_id,
    amount: Number(row.amount),
    status: row.status,
    due: row.due_date ? formatDateArabic(row.due_date) : '—',
  };
}

function mapVendor(row: any): Vendor {
  return {
    id: row.id,
    name: row.name,
    discipline: row.discipline,
    status: row.status,
    contact: row.contact ?? '',
    projects: 0,
  };
}

function mapNotification(row: any): AppNotification {
  return {
    id: row.id,
    kind: row.kind,
    read: row.read,
    when: row.created_at ? formatDateArabic(row.created_at.slice(0, 10)) : '',
    title: row.title,
    body: row.body,
  };
}

/* =========================================================
   Current user (after Supabase auth signin)
   ========================================================= */

export async function getCurrentUserProfile(): Promise<User | null> {
  const { data: { user } } = await client().auth.getUser();
  if (!user) return null;
  const { data, error } = await client()
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !data) return null;
  return mapUser(data);
}

/* =========================================================
   Reference data: users + vendors
   ========================================================= */

export async function listUsers(): Promise<User[]> {
  const { data, error } = await client().from('users').select('*').order('display_name');
  if (error) throw error;
  return (data || []).map(mapUser);
}

export async function listPeople(): Promise<Person[]> {
  const { data, error } = await client().from('users').select('*').order('display_name');
  if (error) throw error;
  return (data || []).map(mapPerson);
}

export async function listVendors(): Promise<Vendor[]> {
  const { data: vendors, error } = await client().from('vendors').select('*').order('name');
  if (error) throw error;
  // Count active projects per vendor via payments table
  const { data: payments } = await client().from('payments').select('vendor_id');
  const counts = new Map<string, number>();
  for (const p of payments || []) {
    if (p.vendor_id) counts.set(p.vendor_id, (counts.get(p.vendor_id) || 0) + 1);
  }
  return (vendors || []).map((v) => ({ ...mapVendor(v), projects: counts.get(v.id) || 0 }));
}

/* =========================================================
   Projects (RLS does role-based filtering server-side)
   ========================================================= */

export async function listProjects(): Promise<Project[]> {
  const [projectsRes, teamRes, expensesRes] = await Promise.all([
    client().from('projects').select('*').order('created_at', { ascending: false }),
    client().from('project_team').select('project_id, user_id'),
    client().from('expenses').select('project_id, amount'),
  ]);
  if (projectsRes.error) throw projectsRes.error;
  if (teamRes.error) throw teamRes.error;
  if (expensesRes.error) throw expensesRes.error;

  const teamMap = new Map<string, string[]>();
  for (const t of teamRes.data || []) {
    const arr = teamMap.get(t.project_id) || [];
    arr.push(t.user_id);
    teamMap.set(t.project_id, arr);
  }
  const spentMap = new Map<string, number>();
  for (const e of expensesRes.data || []) {
    spentMap.set(e.project_id, (spentMap.get(e.project_id) || 0) + Number(e.amount));
  }
  return (projectsRes.data || []).map((p) =>
    mapProject(p, teamMap.get(p.id) || [], spentMap.get(p.id) || 0),
  );
}

export async function getProject(id: string): Promise<Project | null> {
  const [projRes, teamRes, expensesRes] = await Promise.all([
    client().from('projects').select('*').eq('id', id).maybeSingle(),
    client().from('project_team').select('user_id').eq('project_id', id),
    client().from('expenses').select('amount').eq('project_id', id),
  ]);
  if (projRes.error || !projRes.data) return null;
  const teamIds = (teamRes.data || []).map((t) => t.user_id);
  const spent = (expensesRes.data || []).reduce((s, e) => s + Number(e.amount), 0);
  return mapProject(projRes.data, teamIds, spent);
}

/* =========================================================
   Terms (بنود المشروع)
   ========================================================= */

export async function listTerms(projectId: string): Promise<Term[]> {
  const { data, error } = await client()
    .from('terms')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at');
  if (error) throw error;
  return (data || []).map(mapTerm);
}

export async function createTerm(t: Omit<Term, 'id'>): Promise<Term> {
  const { data, error } = await client()
    .from('terms')
    .insert({
      project_id: t.project,
      title: t.title,
      type: t.type,
      amount: t.amount ?? null,
      start_date: t.startDate ?? null,
      end_date: t.endDate ?? null,
      status: t.status,
      summary: t.summary,
      notes: t.notes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTerm(data);
}

export async function updateTerm(t: Term): Promise<Term> {
  const { data, error } = await client()
    .from('terms')
    .update({
      title: t.title,
      type: t.type,
      amount: t.amount ?? null,
      start_date: t.startDate ?? null,
      end_date: t.endDate ?? null,
      status: t.status,
      summary: t.summary,
      notes: t.notes ?? null,
    })
    .eq('id', t.id)
    .select()
    .single();
  if (error) throw error;
  return mapTerm(data);
}

export async function deleteTerm(id: string): Promise<void> {
  const { error } = await client().from('terms').delete().eq('id', id);
  if (error) throw error;
}

/* =========================================================
   Expenses (مصروفات المشروع) — priority module
   ========================================================= */

export async function listExpenses(projectId?: string): Promise<Expense[]> {
  let q = client().from('expenses').select('*').order('date', { ascending: false });
  if (projectId) q = q.eq('project_id', projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(mapExpense);
}

export async function createExpense(e: Omit<Expense, 'id'>): Promise<Expense> {
  const { data, error } = await client()
    .from('expenses')
    .insert({
      project_id: e.project,
      name: e.name,
      type: e.type,
      amount: e.amount,
      date: e.date,
      vendor_id: e.vendor || null,
      term_id: e.term || null,
      method: e.method,
      invoice_no: e.invoiceNo || null,
      attachment_url: e.attachment || null,
      notes: e.notes || null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapExpense(data);
}

export async function updateExpense(e: Expense): Promise<Expense> {
  const { data, error } = await client()
    .from('expenses')
    .update({
      name: e.name,
      type: e.type,
      amount: e.amount,
      date: e.date,
      vendor_id: e.vendor || null,
      term_id: e.term || null,
      method: e.method,
      invoice_no: e.invoiceNo || null,
      attachment_url: e.attachment || null,
      notes: e.notes || null,
    })
    .eq('id', e.id)
    .select()
    .single();
  if (error) throw error;
  return mapExpense(data);
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await client().from('expenses').delete().eq('id', id);
  if (error) throw error;
}

/* =========================================================
   Tasks
   ========================================================= */

export async function listTasks(projectId?: string): Promise<Task[]> {
  let q = client().from('tasks').select('*').order('created_at', { ascending: false });
  if (projectId) q = q.eq('project_id', projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(mapTask);
}

/* =========================================================
   Payments (invoices)
   ========================================================= */

export async function listPayments(projectId?: string): Promise<Payment[]> {
  let q = client()
    .from('payments')
    .select('id, project_id, vendor_id, amount, status, due_date, vendors(name), projects(code)')
    .order('due_date', { ascending: false });
  if (projectId) q = q.eq('project_id', projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    vendor: row.vendors?.name ?? '',
    project: row.projects?.code ?? '',
    amount: Number(row.amount),
    status: row.status,
    due: row.due_date ? formatDateArabic(row.due_date) : '—',
  }));
}

/* =========================================================
   Notifications
   ========================================================= */

export async function listNotifications(): Promise<AppNotification[]> {
  const { data, error } = await client()
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapNotification);
}

/* =========================================================
   Auth helpers
   ========================================================= */

export async function signIn(email: string, password: string) {
  const { data, error } = await client().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await client().auth.signOut();
}
