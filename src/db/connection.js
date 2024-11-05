import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm';
import { Kysely, PostgresDialect } from 'kysely';
import * as drizzleSchema from './dbSchema';
import { kyselySchema } from './dbSchemaKysely';

// Konfigurasi Pool untuk PostgreSQL
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Konfigurasi Drizzle
export const drizzleDb = drizzle(pool, { schema: drizzleSchema });

// Konfigurasi Kysely
export const kyselyDb = new Kysely({
  dialect: new PostgresDialect({
    pool,
  }),
  schema: kyselySchema, // menggunakan schema untuk Kysely
});
