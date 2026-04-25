import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

// GET /api/markets?site=gaming-posters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/markets`)
    url.searchParams.set('site_id', `eq.${siteId}`)
    url.searchParams.set('order', 'is_primary.desc,created_at.asc')
    url.searchParams.set('select', '*')

    const res = await fetch(url.toString(), { headers })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ markets: Array.isArray(data) ? data : [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, markets: [] }, { status: 500 })
  }
}

// POST /api/markets
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { site, name, code, countries, currency, language, domain, tax_config, shipping_config, payment_methods, fulfillment_center, is_primary, is_active } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'name and code are required' }, { status: 400 })
    }

    const id = `mkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const row = {
      id,
      site_id: site || 'gaming-posters',
      name,
      code,
      countries: countries || [],
      currency: currency || 'EUR',
      language: language || 'fr',
      domain: domain || null,
      tax_config: tax_config || { tax_included: true, vat_rate: 20 },
      shipping_config: shipping_config || {},
      payment_methods: payment_methods || ['stripe'],
      fulfillment_center: fulfillment_center || null,
      active_products: [],
      is_primary: is_primary || false,
      is_active: is_active !== undefined ? is_active : true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/markets`, {
      method: 'POST',
      headers,
      body: JSON.stringify(row),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ market: Array.isArray(data) ? data[0] : data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
