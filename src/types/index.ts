export type Role = 'admin' | 'pm' | 'engineer' | 'finance' | 'vendor';

export type ProjectStatus = 'progress' | 'review' | 'risk' | 'blocked' | 'completed';
export type TaskStatus = 'todo' | 'progress' | 'review' | 'done';
export type Discipline = 'مدني' | 'كهربائي' | 'ميكانيكي' | 'إنشاءات' | 'صيانة' | 'خدمة فنية';

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  city: string;
}

export interface User {
  id: string;
  personId: string;
  email: string;
  role: Role;
  department: string;
  status: 'active' | 'invited' | 'suspended';
  lastSeen: string;
}

export interface Vendor {
  id: string;
  name: string;
  discipline: string;
  status: 'active' | 'awaiting' | 'prequalified' | 'suspended';
  contact: string;
  projects: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  discipline: Discipline | string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  due: string;
  pm: string;
  team: string[];
  client: string;
  location: string;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  due: string;
  priority: 'normal' | 'high';
  project: string;
}

export interface Payment {
  id: string;
  vendor: string;
  project: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  due: string;
}

export interface Term {
  id: number;
  project: string;
  title: string;
  type: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  status: 'planned' | 'in_progress' | 'done' | 'on_hold';
  summary: string;
  notes?: string;
}

export interface Expense {
  id: string;
  project: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  vendor?: string | null;
  term?: number | null;
  method: 'cash' | 'bank_transfer' | 'cheque' | 'card';
  invoiceNo?: string;
  attachment?: string | null;
  notes?: string;
}

export interface ActivityItem {
  actor: string;
  verb: string;
  target: string;
  when: string;
}

export interface AppNotification {
  id: string;
  kind: 'finance' | 'project' | 'task' | 'mention' | 'vendor' | 'system';
  read: boolean;
  when: string;
  title: string;
  body: string;
}

export interface ProjectFinanceSummary {
  budget: number;
  termsTotal: number;
  expensesTotal: number;
  paid: number;
  remaining: number;
  spendPercent: number;
  difference: number;
  paymentStatus: 'healthy' | 'tight' | 'over';
  lastExpense?: Expense;
}
