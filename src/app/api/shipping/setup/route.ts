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
  { id_suffix: 'allemagne', name: 'Allemagne', countries: ['DE'] },
  { id_suffix: 'espagne', name: 'Espagne (49 provinces)', countries: ['ES'] },
  { id_suffix: 'canaries', name: 'Canaries', countries: ['IC'] },
  { id_suffix: 'ceuta-melilla', name: 'Ceuta / Melilla', countries: ['EA'] },
  { id_suffix: 'france', name: 'France', countries: ['FR'] },
  { id_suffix: 'irlande', name: 'Irlande', countries: ['IE'] },
  { id_suffix: 'italie', name: 'Italie', countries: ['IT'] },
  { id_suffix: 'portugal', name: 'Portugal', countries: ['PT'] },
  { id_suffix: 'belgique-pays-bas', name: 'Belgique / Pays-Bas', countries: ['BE', 'NL'] },
]

const RATES_BY_ZONE: Record<string, { name: string; carrier: string; price: number; delivery_time: string; min_order: number; max_order: number | null }[]> = {
  allemagne: [
    { name: 'EXPRESS Livraison domicile UPS', carrier: 'UPS', price: 6.95, delivery_time: '2-3 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 jours ouvrés', min_order: 50, max_order: null },
    { name: 'VIP 24H Point Relais UPS', carrier: 'UPS', price: 13.95, delivery_time: '24h', min_order: 0, max_order: null },
  ],
  espagne: [
    { name: 'EXPRESS Entrega Domicilio UPS', carrier: 'UPS', price: 4.95, delivery_time: '2-3 días laborables', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 3.95, delivery_time: '3-5 días laborables', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 días laborables', min_order: 50, max_order: null },
  ],
  canaries: [
    { name: 'Entrega domicilio UPS', carrier: 'UPS', price: 5.95, delivery_time: '4-6 días laborables', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '5-7 días laborables', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '5-7 días laborables', min_order: 50, max_order: null },
  ],
  'ceuta-melilla': [
    { name: 'Entrega domicilio UPS', carrier: 'UPS', price: 6.95, delivery_time: '4-6 días laborables', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '5-7 días laborables', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '5-7 días laborables', min_order: 50, max_order: null },
  ],
  france: [
    { name: 'EXPRESS Livraison Domicile UPS', carrier: 'UPS', price: 6.95, delivery_time: '2-3 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 jours ouvrés', min_order: 50, max_order: null },
    { name: 'VIP 24H Livraison Point Relais UPS', carrier: 'UPS', price: 13.95, delivery_time: '24h', min_order: 0, max_order: null },
  ],
  irlande: [
    { name: 'EXPRESS Home Delivery UPS', carrier: 'UPS', price: 6.95, delivery_time: '2-4 business days', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 6.95, delivery_time: '4-6 business days', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '4-6 business days', min_order: 50, max_order: null },
  ],
  italie: [
    { name: 'EXPRESS Consegna domicilio UPS', carrier: 'UPS', price: 6.95, delivery_time: '2-3 giorni lavorativi', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '3-5 giorni lavorativi', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 giorni lavorativi', min_order: 50, max_order: null },
    { name: 'VIP 24H Consegna punto ritiro UPS', carrier: 'UPS', price: 13.95, delivery_time: '24h', min_order: 0, max_order: null },
  ],
  portugal: [
    { name: 'EXPRESS Entrega domicílio UPS', carrier: 'UPS', price: 5.95, delivery_time: '2-4 dias úteis', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '3-5 dias úteis', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 dias úteis', min_order: 50, max_order: null },
  ],
  'belgique-pays-bas': [
    { name: 'EXPRESS Livraison domicile UPS', carrier: 'UPS', price: 6.95, delivery_time: '2-3 jours ouvrés', min_order: 0, max_order: null },
    { name: 'Relais GLS', carrier: 'GLS', price: 4.95, delivery_time: '3-5 jours ouvrés', min_order: 0, max_order: 49.99 },
    { name: 'Relais GLS — Gratuit', carrier: 'GLS', price: 0, delivery_time: '3-5 jours ouvrés', min_order: 50, max_order: null },
  ],
}

const SITES = ['gaming-posters', 'strap', 'pdf-guide-store']

// GET /api/shipping/setup — check if tables exist
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

// POST /api/shipping/setup — seed real shipping data
export async function POST() {
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
    const rateRows: { id: string; zone_id: string; site_id: string; name: string; carrier: string; price: number; delivery_time: string; min_order: number; max_order: number | null; is_active: boolean }[] = []
    for (const z of ZONES_DATA) {
      const zoneRates = RATES_BY_ZONE[z.id_suffix] || []
      for (const r of zoneRates) {
        rateRows.push({
          id: `${siteId}_${z.id_suffix}_${r.carrier.toLowerCase().replace(/\s+/g, '_')}_${r.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
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
