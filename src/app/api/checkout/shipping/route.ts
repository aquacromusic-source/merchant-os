import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!
const supaHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site') || 'gaming-posters'
  const country = (searchParams.get('country') || 'FR').toUpperCase()

  try {
    // 1. Fetch all zones for site
    const zonesUrl = new URL(`${SUPABASE_URL}/rest/v1/shipping_zones`)
    zonesUrl.searchParams.set('site_id', `eq.${site}`)
    zonesUrl.searchParams.set('is_active', 'eq.true')
    zonesUrl.searchParams.set('select', '*')

    const zonesRes = await fetch(zonesUrl.toString(), { headers: supaHeaders })
    const zones = await zonesRes.json()

    if (!Array.isArray(zones) || zones.length === 0) {
      return NextResponse.json({ options: [] }, { headers: corsHeaders() })
    }

    // 2. Filter zones where countries array contains the country code
    const matchingZones = zones.filter((z: any) => {
      const countries: string[] = z.countries || []
      return countries.some((c: string) => c.toUpperCase() === country)
    })

    if (matchingZones.length === 0) {
      return NextResponse.json({ options: [] }, { headers: corsHeaders() })
    }

    // 3. Fetch rates for matching zones
    const zoneIds = matchingZones.map((z: any) => z.id)
    const ratesUrl = new URL(`${SUPABASE_URL}/rest/v1/shipping_rates`)
    ratesUrl.searchParams.set('zone_id', `in.(${zoneIds.join(',')})`)
    ratesUrl.searchParams.set('site_id', `eq.${site}`)
    ratesUrl.searchParams.set('is_active', 'eq.true')
    ratesUrl.searchParams.set('order', 'price.asc')
    ratesUrl.searchParams.set('select', '*')

    const ratesRes = await fetch(ratesUrl.toString(), { headers: supaHeaders })
    const rates = await ratesRes.json()

    // 4. Build zone name lookup
    const zoneNameById: Record<string, string> = {}
    for (const z of matchingZones) {
      zoneNameById[z.id] = z.name
    }

    // 5. Return formatted shipping options
    const options = (Array.isArray(rates) ? rates : []).map((r: any) => ({
      id: r.id,
      name: r.name,
      carrier: r.carrier || null,
      price: r.price,
      currency: 'EUR',
      delivery_time: r.delivery_time || null,
      zone: zoneNameById[r.zone_id] || null,
    }))

    return NextResponse.json({ options }, { headers: corsHeaders() })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, options: [] },
      { status: 500, headers: corsHeaders() }
    )
  }
}
