/**
 * Seed REAL shipping zones & rates (Robin's actual tariffs)
 * Run: node scripts/seed-shipping-real.mjs
 */

import 'dotenv/config'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation,resolution=merge-duplicates',
}

const SITES = ['gaming-posters', 'strap', 'pdf-guide-store']

const ZONES = [
  {
    id_suffix: 'allemagne',
    name: 'Allemagne',
    countries: ['DE'],
  },
  {
    id_suffix: 'espagne',
    name: 'Espagne (49 provinces)',
    countries: ['ES'],
  },
  {
    id_suffix: 'canaries',
    name: 'Canaries',
    countries: ['IC'],
  },
  {
    id_suffix: 'ceuta-melilla',
    name: 'Ceuta / Melilla',
    countries: ['EA'],
  },
  {
    id_suffix: 'france',
    name: 'France',
    countries: ['FR'],
  },
  {
    id_suffix: 'irlande',
    name: 'Irlande',
    countries: ['IE'],
  },
  {
    id_suffix: 'italie',
    name: 'Italie',
    countries: ['IT'],
  },
  {
    id_suffix: 'portugal',
    name: 'Portugal',
    countries: ['PT'],
  },
  {
    id_suffix: 'belgique-pays-bas',
    name: 'Belgique / Pays-Bas',
    countries: ['BE', 'NL'],
  },
]

const RATES_BY_ZONE = {
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

async function upsert(table, rows) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`  ✗ ${table}: ${err}`)
    return []
  }
  const data = await res.json()
  console.log(`  ✓ ${table}: ${data.length} rows upserted`)
  return data
}

async function seed() {
  console.log('🚚 Seeding REAL shipping zones & rates...\n')

  for (const siteId of SITES) {
    console.log(`Site: ${siteId}`)

    const zoneRows = ZONES.map(z => ({
      id: `${siteId}_${z.id_suffix}`,
      site_id: siteId,
      name: z.name,
      countries: z.countries,
      is_active: true,
    }))

    await upsert('shipping_zones', zoneRows)

    const rateRows = []
    for (const z of ZONES) {
      const zoneRates = RATES_BY_ZONE[z.id_suffix] || []
      for (const r of zoneRates) {
        const rateId = `${siteId}_${z.id_suffix}_${r.carrier.toLowerCase().replace(/\s+/g, '_')}_${r.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        rateRows.push({
          id: rateId,
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

    await upsert('shipping_rates', rateRows)
    console.log()
  }

  console.log('✅ Done!')
}

seed().catch(e => {
  console.error(e)
  process.exit(1)
})
