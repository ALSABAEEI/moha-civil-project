import type {
  ActivityItem,
  AppNotification,
  Expense,
  Payment,
  Person,
  Project,
  Role,
  Task,
  Term,
  User,
  Vendor,
} from '@/types';

export const PEOPLE: Person[] = [
  { id: 'fa', name: 'فيصل الحربي',  role: 'مدير مشروع', initials: 'فح', color: 'var(--navy-700)', city: 'الرياض' },
  { id: 'ms', name: 'محمد سالم',    role: 'مهندس',      initials: 'مس', color: 'var(--teal-600)', city: 'الرياض' },
  { id: 'ah', name: 'أحمد حسين',    role: 'مهندس',      initials: 'أح', color: 'var(--blue-600)', city: 'جدة' },
  { id: 'yk', name: 'يوسف خليل',    role: 'مهندس',      initials: 'يخ', color: 'var(--ink-700)', city: 'الدمام' },
  { id: 'na', name: 'نورة العتيبي', role: 'مسؤول',      initials: 'نع', color: 'var(--navy-800)', city: 'الرياض' },
  { id: 'sl', name: 'سارة اللحيدان',role: 'مسؤول مالي', initials: 'سل', color: 'var(--teal-700)', city: 'الرياض' },
];

export const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];

export const VENDORS: Vendor[] = [
  { id: 'nec', name: 'شركة نجد للأعمال الكهربائية', discipline: 'كهربائي',   status: 'active',       contact: '+966 11 234 5678', projects: 3 },
  { id: 'afc', name: 'الفيصل للأعمال المدنية',       discipline: 'مدني',      status: 'active',       contact: '+966 12 567 8901', projects: 5 },
  { id: 'mml', name: 'الحديثة للأعمال الميكانيكية',  discipline: 'ميكانيكي',  status: 'awaiting',     contact: '+966 13 890 1234', projects: 2 },
  { id: 'gtl', name: 'الخليج للخدمات الفنية',        discipline: 'صيانة',     status: 'prequalified', contact: '+966 11 456 7890', projects: 0 },
  { id: 'sce', name: 'المهندسون السعوديون للإنشاءات', discipline: 'إنشاءات',  status: 'suspended',    contact: '+966 13 321 6547', projects: 1 },
];

export const PROJECTS: Project[] = [
  { id: 'p1', code: 'CIV-2026-014', name: 'محطة الرياض الفرعية الشمالية',
    discipline: 'كهربائي', status: 'progress', progress: 64,
    budget: 1_250_000, spent: 837_420, due: '18 يونيو 2026',
    pm: 'fa', team: ['fa', 'ms', 'ah'], client: 'الشركة السعودية للكهرباء',
    location: 'الرياض · الحي الشمالي' },
  { id: 'p2', code: 'MNT-2026-021', name: 'صيانة ميناء جدة',
    discipline: 'ميكانيكي', status: 'risk', progress: 38,
    budget: 720_000, spent: 412_300, due: '02 يونيو 2026',
    pm: 'fa', team: ['ah', 'yk'], client: 'الهيئة العامة للموانئ',
    location: 'جدة · الميناء الإسلامي' },
  { id: 'p3', code: 'CON-2025-098', name: 'مركز الدمام اللوجستي — المرحلة الثانية',
    discipline: 'إنشاءات', status: 'progress', progress: 78,
    budget: 4_200_000, spent: 2_980_000, due: '30 سبتمبر 2026',
    pm: 'fa', team: ['ms', 'yk', 'ah'], client: 'تبادل اللوجستية',
    location: 'الدمام · المدينة الصناعية' },
  { id: 'p4', code: 'CIV-2026-007', name: 'توسعة طريق الملك سلمان',
    discipline: 'مدني', status: 'progress', progress: 22,
    budget: 6_800_000, spent: 1_120_000, due: '14 ديسمبر 2026',
    pm: 'fa', team: ['ms', 'ah', 'yk'], client: 'وزارة النقل',
    location: 'الرياض · طريق الملك سلمان' },
  { id: 'p5', code: 'TSV-2026-002', name: 'تجديد تكييف مقر أرامكو',
    discipline: 'خدمة فنية', status: 'review', progress: 92,
    budget: 940_000, spent: 871_500, due: '25 مايو 2026',
    pm: 'fa', team: ['yk', 'ms'], client: 'أرامكو السعودية',
    location: 'الظهران' },
  { id: 'p6', code: 'CIV-2025-088', name: 'محطة الخبر لمعالجة المياه',
    discipline: 'مدني', status: 'completed', progress: 100,
    budget: 3_100_000, spent: 3_018_400, due: '12 مارس 2026',
    pm: 'fa', team: ['ah', 'yk'], client: 'شركة المياه الوطنية',
    location: 'الخبر' },
  { id: 'p7', code: 'MNT-2026-031', name: 'صيانة محطة قطار الرياض رقم 12',
    discipline: 'صيانة', status: 'blocked', progress: 14,
    budget: 480_000, spent: 92_000, due: '08 يوليو 2026',
    pm: 'fa', team: ['yk'], client: 'شركة قطار الرياض',
    location: 'الرياض · المحطة 12' },
];

export const TASKS: Task[] = [
  { id: 't1', code: 'CIV-2026-014 · T-08', title: 'صب أساس البلاطة — القسم ب',           status: 'progress', assignee: 'ms', due: '14 مايو', priority: 'normal', project: 'p1' },
  { id: 't2', code: 'CIV-2026-014 · T-09', title: 'تسليم مخططات حديد التسليح للورشة',     status: 'progress', assignee: 'ah', due: '12 مايو', priority: 'high',   project: 'p1' },
  { id: 't3', code: 'CIV-2026-014 · T-10', title: 'التنسيق مع نجد الكهربائية حول المسارات',status: 'progress', assignee: 'fa', due: '16 مايو', priority: 'normal', project: 'p1' },
  { id: 't4', code: 'CIV-2026-014 · T-06', title: 'تقرير فحص التربة — مختبر نجد',          status: 'review',   assignee: 'fa', due: 'اليوم',   priority: 'normal', project: 'p1' },
  { id: 't5', code: 'CIV-2026-014 · T-11', title: 'تحديث خطة السلامة في الموقع',          status: 'todo',     assignee: 'ms', due: '20 مايو', priority: 'normal', project: 'p1' },
  { id: 't6', code: 'CIV-2026-014 · T-12', title: 'توريد حديد التسليح 22مم — 80 طن',      status: 'todo',     assignee: 'yk', due: '22 مايو', priority: 'high',   project: 'p1' },
  { id: 't7', code: 'CIV-2026-014 · T-04', title: 'تجهيز الموقع والتعبئة',                 status: 'done',     assignee: 'yk', due: '02 مايو', priority: 'normal', project: 'p1' },
  { id: 't8', code: 'CIV-2026-014 · T-05', title: 'رفع مساحي وتخطيط الحدود',               status: 'done',     assignee: 'ah', due: '06 مايو', priority: 'normal', project: 'p1' },
  { id: 't9', code: 'CIV-2026-014 · T-03', title: 'الحصول على التراخيص',                   status: 'done',     assignee: 'fa', due: '28 أبريل',priority: 'normal', project: 'p1' },
  // sprinkle a few across other projects
  { id: 't10', code: 'MNT-2026-021 · T-01', title: 'فحص محركات الأرصفة',                   status: 'progress', assignee: 'ah', due: '14 مايو', priority: 'high',   project: 'p2' },
  { id: 't11', code: 'MNT-2026-021 · T-02', title: 'استبدال خلائط الزيت',                  status: 'todo',     assignee: 'yk', due: '24 مايو', priority: 'normal', project: 'p2' },
  { id: 't12', code: 'TSV-2026-002 · T-01', title: 'استلام نهائي للوحدات الجديدة',         status: 'review',   assignee: 'ms', due: '23 مايو', priority: 'normal', project: 'p5' },
];

export const PAYMENTS: Payment[] = [
  { id: 'INV-08842', vendor: 'شركة نجد للأعمال الكهربائية',  project: 'CIV-2026-014', amount: 184500, status: 'paid',    due: '02 مايو 2026' },
  { id: 'INV-08843', vendor: 'الفيصل للأعمال المدنية',       project: 'CIV-2026-014', amount: 312000, status: 'pending', due: '11 مايو 2026' },
  { id: 'INV-08847', vendor: 'الحديثة للأعمال الميكانيكية',  project: 'MNT-2026-021', amount: 96750,  status: 'overdue', due: '28 أبريل 2026' },
  { id: 'INV-08851', vendor: 'الفيصل للأعمال المدنية',       project: 'CON-2025-098', amount: 421000, status: 'paid',    due: '03 مايو 2026' },
  { id: 'INV-08854', vendor: 'شركة نجد للأعمال الكهربائية',  project: 'CIV-2026-007', amount: 78000,  status: 'pending', due: '19 مايو 2026' },
  { id: 'INV-08858', vendor: 'الخليج للخدمات الفنية',         project: 'TSV-2026-002', amount: 142300, status: 'pending', due: '25 مايو 2026' },
  { id: 'INV-08860', vendor: 'الحديثة للأعمال الميكانيكية',  project: 'MNT-2026-031', amount: 38400,  status: 'draft',   due: '—' },
];

export const TERMS: Term[] = [
  { id: 1, project: 'p1', title: 'أعمال الكهرباء',     type: 'أعمال كهرباء', amount: 480_000, startDate: '2026-03-01', endDate: '2026-06-15', status: 'in_progress',
    summary: 'تصميم وتوريد وتركيب وتشغيل محطة فرعية جهد 33/13٫8 ك.ف، شاملة المحولات وألواح التوزيع وأنظمة الحماية.' },
  { id: 2, project: 'p1', title: 'دفعة مقدمة 30٪',     type: 'دفعة مقدمة',   amount: 375_000, startDate: '2026-02-15', endDate: '2026-02-20', status: 'done',
    summary: 'دفعة مقدمة 30٪ مقابل ضمان بنكي. مفعّلة بعد توقيع العقد.' },
  { id: 3, project: 'p1', title: 'توريد المواد الرئيسية', type: 'توريد مواد', amount: 290_000, startDate: '2026-03-10', endDate: '2026-05-20', status: 'in_progress',
    summary: 'توريد الكوابل المعزولة، المحولات، وصواني التمديد حسب جدول الكميات في عقد العميل.' },
  { id: 4, project: 'p1', title: 'أعمال التركيب والتشغيل', type: 'أعمال تركيب', amount: 105_000, startDate: '2026-04-01', endDate: '2026-06-10', status: 'planned',
    summary: 'تركيب الأجهزة، الاختبارات الموقعية، التشغيل التجريبي، والتسليم النهائي للعميل.' },
  { id: 5, project: 'p2', title: 'صيانة دورية للمضخات', type: 'أعمال صيانة', amount: 280_000, startDate: '2026-03-15', endDate: '2026-05-30', status: 'in_progress',
    summary: 'صيانة وقائية وتصحيحية للمضخات الرئيسية في الميناء، مع استبدال القطع المستهلكة.' },
  { id: 6, project: 'p3', title: 'الأعمال المدنية الإنشائية', type: 'أعمال تركيب', amount: 1_850_000, startDate: '2025-12-01', endDate: '2026-08-30', status: 'in_progress',
    summary: 'الأعمال الإنشائية الرئيسية للمستودعات والمباني الإدارية في المرحلة الثانية.' },
];

export const EXPENSES: Expense[] = [
  // p1 — محطة الرياض
  { id: 'EXP-1001', project: 'p1', name: 'توريد كوابل 25مم',           type: 'مواد',    amount: 84_500,  date: '2026-04-12', vendor: 'nec', term: 3, method: 'bank_transfer', invoiceNo: 'NEC-2401', notes: 'دفعة أولى من الكوابل المعتمدة.' },
  { id: 'EXP-1002', project: 'p1', name: 'أجور مهندسي الموقع — أبريل', type: 'عمالة',   amount: 42_000,  date: '2026-04-28', vendor: null,  term: null, method: 'bank_transfer', invoiceNo: 'PR-04-26', notes: 'رواتب فريق التنفيذ.' },
  { id: 'EXP-1003', project: 'p1', name: 'استئجار رافعة لمدة شهر',     type: 'معدات',   amount: 38_000,  date: '2026-04-05', vendor: 'afc', term: 1, method: 'cheque', invoiceNo: 'AFC-1188', notes: 'عقد إيجار شهري قابل للتمديد.' },
  { id: 'EXP-1004', project: 'p1', name: 'محولات 1000 ك.ف.أ',         type: 'مواد',    amount: 312_000, date: '2026-05-02', vendor: 'nec', term: 3, method: 'bank_transfer', invoiceNo: 'NEC-2412', notes: 'وصلت إلى الموقع — بانتظار الفحص.' },
  { id: 'EXP-1005', project: 'p1', name: 'رسوم بلدية',                  type: 'رسوم وتراخيص', amount: 9_200, date: '2026-03-20', vendor: null, term: null, method: 'card', invoiceNo: 'GOV-554', notes: '' },
  // p2 — صيانة ميناء جدة
  { id: 'EXP-2001', project: 'p2', name: 'قطع غيار مضخات',             type: 'مواد',    amount: 96_750,  date: '2026-04-18', vendor: 'mml', term: 5, method: 'bank_transfer', invoiceNo: 'MML-3302', notes: '' },
  { id: 'EXP-2002', project: 'p2', name: 'فريق صيانة — أبريل',         type: 'عمالة',   amount: 78_000,  date: '2026-04-30', vendor: null,  term: 5, method: 'bank_transfer', invoiceNo: 'PR-04-26', notes: '' },
  // p3 — مركز الدمام
  { id: 'EXP-3001', project: 'p3', name: 'حديد تسليح — 220 طن',        type: 'مواد',    amount: 880_000, date: '2026-03-22', vendor: 'afc', term: 6, method: 'bank_transfer', invoiceNo: 'AFC-1190', notes: '' },
  { id: 'EXP-3002', project: 'p3', name: 'خرسانة جاهزة — 1400 م³',     type: 'مواد',    amount: 540_000, date: '2026-04-08', vendor: 'afc', term: 6, method: 'bank_transfer', invoiceNo: 'AFC-1201', notes: '' },
  { id: 'EXP-3003', project: 'p3', name: 'مقاولة من الباطن — أعمال السباكة', type: 'مقاولات من الباطن', amount: 320_000, date: '2026-04-21', vendor: 'sce', term: 6, method: 'cheque', invoiceNo: 'SCE-887', notes: '' },
  // p5 — أرامكو
  { id: 'EXP-5001', project: 'p5', name: 'وحدات تكييف مركزي',          type: 'مواد',    amount: 690_000, date: '2026-03-15', vendor: 'mml', term: null, method: 'bank_transfer', invoiceNo: 'MML-3310', notes: '' },
];

export const ACTIVITY: ActivityItem[] = [
  { actor: 'fa', verb: 'اعتمد',        target: 'الفاتورة INV-08842 — نجد الكهربائية',       when: 'قبل 12 دقيقة' },
  { actor: 'ms', verb: 'أنهى',         target: 'المهمة T-04 تجهيز الموقع',                    when: 'قبل ساعة' },
  { actor: 'sl', verb: 'أبلغت عن',     target: 'تأخر الفاتورة INV-08847',                     when: 'قبل 3 ساعات' },
  { actor: 'ah', verb: 'رفع',          target: 'مخططات حديد التسليح للمراجعة',                when: 'قبل 5 ساعات' },
  { actor: 'na', verb: 'أضافت موردًا', target: 'الخليج للخدمات الفنية إلى المعتمدين',          when: 'أمس' },
  { actor: 'fa', verb: 'أنشأ مشروعًا', target: 'TSV-2026-002 تجديد تكييف مقر أرامكو',          when: 'قبل يومين' },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', kind: 'finance', read: false, when: 'قبل 8 دقائق',  title: 'فاتورة متأخرة',           body: 'INV-08847 من الحديثة للأعمال الميكانيكية متأخرة منذ 14 يوماً.' },
  { id: 'n2', kind: 'project', read: false, when: 'قبل 23 دقيقة', title: 'مشروع في خطر',            body: 'CIV-2026-014 تجاوز ميزانية القسم ب بنسبة 12٪.' },
  { id: 'n3', kind: 'task',    read: false, when: 'قبل ساعة',     title: 'مهمة بانتظار المراجعة',    body: 'محمد سالم رفع مخططات حديد التسليح للمراجعة.' },
  { id: 'n4', kind: 'mention', read: true,  when: 'قبل 3 ساعات',  title: 'تمت الإشارة إليك',         body: 'سارة اللحيدان أشارت إليك في تعليق على INV-08854.' },
  { id: 'n5', kind: 'vendor',  read: true,  when: 'أمس',          title: 'مورد جديد بانتظار التأهيل', body: 'الخليج للخدمات الفنية أكمل ملف التأهيل المسبق.' },
];

export const USERS: User[] = [
  { id: 'u1', personId: 'na', email: 'nora@protrack.sa',     role: 'admin',    department: 'الإدارة',    status: 'active',    lastSeen: 'الآن' },
  { id: 'u2', personId: 'fa', email: 'faisal@protrack.sa',   role: 'pm',       department: 'المشاريع',    status: 'active',    lastSeen: 'قبل 12 دقيقة' },
  { id: 'u3', personId: 'sl', email: 'sara@protrack.sa',     role: 'finance',  department: 'المالية',     status: 'active',    lastSeen: 'قبل 40 دقيقة' },
  { id: 'u4', personId: 'ms', email: 'mohammed@protrack.sa', role: 'engineer', department: 'الهندسة',     status: 'active',    lastSeen: 'قبل ساعتين' },
  { id: 'u5', personId: 'ah', email: 'ahmad@protrack.sa',    role: 'engineer', department: 'الهندسة',     status: 'invited',   lastSeen: '—' },
  { id: 'u6', personId: 'yk', email: 'yousef@protrack.sa',   role: 'engineer', department: 'الهندسة',     status: 'suspended', lastSeen: 'قبل 4 أيام' },
];

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'مسؤول',
  pm: 'مدير مشروع',
  engineer: 'مهندس',
  finance: 'مسؤول مالي',
  vendor: 'مورد',
};

export const ROLE_INFO: Record<Role, { label: string; desc: string; icon: string }> = {
  admin:    { label: 'مسؤول',        desc: 'وصول كامل لجميع المشاريع، الموردين، المهندسين، المهام والتفاصيل المالية.', icon: 'shield' },
  pm:       { label: 'مدير مشروع',   desc: 'متابعة المشاريع المعيّنة وتقدم الفِرق وتحديث المهام.', icon: 'briefcase' },
  engineer: { label: 'مهندس',        desc: 'الاطّلاع فقط على المشاريع والمهام المعيّنة لك.', icon: 'hard-hat' },
  finance:  { label: 'مسؤول مالي',   desc: 'إدارة الميزانيات، الفواتير، والمدفوعات للموردين.', icon: 'wallet' },
  vendor:   { label: 'مورد',         desc: 'وصول محدود إلى العمل المسند إليك وفواتيرك.', icon: 'truck' },
};

/** Filter projects visible to a role+person (engineers/vendors only see assigned). */
export function visibleProjects(role: Role | null, personId: string | null): Project[] {
  if (!role) return [];
  if (role === 'admin' || role === 'finance') return PROJECTS;
  if (role === 'pm') return PROJECTS.filter((p) => p.pm === personId);
  if (role === 'engineer') return PROJECTS.filter((p) => personId !== null && p.team.includes(personId));
  // vendors only see projects where their company has work — proxy via PAYMENTS.project code
  if (role === 'vendor') {
    const codes = new Set(PAYMENTS.map((p) => p.project));
    return PROJECTS.filter((p) => codes.has(p.code));
  }
  return [];
}
