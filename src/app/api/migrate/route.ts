import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const TABLES_TO_CHECK = [
  'product_variants',
  'collections',
  'discounts',
  'channels',
  'campaigns',
  'blog_posts',
  'pages',
  'themes',
  'locations',
  'analytics_events',
]

export async function GET() {
  const checks: Record<string, boolean> = {}

  await Promise.all(
    TABLES_TO_CHECK.map(async (table) => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=0`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
        })
        checks[table] = r.ok
      } catch {
        checks[table] = false
      }
    })
  )

  const allReady = Object.values(checks).every(v => v)

  let migration_sql: string | undefined
  if (!allReady) {
    try {
      migration_sql = readFileSync(join(process.cwd(), 'scripts/migrate-all-tables.sql'), 'utf-8')
    } catch {
      migration_sql = '-- Could not read migration file. Run scripts/migrate-all-tables.sql manually.'
    }
  }

  return NextResponse.json({
    all_ready: allReady,
    checks,
    ...(allReady ? {} : { migration_sql }),
  })
}
