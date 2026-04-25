import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const MIGRATION_SQL = `-- Run this SQL in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'gaming-posters',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_apps_site ON apps(site_id);`

// GET /api/apps/setup — check if apps table exists
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/apps?limit=0`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    const tableExists = res.ok

    let appCount = 0
    if (tableExists) {
      const countRes = await fetch(`${SUPABASE_URL}/rest/v1/apps?select=id`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'count=exact',
        },
      })
      appCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0')
    }

    return NextResponse.json({
      table_exists: tableExists,
      app_count: appCount,
      ...(tableExists ? {} : { migration_sql: MIGRATION_SQL }),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, table_exists: false }, { status: 500 })
  }
}

// POST /api/apps/setup — return the SQL to create the table
export async function POST() {
  return NextResponse.json({
    migration_sql: MIGRATION_SQL,
    instructions: 'Copy the SQL above and run it in Supabase Dashboard > SQL Editor.',
  })
}
