#!/usr/bin/env node
/**
 * Clears all demo / seed data from Supabase, leaving the schema and admin@gmail.com intact.
 *
 *   - DELETE all projects (cascades to project_team, terms, tasks, expenses, payments)
 *   - DELETE all vendors
 *   - DELETE all notifications, activity_log rows
 *   - DELETE demo team auth users (faisal/mohammed/ahmad/yousef/sara) — cascades to public.users
 *
 * Env vars required:
 *   DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import pg from 'pg';
const { Client } = pg;

function need(name) { const v = process.env[name]; if (!v) { console.error(`Missing ${name}`); process.exit(1); } return v; }

const DATABASE_URL = need('DATABASE_URL');
const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_KEY  = need('SUPABASE_SERVICE_ROLE_KEY');

const DEMO_EMAILS = [
  'faisal@protrack.sa',
  'mohammed@protrack.sa',
  'ahmad@protrack.sa',
  'yousef@protrack.sa',
  'sara@protrack.sa',
];
const KEEP_EMAIL = 'admin@gmail.com';

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function step(name, fn) {
  process.stdout.write(`→ ${name} ... `);
  try { const r = await fn(); console.log('OK'); return r; }
  catch (e) { console.log('FAIL'); throw e; }
}

async function deleteAuthUser(email) {
  // Look up auth user by email
  const lookup = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?filter=email.eq.${encodeURIComponent(email)}`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
  );
  const body = await lookup.json();
  const id = body.users?.[0]?.id;
  if (!id) return false;
  const del = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!del.ok) throw new Error(`Delete ${email} failed: ${del.status} ${await del.text()}`);
  return true;
}

const run = async () => {
  await step('Connect', () => client.connect());

  // Data tables — order doesn't matter because of CASCADE, but explicit is safer.
  await step('Delete expenses',       () => client.query('delete from public.expenses'));
  await step('Delete payments',       () => client.query('delete from public.payments'));
  await step('Delete tasks',          () => client.query('delete from public.tasks'));
  await step('Delete terms',          () => client.query('delete from public.terms'));
  await step('Delete project_team',   () => client.query('delete from public.project_team'));
  await step('Delete projects',       () => client.query('delete from public.projects'));
  await step('Delete vendors',        () => client.query('delete from public.vendors'));
  await step('Delete notifications',  () => client.query('delete from public.notifications'));
  await step('Delete activity_log',   () => client.query('delete from public.activity_log'));

  // Delete demo auth users via direct SQL on auth.users (cascades to public.users).
  // The admin REST API's email-filter parameter isn't reliable across versions, so SQL is safer.
  await step(`Delete demo auth users (${DEMO_EMAILS.length})`, async () => {
    const r = await client.query(
      'delete from auth.users where email = any($1::text[]) returning email',
      [DEMO_EMAILS],
    );
    console.log(`  → removed: ${r.rows.map((x) => x.email).join(', ') || '(none — already gone)'}`);
  });

  // Final counts
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
        (select count(*) from public.payments)     as payments,
        (select count(*) from public.notifications) as notifications
    `);
    console.log('\n  →', JSON.stringify(r.rows[0]).replace(/,/g, ', '));
  });

  // Confirm admin user remains
  await step('Admin user check', async () => {
    const r = await client.query(`select email, role from public.users where email = $1`, [KEEP_EMAIL]);
    if (r.rows.length === 0) throw new Error(`Admin ${KEEP_EMAIL} missing!`);
    console.log('\n  →', JSON.stringify(r.rows[0]));
  });

  await client.end();
  console.log('\n✓ DB cleared. Only the schema and admin@gmail.com remain.');
};

run().catch(async (err) => {
  console.error('\n✗ Clear failed:', err.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
