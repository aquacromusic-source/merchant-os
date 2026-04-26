/**
 * Seed REAL shipping zones & rates (Robin's actual tariffs — ALL zones)
 * Run: node scripts/seed-shipping-real.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://depztempjsdlpnfcjxir.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHp0ZW1wanNkbHBuZmNqeGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTQwNiwiZXhwIjoyMDkyMDM1NDA2fQ.fldUtbH9jF6F1-Z-oKEp15xp1WSB4VsXnMm44n2olqE'

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

// ─── ZONES ──────────────────────────────────────────────────────────────────────

const ZONES = [
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
  { id_suffix: 'zone-90', name: 'Îles Åland, Bulgarie, Tchéquie (+65 pays)', countries: ['AX', 'BG', 'CZ'] },
]

// ─── Helper to build standard rate sets ─────────────────────────────────────────

function makeRates(upsPrice, glsPrice, delivery, { vip = false, lang = 'fr' } = {}) {
  const labels = {
    fr: { ups: 'EXPRESS Livraison domicile UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Point Relais UPS', del: delivery || '2-3 jours ouvrés', glsDel: delivery || '3-5 jours ouvrés' },
    es: { ups: 'EXPRESS Entrega Domicilio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Punto de recogida UPS', del: delivery || '2-3 días laborables', glsDel: delivery || '3-5 días laborables' },
    it: { ups: 'EXPRESS Consegna domicilio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Consegna punto ritiro UPS', del: delivery || '2-3 giorni lavorativi', glsDel: delivery || '3-5 giorni lavorativi' },
    pt: { ups: 'EXPRESS Entrega domicílio UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Gratuit', vip: 'VIP 24H Ponto de recolha UPS', del: delivery || '2-4 dias úteis', glsDel: delivery || '3-5 dias úteis' },
    en: { ups: 'EXPRESS Home Delivery UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Free', vip: 'VIP 24H Relay Point UPS', del: delivery || '2-4 business days', glsDel: delivery || '4-6 business days' },
    de: { ups: 'EXPRESS Lieferung nach Hause UPS', gls_paid: 'Relais GLS', gls_free: 'Relais GLS — Kostenlos', vip: 'VIP 24H Abholpunkt UPS', del: delivery || '2-3 Werktage', glsDel: delivery || '3-5 Werktage' },
  }
  const l = labels[lang] || labels.fr
  const rates = [
    { name: l.ups, carrier: 'UPS', price: upsPrice, delivery_time: l.del, min_order: 0, max_order: null },
    { name: l.gls_paid, carrier: 'GLS', price: glsPrice, delivery_time: l.glsDel, min_order: 0, max_order: 49.99 },
    { name: l.gls_free, carrier: 'GLS', price: 0, delivery_time: l.glsDel, min_order: 50, max_order: null },
  ]
  if (vip) {
    rates.push({ name: l.vip, carrier: 'UPS', price: 13.95, delivery_time: '24h', min_order: 0, max_order: null })
  }
  return rates
}

// ─── RATES BY ZONE ──────────────────────────────────────────────────────────────

const RATES_BY_ZONE = {
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
  'zone-12':          makeRates(34.95, 33.95, '7-10 business days', { lang: 'en' }),
  'zone-13':          makeRates(37.95, 36.95, '7-12 business days', { lang: 'en' }),
  'zone-90':          makeRates(87.95, 86.95, '10-15 business days', { lang: 'en' }),
}

// ─── Upsert helper ──────────────────────────────────────────────────────────────

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

// ─── Main ───────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🚚 Seeding ALL shipping zones & rates (28 zones)...\n')

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

  console.log(`✅ Done! ${ZONES.length} zones × ${SITES.length} sites = ${ZONES.length * SITES.length} zone rows`)
}

seed().catch(e => {
  console.error(e)
  process.exit(1)
})
