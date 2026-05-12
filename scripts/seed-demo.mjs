#!/usr/bin/env node
/**
 * Seed demo data into Supabase:
 *   - 5 demo team members (PM, engineers, finance) with password 'demo1234'
 *   - 5 vendors
 *   - 3 projects (admin = PM, demo users on team)
 *   - Terms + tasks + expenses + payments for those projects
 *
 * Env vars required (same as setup-supabase.mjs):
 *   DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Safe to re-run — vendor/project IDs are stable and use `on conflict do nothing`.
 */
import pg from 'pg';

const { Client } = pg;

function need(name) { const v = process.env[name]; if (!v) { console.error(`Missing ${name}`); process.exit(1); } return v; }

const DATABASE_URL = need('DATABASE_URL');
const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_KEY  = need('SUPABASE_SERVICE_ROLE_KEY');

const DEMO_PW = 'demo1234';
const DEMO_USERS = [
  { email: 'faisal@protrack.sa',   name: 'فيصل الحربي',    initials: 'فح', role: 'pm',       dept: 'المشاريع',  city: 'الرياض', color: 'var(--navy-700)' },
  { email: 'mohammed@protrack.sa', name: 'محمد سالم',      initials: 'مس', role: 'engineer', dept: 'الهندسة',   city: 'الرياض', color: 'var(--teal-600)' },
  { email: 'ahmad@protrack.sa',    name: 'أحمد حسين',      initials: 'أح', role: 'engineer', dept: 'الهندسة',   city: 'جدة',    color: 'var(--blue-600)' },
  { email: 'yousef@protrack.sa',   name: 'يوسف خليل',      initials: 'يخ', role: 'engineer', dept: 'الهندسة',   city: 'الدمام', color: 'var(--ink-700)' },
  { email: 'sara@protrack.sa',     name: 'سارة اللحيدان',  initials: 'سل', role: 'finance',  dept: 'المالية',   city: 'الرياض', color: 'var(--teal-700)' },
];

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function step(name, fn) {
  process.stdout.write(`→ ${name} ... `);
  try { const r = await fn(); console.log('OK'); return r; }
  catch (e) { console.log('FAIL'); throw e; }
}

async function createOrFindUser(u) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: u.email,
      password: DEMO_PW,
      email_confirm: true,
      user_metadata: { display_name: u.name, initials: u.initials },
    }),
  });
  if (res.ok) return (await res.json()).id;
  const txt = await res.text();
  if (res.status === 422 || /already|exists/i.test(txt)) {
    const lookup = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?filter=email.eq.${encodeURIComponent(u.email)}`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
    );
    const body = await lookup.json();
    const id = body.users?.[0]?.id;
    if (!id) throw new Error(`User exists but no id returned for ${u.email}`);
    return id;
  }
  throw new Error(`${res.status}: ${txt}`);
}

const run = async () => {
  await step('Connect', () => client.connect());

  // ---- 1. Create demo users ----
  const ids = {};
  for (const u of DEMO_USERS) {
    await step(`Create user ${u.email}`, async () => {
      const id = await createOrFindUser(u);
      ids[u.email] = id;
      // Update the public.users row with display fields + role
      await client.query(
        `update public.users
            set display_name=$1, initials=$2, color=$3, role=$4, department=$5, city=$6
          where email=$7`,
        [u.name, u.initials, u.color, u.role, u.dept, u.city, u.email],
      );
    });
  }
  const admin = await client.query(`select id from public.users where email='admin@gmail.com'`);
  const adminId = admin.rows[0]?.id;
  if (!adminId) throw new Error('Admin user not found — run setup-supabase.mjs first');

  const fa = ids['faisal@protrack.sa'];
  const ms = ids['mohammed@protrack.sa'];
  const ah = ids['ahmad@protrack.sa'];
  const yk = ids['yousef@protrack.sa'];
  const sl = ids['sara@protrack.sa'];

  // ---- 2. Vendors ----
  await step('Seed vendors', async () => {
    await client.query(`
      insert into public.vendors (id, name, discipline, status, contact) values
        ('11111111-1111-1111-1111-000000000001', 'شركة نجد للأعمال الكهربائية',     'كهربائي',   'active',       '+966 11 234 5678'),
        ('11111111-1111-1111-1111-000000000002', 'الفيصل للأعمال المدنية',          'مدني',      'active',       '+966 12 567 8901'),
        ('11111111-1111-1111-1111-000000000003', 'الحديثة للأعمال الميكانيكية',     'ميكانيكي',  'awaiting',     '+966 13 890 1234'),
        ('11111111-1111-1111-1111-000000000004', 'الخليج للخدمات الفنية',           'صيانة',     'prequalified', '+966 11 456 7890'),
        ('11111111-1111-1111-1111-000000000005', 'المهندسون السعوديون للإنشاءات',    'إنشاءات',   'suspended',    '+966 13 321 6547')
      on conflict (id) do nothing
    `);
  });

  // ---- 3. Projects ----
  await step('Seed projects', async () => {
    await client.query(
      `insert into public.projects (id, code, name, discipline, status, progress, budget, due_date, pm_id, client, location, created_by) values
        ('22222222-2222-2222-2222-000000000001', 'CIV-2026-014', 'محطة الرياض الفرعية الشمالية',                'كهربائي',  'progress', 64, 1250000, '2026-06-18', $1, 'الشركة السعودية للكهرباء', 'الرياض · الحي الشمالي', $1),
        ('22222222-2222-2222-2222-000000000002', 'MNT-2026-021', 'صيانة ميناء جدة',                              'ميكانيكي', 'risk',     38,  720000, '2026-06-02', $1, 'الهيئة العامة للموانئ',    'جدة · الميناء الإسلامي', $1),
        ('22222222-2222-2222-2222-000000000003', 'CON-2025-098', 'مركز الدمام اللوجستي — المرحلة الثانية',      'إنشاءات',  'progress', 78, 4200000, '2026-09-30', $1, 'تبادل اللوجستية',          'الدمام · المدينة الصناعية', $1)
      on conflict (id) do nothing`,
      [fa],
    );
  });

  // ---- 4. Team assignments ----
  await step('Assign teams', async () => {
    const pairs = [
      ['22222222-2222-2222-2222-000000000001', adminId],
      ['22222222-2222-2222-2222-000000000001', fa],
      ['22222222-2222-2222-2222-000000000001', ms],
      ['22222222-2222-2222-2222-000000000001', ah],
      ['22222222-2222-2222-2222-000000000002', fa],
      ['22222222-2222-2222-2222-000000000002', ah],
      ['22222222-2222-2222-2222-000000000002', yk],
      ['22222222-2222-2222-2222-000000000003', fa],
      ['22222222-2222-2222-2222-000000000003', ms],
      ['22222222-2222-2222-2222-000000000003', yk],
    ];
    for (const [p, u] of pairs) {
      await client.query(`insert into public.project_team (project_id, user_id) values ($1, $2) on conflict do nothing`, [p, u]);
    }
  });

  // ---- 5. Terms ----
  await step('Seed terms', async () => {
    await client.query(
      `insert into public.terms (id, project_id, title, type, amount, start_date, end_date, status, summary, created_by) values
        ('33333333-3333-3333-3333-000000000001', '22222222-2222-2222-2222-000000000001', 'أعمال الكهرباء',          'أعمال كهرباء', 480000, '2026-03-01', '2026-06-15', 'in_progress', 'تصميم وتوريد وتركيب وتشغيل محطة فرعية جهد 33/13.8 ك.ف، شاملة المحولات وألواح التوزيع وأنظمة الحماية.', $1),
        ('33333333-3333-3333-3333-000000000002', '22222222-2222-2222-2222-000000000001', 'دفعة مقدمة 30٪',          'دفعة مقدمة',   375000, '2026-02-15', '2026-02-20', 'done',        'دفعة مقدمة 30٪ مقابل ضمان بنكي. مفعّلة بعد توقيع العقد.', $1),
        ('33333333-3333-3333-3333-000000000003', '22222222-2222-2222-2222-000000000001', 'توريد المواد الرئيسية',   'توريد مواد',   290000, '2026-03-10', '2026-05-20', 'in_progress', 'توريد الكوابل المعزولة، المحولات، وصواني التمديد حسب جدول الكميات.', $1),
        ('33333333-3333-3333-3333-000000000004', '22222222-2222-2222-2222-000000000001', 'أعمال التركيب والتشغيل',  'أعمال تركيب',  105000, '2026-04-01', '2026-06-10', 'planned',     'تركيب الأجهزة، الاختبارات الموقعية، التشغيل التجريبي، والتسليم النهائي للعميل.', $1),
        ('33333333-3333-3333-3333-000000000005', '22222222-2222-2222-2222-000000000002', 'صيانة دورية للمضخات',     'أعمال صيانة',  280000, '2026-03-15', '2026-05-30', 'in_progress', 'صيانة وقائية وتصحيحية للمضخات الرئيسية في الميناء.', $1),
        ('33333333-3333-3333-3333-000000000006', '22222222-2222-2222-2222-000000000003', 'الأعمال المدنية الإنشائية','أعمال تركيب', 1850000, '2025-12-01', '2026-08-30', 'in_progress', 'الأعمال الإنشائية الرئيسية للمستودعات والمباني الإدارية.', $1)
      on conflict (id) do nothing`,
      [adminId],
    );
  });

  // ---- 6. Tasks ----
  await step('Seed tasks', async () => {
    await client.query(
      `insert into public.tasks (id, project_id, code, title, status, assignee_id, due_date, priority, created_by) values
        ('44444444-4444-4444-4444-000000000001', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-08', 'صب أساس البلاطة — القسم ب',           'progress', $2, '2026-05-14', 'normal', $1),
        ('44444444-4444-4444-4444-000000000002', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-09', 'تسليم مخططات حديد التسليح للورشة',     'progress', $3, '2026-05-12', 'high',   $1),
        ('44444444-4444-4444-4444-000000000003', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-10', 'التنسيق مع نجد الكهربائية',           'progress', $4, '2026-05-16', 'normal', $1),
        ('44444444-4444-4444-4444-000000000004', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-06', 'تقرير فحص التربة — مختبر نجد',          'review',   $4, '2026-05-12', 'normal', $1),
        ('44444444-4444-4444-4444-000000000005', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-11', 'تحديث خطة السلامة في الموقع',          'todo',     $2, '2026-05-20', 'normal', $1),
        ('44444444-4444-4444-4444-000000000006', '22222222-2222-2222-2222-000000000001', 'CIV-2026-014 · T-04', 'تجهيز الموقع والتعبئة',                'done',     $5, '2026-05-02', 'normal', $1),
        ('44444444-4444-4444-4444-000000000007', '22222222-2222-2222-2222-000000000002', 'MNT-2026-021 · T-01', 'فحص محركات الأرصفة',                   'progress', $3, '2026-05-14', 'high',   $1),
        ('44444444-4444-4444-4444-000000000008', '22222222-2222-2222-2222-000000000003', 'CON-2025-098 · T-01', 'صب الخرسانة للمبنى الإداري',           'progress', $2, '2026-05-18', 'normal', $1)
      on conflict (id) do nothing`,
      [adminId, ms, ah, fa, yk],
    );
  });

  // ---- 7. Expenses ----
  await step('Seed expenses', async () => {
    await client.query(
      `insert into public.expenses (id, project_id, name, type, amount, date, vendor_id, term_id, method, invoice_no, created_by) values
        ('55555555-5555-5555-5555-000000000001', '22222222-2222-2222-2222-000000000001', 'توريد كوابل 25مم',           'مواد',    84500,  '2026-04-12', '11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000003', 'bank_transfer', 'NEC-2401', $1),
        ('55555555-5555-5555-5555-000000000002', '22222222-2222-2222-2222-000000000001', 'أجور مهندسي الموقع — أبريل', 'عمالة',   42000,  '2026-04-28', null,                                    null,                                    'bank_transfer', 'PR-04-26', $1),
        ('55555555-5555-5555-5555-000000000003', '22222222-2222-2222-2222-000000000001', 'استئجار رافعة لمدة شهر',     'معدات',   38000,  '2026-04-05', '11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000001', 'cheque',        'AFC-1188', $1),
        ('55555555-5555-5555-5555-000000000004', '22222222-2222-2222-2222-000000000001', 'محولات 1000 ك.ف.أ',         'مواد',    312000, '2026-05-02', '11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000003', 'bank_transfer', 'NEC-2412', $1),
        ('55555555-5555-5555-5555-000000000005', '22222222-2222-2222-2222-000000000001', 'رسوم بلدية',                 'رسوم وتراخيص', 9200, '2026-03-20', null,                                  null,                                    'card',          'GOV-554',  $1),
        ('55555555-5555-5555-5555-000000000006', '22222222-2222-2222-2222-000000000002', 'قطع غيار مضخات',             'مواد',    96750,  '2026-04-18', '11111111-1111-1111-1111-000000000003', '33333333-3333-3333-3333-000000000005', 'bank_transfer', 'MML-3302', $1),
        ('55555555-5555-5555-5555-000000000007', '22222222-2222-2222-2222-000000000002', 'فريق صيانة — أبريل',         'عمالة',   78000,  '2026-04-30', null,                                    '33333333-3333-3333-3333-000000000005', 'bank_transfer', 'PR-04-26', $1),
        ('55555555-5555-5555-5555-000000000008', '22222222-2222-2222-2222-000000000003', 'حديد تسليح — 220 طن',        'مواد',    880000, '2026-03-22', '11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000006', 'bank_transfer', 'AFC-1190', $1),
        ('55555555-5555-5555-5555-000000000009', '22222222-2222-2222-2222-000000000003', 'خرسانة جاهزة — 1400 م³',     'مواد',    540000, '2026-04-08', '11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000006', 'bank_transfer', 'AFC-1201', $1),
        ('55555555-5555-5555-5555-000000000010', '22222222-2222-2222-2222-000000000003', 'مقاولة من الباطن — السباكة', 'مقاولات من الباطن', 320000, '2026-04-21', '11111111-1111-1111-1111-000000000005', '33333333-3333-3333-3333-000000000006', 'cheque', 'SCE-887', $1)
      on conflict (id) do nothing`,
      [adminId],
    );
  });

  // ---- 8. Payments / invoices ----
  await step('Seed payments', async () => {
    await client.query(`
      insert into public.payments (id, project_id, vendor_id, amount, status, due_date) values
        ('INV-08842', '22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-000000000001', 184500, 'paid',    '2026-05-02'),
        ('INV-08843', '22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-000000000002', 312000, 'pending', '2026-05-11'),
        ('INV-08847', '22222222-2222-2222-2222-000000000002', '11111111-1111-1111-1111-000000000003',  96750, 'overdue', '2026-04-28'),
        ('INV-08851', '22222222-2222-2222-2222-000000000003', '11111111-1111-1111-1111-000000000002', 421000, 'paid',    '2026-05-03')
      on conflict (id) do nothing
    `);
  });

  await step('Final counts', async () => {
    const r = await client.query(`
      select
        (select count(*) from public.users)        as users,
        (select count(*) from public.vendors)      as vendors,
        (select count(*) from public.projects)     as projects,
        (select count(*) from public.project_team) as team_assignments,
        (select count(*) from public.terms)        as terms,
        (select count(*) from public.tasks)        as tasks,
        (select count(*) from public.expenses)     as expenses,
        (select count(*) from public.payments)     as payments
    `);
    console.log('\n  →', JSON.stringify(r.rows[0]).replace(/,/g, ', '));
  });

  await client.end();
  console.log('\n✓ Seed complete. Demo team passwords: demo1234');
};

run().catch(async (err) => {
  console.error('\n✗ Seed failed:', err.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
