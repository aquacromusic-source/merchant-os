import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation,resolution=merge-duplicates',
}

const ZONES_DATA = [
  { id_suffix: 'france', name: 'France métropolitaine', countries: ['FR'] },
  { id_suffix: 'benelux', name: 'Benelux', countries: ['BE', 'NL', 'LU'] },
  { id_suffix: 'dach', name: 'Allemagne, Autriche, Suisse', countries: ['DE', 'AT', 'CH'] },
  { id_suffix: 'south-eu', name: 'Europe du Sud', countries: ['ES', 'IT', 'PT'] },
  { id_suffix: 'north-eu', name: 'Europe du Nord', countries: ['SE', 'DK', 'FI', 'NO', 'IE', 'GB'] },
  { id_suffix: 'east-eu', name: "Europe de l'Est", countries: ['PL', 'CZ', 'RO', 'HU', 'HR', 'BG', 'SK', 'SI', 'LT', 'LV', 'EE'] },
  { id_suffix: 'international', name: 'International (hors UE)', countries: ['US', 'CA', 'AU', 'JP', 'KR', 'CN'] },
]

const RATES_BY_ZONE: Record<string, { name: string; carrier: string; price: number; delivery_time: string; min_order: number; max_order: number | null }[]> = {
  france: [
    { name: 'Standard', carrier: 'Colissimo', price: 4.90, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'Chronopost', price: 9.90, delivery_time: '1-2 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Point Relais', carrier: 'Mondial Relay', price: 3.90, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Gratuit', carrier: 'Colissimo', price: 0, delivery_time: '3-5 jours ouvrés', min_order: 49, max_order: null },
  ],
  benelux: [
    { name: 'Standard', carrier: 'GLS', price: 6.90, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'DHL', price: 12.90, delivery_time: '1-2 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 jours ouvrés', min_order: 69, max_order: null },
  ],
  'dach': [
    { name: 'Standard', carrier: 'DHL', price: 7.90, delivery_time: '4-6 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'DHL Express', price: 14.90, delivery_time: '2-3 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Gratuit', carrier: 'DHL', price: 0, delivery_time: '4-6 jours ouvrés', min_order: 79, max_order: null },
  ],
  'south-eu': [
    { name: 'Standard', carrier: 'GLS', price: 8.90, delivery_time: '5-7 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'DHL', price: 15.90, delivery_time: '2-3 jours ouvrés', min_order: 0, max_order: null },
  ],
  'north-eu': [
    { name: 'Standard', carrier: 'DPD', price: 9.90, delivery_time: '5-8 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'UPS', price: 18.90, delivery_time: '2-4 jours ouvrés', min_order: 0, max_order: null },
  ],
  'east-eu': [
    { name: 'Standard', carrier: 'GLS', price: 9.90, delivery_time: '6-9 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'DHL', price: 16.90, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: null },
  ],
  international: [
    { name: 'Standard', carrier: 'La Poste', price: 14.90, delivery_time: '10-15 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Express', carrier: 'FedEx', price: 29.90, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: null },
  ],
}

const SITES = ['gaming-posters', 'strap', 'pdf-guide-store']

// GET /api/shipping/setup — check if tables exist
// POST /api/shipping/setup — seed data (tables must exist first)
export async function GET() {
  const checks: Record<string, boolean> = {}

  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/shipping_zones?limit=0`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  })
  checks.shipping_zones = r1.ok

  const r2 = await fetch(`${SUPABASE_URL}/rest/v1/shipping_rates?limit=0`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  })
  checks.shipping_rates = r2.ok

  // Count existing data
  let zoneCount = 0
  let rateCount = 0
  if (r1.ok) {
    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/shipping_zones?select=id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'count=exact' },
    })
    zoneCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0')
  }
  if (r2.ok) {
    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/shipping_rates?select=id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'count=exact' },
    })
    rateCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0')
  }

  const allReady = Object.values(checks).every(v => v)

  return NextResponse.json({
    tables_exist: allReady,
    checks,
    zone_count: zoneCount,
    rate_count: rateCount,
    ...(allReady ? {} : {
      migration_sql: `-- Run this SQL in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS shipping_zones (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  countries JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping_rates (
  id TEXT PRIMARY KEY,
  zone_id TEXT REFERENCES shipping_zones(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  carrier TEXT,
  price NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  max_order NUMERIC,
  delivery_time TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_zones_site ON shipping_zones(site_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_site ON shipping_rates(site_id);`
    }),
  })
}

export async function POST() {
  // Check tables exist first
  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/shipping_zones?limit=0`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  })
  if (!r1.ok) {
    return NextResponse.json({
      error: 'Tables do not exist. Run the SQL migration first via Supabase Dashboard.',
    }, { status: 400 })
  }

  const results: string[] = []

  for (const siteId of SITES) {
    // Insert zones
    const zoneRows = ZONES_DATA.map(z => ({
      id: `${siteId}_${z.id_suffix}`,
      site_id: siteId,
      name: z.name,
      countries: z.countries,
      is_active: true,
    }))

    const zRes = await fetch(`${SUPABASE_URL}/rest/v1/shipping_zones`, {
      method: 'POST',
      headers,
      body: JSON.stringify(zoneRows),
    })

    if (zRes.ok) {
      const zData = await zRes.json()
      results.push(`${siteId}: ${zData.length} zones`)
    } else {
      results.push(`${siteId} zones: ${await zRes.text()}`)
    }

    // Insert rates
    const rateRows: any[] = []
    for (const z of ZONES_DATA) {
      const zoneRates = RATES_BY_ZONE[z.id_suffix] || []
      for (const r of zoneRates) {
        rateRows.push({
          id: `${siteId}_${z.id_suffix}_${r.carrier.toLowerCase().replace(/\s+/g, '_')}_${r.name.toLowerCase().replace(/\s+/g, '_')}`,
          zone_id: `${siteId}_${z.id_suffix}`,
          site_id: siteId,
          name: r.name,
          carrier: r.carrier,
          price: r.price,
          delivery_time: r.delivery_time,
          min_order: r.min_order,
          max_order: r.max_order,
          is_active: true,
        })
      }
    }

    const rRes = await fetch(`${SUPABASE_URL}/rest/v1/shipping_rates`, {
      method: 'POST',
      headers,
      body: JSON.stringify(rateRows),
    })

    if (rRes.ok) {
      const rData = await rRes.json()
      results.push(`${siteId}: ${rData.length} rates`)
    } else {
      results.push(`${siteId} rates: ${await rRes.text()}`)
    }
  }

  return NextResponse.json({ success: true, results })
}
