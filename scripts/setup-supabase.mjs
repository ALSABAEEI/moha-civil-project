#!/usr/bin/env node
/**
 * One-shot setup script:
 *   1. Runs supabase/migrations/0001_init.sql against the project's Postgres
 *   2. Creates the admin@gmail.com auth user (email_confirm=true)
 *   3. Promotes that user to role='admin' in public.users
 *
 * Credentials are read from env vars — nothing is written to disk:
 *   DATABASE_URL                 postgresql://postgres:PASSWORD@db.<ref>.supabase.co:5432/postgres
 *   SUPABASE_URL                 https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    eyJ... (service_role secret — never commit)
 *   ADMIN_EMAIL                  admin@gmail.com
 *   ADMIN_PASSWORD               12345678
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

function need(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env var: ${name}`); process.exit(1); }
  return v;
}

const DATABASE_URL = need('DATABASE_URL');
const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_KEY  = need('SUPABASE_SERVICE_ROLE_KEY');
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PW     = process.env.ADMIN_PASSWORD || '12345678';

const sqlPath = resolve(__dirname, '..', 'supabase', 'migrations', '0001_init.sql');
const sql = readFileSync(sqlPath, 'utf8');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 60_000,
});

async function step(name, fn) {
  process.stdout.write(`→ ${name} ... `);
  try { await fn(); console.log('OK'); }
  catch (e) { console.log('FAIL'); throw e; }
}

const run = async () => {
  await step('Connect to Postgres', () => client.connect());

  await step('Run schema migration', () => client.query(sql));

  let adminId;
  await step(`Create auth user (${ADMIN_EMAIL})`, async () => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PW,
        email_confirm: true,
        user_metadata: { display_name: 'المشرف العام', initials: 'مش' },
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      // 422 with "email already exists" is OK — fetch the existing user instead
      if (txt.includes('already') || txt.includes('exists') || res.status === 422) {
        const lookup = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users?filter=email.eq.${encodeURIComponent(ADMIN_EMAIL)}`,
          { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
        );
        const body = await lookup.json();
        adminId = body.users?.[0]?.id;
        if (!adminId) throw new Error(`User exists but could not look up id. Body: ${JSON.stringify(body)}`);
        console.log(`(already existed — id ${adminId})`);
        return;
      }
      throw new Error(`Admin API ${res.status}: ${txt}`);
    }
    const data = await res.json();
    adminId = data.id;
  });

  await step('Promote to admin role', () => client.query(
    `update public.users
       set role='admin',
           display_name='المشرف العام',
           initials='مش',
           department='الإدارة',
           status='active'
     where email=$1`,
    [ADMIN_EMAIL],
  ));

  await step('Verify', async () => {
    const r = await client.query(
      `select id, email, role, display_name, department, status
         from public.users where email=$1`,
      [ADMIN_EMAIL],
    );
    if (r.rows.length === 0) throw new Error('admin row not found in public.users');
    console.log('\n  →', JSON.stringify(r.rows[0], null, 2).replace(/\n/g, '\n    '));
  });

  await step('Count tables', async () => {
    const r = await client.query(
      `select count(*)::int as n from information_schema.tables
        where table_schema='public'`,
    );
    console.log(`\n  → ${r.rows[0].n} tables in public schema`);
  });

  await client.end();
  console.log('\n✓ Setup complete. You can sign in as admin@gmail.com / 12345678.');
};

run().catch(async (err) => {
  console.error('\n✗ Setup failed:', err.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
