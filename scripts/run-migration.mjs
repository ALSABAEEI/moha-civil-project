#!/usr/bin/env node
/**
 * Run any migration file against Supabase Postgres.
 * Usage:  node scripts/run-migration.mjs supabase/migrations/0002_disciplines.sql
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/run-migration.mjs <sql-file>'); process.exit(1); }
const url = process.env.DATABASE_URL;
if (!url) { console.error('Missing DATABASE_URL'); process.exit(1); }

const sql = readFileSync(resolve(file), 'utf8');
const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

(async () => {
  await client.connect();
  console.log(`→ Running ${file}...`);
  await client.query(sql);
  console.log('✓ Done');
  await client.end();
})().catch(async (e) => { console.error('✗', e.message); try { await client.end(); } catch {} process.exit(1); });
