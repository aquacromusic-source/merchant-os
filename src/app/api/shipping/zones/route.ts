import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  try {
    // Fetch zones
    const zonesUrl = new URL(`${SUPABASE_URL}/rest/v1/shipping_zones`)
    zonesUrl.searchParams.set('site_id', `eq.${siteId}`)
    zonesUrl.searchParams.set('order', 'name.asc')
    zonesUrl.searchParams.set('select', '*')

    const zonesRes = await fetch(zonesUrl.toString(), { headers })
    const zones = await zonesRes.json()

    if (!Array.isArray(zones) || zones.length === 0) {
      return NextResponse.json({ zones: [] })
    }

    // Fetch all rates for this site
    const ratesUrl = new URL(`${SUPABASE_URL}/rest/v1/shipping_rates`)
    ratesUrl.searchParams.set('site_id', `eq.${siteId}`)
    ratesUrl.searchParams.set('order', 'price.asc')
    ratesUrl.searchParams.set('select', '*')

    const ratesRes = await fetch(ratesUrl.toString(), { headers })
    const rates = await ratesRes.json()

    // Group rates by zone
    const ratesByZone: Record<string, any[]> = {}
    for (const rate of (Array.isArray(rates) ? rates : [])) {
      if (!ratesByZone[rate.zone_id]) ratesByZone[rate.zone_id] = []
      ratesByZone[rate.zone_id].push(rate)
    }

    const result = zones.map((z: any) => ({
      id: z.id,
      name: z.name,
      countries: z.countries || [],
      is_active: z.is_active,
      rates: ratesByZone[z.id] || [],
    }))

    return NextResponse.json({ zones: result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, zones: [] }, { status: 500 })
  }
}
