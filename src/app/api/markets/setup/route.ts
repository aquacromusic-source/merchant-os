import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

const MIGRATION_SQL = `-- Run this SQL in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'gaming-posters',
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  countries JSONB DEFAULT '[]',
  currency TEXT DEFAULT 'EUR',
  language TEXT DEFAULT 'fr',
  domain TEXT,
  tax_config JSONB DEFAULT '{"tax_included": true, "vat_rate": 20}',
  shipping_config JSONB DEFAULT '{}',
  payment_methods JSONB DEFAULT '["stripe"]',
  fulfillment_center TEXT,
  active_products JSONB DEFAULT '[]',
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_markets_site ON markets(site_id);`

const SITES = ['gaming-posters', 'strap', 'pdf-guide-store'] as const

function defaultMarkets(siteId: string) {
  const ts = Date.now()
  return [
    {
      id: `mkt_${ts}_${siteId}_fr`,
      site_id: siteId,
      name: 'France',
      code: 'FR',
      countries: ['FR'],
      currency: 'EUR',
      language: 'fr',
      domain: null,
      tax_config: { tax_included: true, vat_rate: 20 },
      shipping_config: {},
      payment_methods: ['stripe'],
      fulfillment_center: null,
      active_products: [],
      is_primary: true,
      is_active: true,
    },
    {
      id: `mkt_${ts}_${siteId}_eu`,
      site_id: siteId,
      name: 'Europe',
      code: 'EU',
      countries: ['DE', 'ES', 'IT', 'BE', 'NL', 'PT', 'AT', 'CH', 'SE', 'DK', 'FI', 'NO', 'PL', 'CZ', 'RO', 'HU', 'GR', 'HR', 'IE', 'LU'],
      currency: 'EUR',
      language: 'multi',
      domain: null,
      tax_config: { tax_included: true, vat_rate: 20 },
      shipping_config: {},
      payment_methods: ['stripe'],
      fulfillment_center: null,
      active_products: [],
      is_primary: false,
      is_active: true,
    },
    {
      id: `mkt_${ts}_${siteId}_gb`,
      site_id: siteId,
      name: 'Royaume-Uni',
      code: 'GB',
      countries: ['GB'],
      currency: 'GBP',
      language: 'en',
      domain: null,
      tax_config: { tax_included: true, vat_rate: 20 },
      shipping_config: {},
      payment_methods: ['stripe'],
      fulfillment_center: null,
      active_products: [],
      is_primary: false,
      is_active: true,
    },
    {
      id: `mkt_${ts}_${siteId}_usca`,
      site_id: siteId,
      name: 'Etats-Unis & Canada',
      code: 'US-CA',
      countries: ['US', 'CA'],
      currency: 'USD',
      language: 'en',
      domain: null,
      tax_config: { tax_included: false, vat_rate: 0 },
      shipping_config: {},
      payment_methods: ['stripe'],
      fulfillment_center: null,
      active_products: [],
      is_primary: false,
      is_active: false,
    },
  ]
}

// GET /api/markets/setup — check if markets table exists
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/markets?limit=0`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    const tableExists = res.ok

    let marketCount = 0
    if (tableExists) {
      const countRes = await fetch(`${SUPABASE_URL}/rest/v1/markets?select=id`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'count=exact',
        },
      })
      marketCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0')
    }

    return NextResponse.json({
      table_exists: tableExists,
      market_count: marketCount,
      ...(tableExists ? {} : { migration_sql: MIGRATION_SQL }),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, table_exists: false }, { status: 500 })
  }
}

// POST /api/markets/setup — seed default markets for all 3 sites
export async function POST() {
  try {
    // Check table first
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/markets?limit=0`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!checkRes.ok) {
      return NextResponse.json({
        error: 'Table does not exist. Run the migration SQL first.',
        migration_sql: MIGRATION_SQL,
      }, { status: 400 })
    }

    const allMarkets = SITES.flatMap(site => defaultMarkets(site))

    const res = await fetch(`${SUPABASE_URL}/rest/v1/markets`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=representation,resolution=ignore-duplicates',
      },
      body: JSON.stringify(allMarkets),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({
      success: true,
      created: Array.isArray(data) ? data.length : 0,
      markets: data,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
