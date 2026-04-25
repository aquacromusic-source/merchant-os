/**
 * Seed shipping zones & rates into Supabase
 * Run: node scripts/seed-shipping.mjs
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
    id_suffix: 'france',
    name: 'France métropolitaine',
    countries: ['FR'],
  },
  {
    id_suffix: 'benelux',
    name: 'Benelux',
    countries: ['BE', 'NL', 'LU'],
  },
  {
    id_suffix: 'dach',
    name: 'Allemagne, Autriche, Suisse',
    countries: ['DE', 'AT', 'CH'],
  },
  {
    id_suffix: 'south-eu',
    name: 'Europe du Sud',
    countries: ['ES', 'IT', 'PT'],
  },
  {
    id_suffix: 'north-eu',
    name: 'Europe du Nord',
    countries: ['SE', 'DK', 'FI', 'NO', 'IE', 'GB'],
  },
  {
    id_suffix: 'east-eu',
    name: 'Europe de l\'Est',
    countries: ['PL', 'CZ', 'RO', 'HU', 'HR', 'BG', 'SK', 'SI', 'LT', 'LV', 'EE'],
  },
  {
    id_suffix: 'international',
    name: 'International (hors UE)',
    countries: ['US', 'CA', 'AU', 'JP', 'KR', 'CN'],
  },
]

// Rates per zone (realistic French e-commerce rates)
const RATES_BY_ZONE = {
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
  console.log('🚚 Seeding shipping zones & rates...\n')

  for (const siteId of SITES) {
    console.log(`Site: ${siteId}`)

    // Build zone rows
    const zoneRows = ZONES.map(z => ({
      id: `${siteId}_${z.id_suffix}`,
      site_id: siteId,
      name: z.name,
      countries: z.countries,
      is_active: true,
    }))

    await upsert('shipping_zones', zoneRows)

    // Build rate rows
    const rateRows = []
    for (const z of ZONES) {
      const zoneRates = RATES_BY_ZONE[z.id_suffix] || []
      for (const r of zoneRates) {
        const rateId = `${siteId}_${z.id_suffix}_${r.carrier.toLowerCase().replace(/\s+/g, '_')}_${r.name.toLowerCase().replace(/\s+/g, '_')}`
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
