// Run migration against Supabase using the Management API
// Usage: node scripts/run-migration.mjs

const SUPABASE_URL = "https://depztempjsdlpnfcjxir.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHp0ZW1wanNkbHBuZmNqeGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTQwNiwiZXhwIjoyMDkyMDM1NDA2fQ.fldUtbH9jF6F1-Z-oKEp15xp1WSB4VsXnMm44n2olqE"

const PROJECT_REF = "depztempjsdlpnfcjxir"

const SQL = `
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  site TEXT NOT NULL DEFAULT 'gaming-posters',
  option1_name TEXT DEFAULT 'Size',
  option1_value TEXT,
  option2_name TEXT DEFAULT 'Frame',
  option2_value TEXT,
  sku TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  compare_at_price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  barcode TEXT,
  weight_grams INTEGER,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id, site);

ALTER TABLE posters ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE posters ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;

ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;

ALTER TABLE guides ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;
`

// Split into individual statements and run via supabase-js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'public' }
})

// Unfortunately supabase-js doesn't support raw SQL.
// Let's use the Supabase Management API instead.
// The Management API endpoint for SQL is:
// POST https://api.supabase.com/v1/projects/{ref}/database/query

// But that requires an access token. Let's try another approach:
// Use pg (postgres client) directly

import pg from 'pg'

// Get the connection string from Supabase dashboard format
const connectionString = `postgresql://postgres.${PROJECT_REF}:${process.env.SUPABASE_DB_PASSWORD || ''}@aws-0-eu-west-3.pooler.supabase.com:6543/postgres`

async function main() {
  // First, try if we have pg installed
  try {
    const client = new pg.Client({ connectionString })
    await client.connect()
    console.log('Connected to database!')

    const statements = SQL.split(';').map(s => s.trim()).filter(s => s.length > 0)
    for (const stmt of statements) {
      console.log('\nExecuting:', stmt.substring(0, 80) + '...')
      try {
        await client.query(stmt)
        console.log('  OK')
      } catch (e) {
        console.log('  Error:', e.message)
      }
    }

    await client.end()
  } catch (e) {
    console.error('Could not connect via pg:', e.message)
    console.log('\n--- Please run the following SQL in Supabase Dashboard SQL Editor ---')
    console.log(SQL)
  }
}

main()
