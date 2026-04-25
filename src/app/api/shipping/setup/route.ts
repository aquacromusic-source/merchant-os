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
  // Europe principale
  { id_suffix: 'allemagne', name: 'Allemagne', countries: ['DE'] },
  { id_suffix: 'belgique-pays-bas', name: 'Belgique / Pays-Bas', countries: ['BE', 'NL'] },
  { id_suffix: 'espagne', name: 'Espagne (49 provinces)', countries: ['ES'] },
  { id_suffix: 'canaries', name: 'Canaries', countries: ['IC'] },
  { id_suffix: 'ceuta-melilla', name: 'Ceuta / Melilla', countries: ['XC', 'XL'] },
  { id_suffix: 'france', name: 'France', countries: ['FR'] },
  { id_suffix: 'irlande', name: 'Irlande', countries: ['IE'] },
  { id_suffix: 'italie', name: 'Italie', countries: ['IT'] },
  { id_suffix: 'portugal', name: 'Portugal', countries: ['PT'] },
  // Europe élargie
  { id_suffix: 'zone-006', name: 'Suède, Autriche, Danemark, Finlande', countries: ['SE', 'AT', 'DK', 'FI'] },
  { id_suffix: 'zone-061', name: 'Croatie, Estonie, Hongrie, Lettonie, Lituanie, Slovénie', countries: ['HR', 'EE', 'HU', 'LV', 'LT', 'SI'] },
  { id_suffix: 'zone-008', name: 'Kosovo, Monténégro, Russie, Serbie', countries: ['XK', 'ME', 'RU', 'RS'] },
  { id_suffix: 'royaume-uni', name: 'Royaume-Uni', countries: ['GB'] },
  { id_suffix: 'norvege', name: 'Norvège', countries: ['NO'] },
  { id_suffix: 'pologne', name: 'Pologne', countries: ['PL'] },
  { id_suffix: 'grece', name: 'Grèce', countries: ['GR'] },
  { id_suffix: 'turquie', name: 'Turquie', countries: ['TR'] },
  { id_suffix: 'israel', name: 'Israël', countries: ['IL'] },
  { id_suffix: 'liechtenstein', name: 'Liechtenstein', countries: ['LI'] },
  // Monde
  { id_suffix: 'etats-unis', name: 'États-Unis', countries: ['US'] },
  { id_suffix: 'australie', name: 'Australie', countries: ['AU'] },
  { id_suffix: 'emirats', name: 'Émirats arabes unis', countries: ['AE'] },
  { id_suffix: 'mexique', name: 'Mexique', countries: ['MX'] },
  { id_suffix: 'thailande', name: 'Thaïlande', countries: ['TH'] },
  { id_suffix: 'porto-rico', name: 'Porto Rico', countries: ['PR'] },
  { id_suffix: 'zone-11', name: 'Venezuela, Brésil, Argentine, Chili', countries: ['VE', 'BR', 'AR', 'CL'] },
  { id_suffix: 'zone-12', name: 'Inde, Corée du Sud', countries: ['IN', 'KR'] },
  { id_suffix: 'zone-13', name: 'Hong Kong, Jersey, Singapour (+103 pays)', countries: ['HK', 'JE', 'SG'] },
]

type RateData = { name: string; carrier: string; price: number; delivery_time: string; min_order: number; max_order: number | null }

function makeRates(upsPrice: number, glsPrice: number, delivery: string | null, opts: { vip?: boolean; lang?: string } = {}): RateData[] {
  const { vip = false, lang = 'fr' } = opts
  const labels: Record<string, { ups: string; gls_paid: string; gls_free: string; vip: string; del: string; glsDel: string }> = {
    fr: { ups: 'EXPRESS Livraison domicile UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Point Relais UPS', del: delivery || '2-3 jours ouvrés', glsDel: delivery || '3-5 jours ouvrés' },
    es: { ups: 'EXPRESS Entrega Domicilio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Punto de recogida UPS', del: delivery || '2-3 días laborables', glsDel: delivery || '3-5 días laborables' },
    it: { ups: 'EXPRESS Consegna domicilio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Consegna punto ritiro UPS', del: delivery || '2-3 giorni lavorativi', glsDel: delivery || '3-5 giorni lavorativi' },
    pt: { ups: 'EXPRESS Entrega domicílio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Ponto de recolha UPS', del: delivery || '2-4 dias úteis', glsDel: delivery || '3-5 dias úteis' },
    en: { ups: 'EXPRESS Home Delivery UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Free', vip: 'VIP 24H Relay Point UPS', del: delivery || '2-4 business days', glsDel: delivery || '4-6 business days' },
    de: { ups: 'EXPRESS Lieferung nach Hause UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Kostenlos', vip: 'VIP 24H Abholpunkt UPS', del: delivery || '2-3 Werktage', glsDel: delivery || '3-5 Werktage' },
  }
  const l = labels[lang] || labels.fr
  const rates: RateData[] = [
    { name: l.ups, carrier: 'UPS', price: upsPrice, delivery_time: l.del, min_order: 0, max_order: null },
    { name: l.gls_paid, carrier: 'GLS', price: glsPrice, delivery_time: l.glsDel, min_order: 0, max_order: 49.99 },
    { name: l.gls_free, carrier: 'GLS', price: 0, delivery_time: l.glsDel, min_order: 50, max_order: null },
  ]
  if (vip) {
    rates.push({ name: l.vip, carrier: 'UPS', price: 13.95, delivery_time: '24h', min_order: 0, max_order: null })
  }
  return rates
}

const RATES_BY_ZONE: Record<string, RateData[]> = {
  // Europe principale
  'allemagne':        makeRates(6.95, 4.95, null, { vip: true, lang: 'de' }),
  'belgique-pays-bas': makeRates(6.95, 4.95, null, { lang: 'fr' }),
  'espagne':          makeRates(4.95, 3.95, null, { lang: 'es' }),
  'canaries':         makeRates(5.95, 4.95, '4-6 días laborables', { lang: 'es' }),
  'ceuta-melilla':    makeRates(6.95, 4.95, '4-6 días laborables', { lang: 'es' }),
  'france':           makeRates(6.95, 4.95, null, { vip: true, lang: 'fr' }),
  'irlande':          makeRates(6.95, 6.95, null, { lang: 'en' }),
  'italie':           makeRates(6.95, 4.95, null, { vip: true, lang: 'it' }),
  'portugal':         makeRates(5.95, 4.95, null, { lang: 'pt' }),
  // Europe élargie
  'zone-006':         makeRates(7.95, 5.95, null, { lang: 'en' }),
  'zone-061':         makeRates(8.95, 5.95, null, { lang: 'en' }),
  'zone-008':         makeRates(9.95, 6.95, null, { lang: 'en' }),
  'royaume-uni':      makeRates(7.95, 5.95, null, { lang: 'en' }),
  'norvege':          makeRates(8.95, 6.95, null, { lang: 'en' }),
  'pologne':          makeRates(7.95, 5.95, null, { lang: 'en' }),
  'grece':            makeRates(8.95, 5.95, null, { lang: 'en' }),
  'turquie':          makeRates(9.95, 6.95, null, { lang: 'en' }),
  'israel':           makeRates(10.95, 6.95, null, { lang: 'en' }),
  'liechtenstein':    makeRates(8.95, 5.95, null, { lang: 'en' }),
  // Monde
  'etats-unis':       makeRates(11.95, 6.95, '5-8 business days', { lang: 'en' }),
  'australie':        makeRates(12.95, 6.95, '7-10 business days', { lang: 'en' }),
  'emirats':          makeRates(11.95, 6.95, '5-8 business days', { lang: 'en' }),
  'mexique':          makeRates(11.95, 6.95, '5-8 business days', { lang: 'es' }),
  'thailande':        makeRates(12.95, 6.95, '7-10 business days', { lang: 'en' }),
  'porto-rico':       makeRates(11.95, 6.95, '5-8 business days', { lang: 'en' }),
  'zone-11':          makeRates(12.95, 6.95, '7-10 business days', { lang: 'es' }),
  'zone-12':          makeRates(12.95, 6.95, '7-10 business days', { lang: 'en' }),
  'zone-13':          makeRates(13.95, 6.95, '7-12 business days', { lang: 'en' }),
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
