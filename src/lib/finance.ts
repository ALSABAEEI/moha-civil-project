import type { Expense, Payment, Project, ProjectFinanceSummary, Term } from '@/types';

/**
 * Compute the full financial summary for a project.
 * Called everywhere a finance card or KPI is shown — single source of truth so all
 * values stay consistent across Overview, Expenses, Finance tabs and KPIs.
 */
export function computeProjectFinance(
  project: Project,
  expenses: Expense[],
  terms: Term[],
  payments: Payment[],
): ProjectFinanceSummary {
  const projectExpenses = expenses.filter((e) => e.project === project.id);
  const projectTerms = terms.filter((t) => t.project === project.id);
  const projectPayments = payments.filter((p) => p.project === project.code);

  const expensesTotal = projectExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const termsTotal = projectTerms.reduce((s, t) => s + (t.amount || 0), 0);
  const paid = projectPayments
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + (p.amount || 0), 0);

  const remaining = project.budget - expensesTotal;
  const spendPercent = project.budget > 0 ? (expensesTotal / project.budget) * 100 : 0;
  const difference = project.budget - expensesTotal;

  let paymentStatus: ProjectFinanceSummary['paymentStatus'] = 'healthy';
  if (spendPercent >= 100) paymentStatus = 'over';
  else if (spendPercent >= 85) paymentStatus = 'tight';

  const lastExpense = projectExpenses
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return {
    budget: project.budget,
    termsTotal,
    expensesTotal,
    paid,
    remaining,
    spendPercent,
    difference,
    paymentStatus,
    lastExpense,
  };
}

export const EXPENSE_TYPES = [
  'مواد',
  'عمالة',
  'مقاولات من الباطن',
  'معدات',
  'نقل',
  'إيجار',
  'رسوم وتراخيص',
  'أخرى',
];

export const PAYMENT_METHODS: Record<Expense['method'], string> = {
  cash: 'نقدًا',
  bank_transfer: 'تحويل بنكي',
  cheque: 'شيك',
  card: 'بطاقة',
};

export const TERM_TYPES = [
  'أعمال كهرباء',
  'أعمال سباكة',
  'أعمال تكييف',
  'توريد مواد',
  'أعمال تركيب',
  'دفعة مقدمة',
  'دفعة عند التسليم',
  'أعمال صيانة',
  'أعمال عزل',
  'أعمال تشطيب',
  'أخرى',
];

export const TERM_STATUS_LABEL: Record<Term['status'], string> = {
  planned: 'مخطط',
  in_progress: 'قيد التنفيذ',
  done: 'منتهي',
  on_hold: 'موقوف',
};
