import { NextResponse } from 'next/server'
import { getRealtimeMetrics, getPropertyId } from '@/lib/analytics-ga4'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

// Country → approximate lat/lng for globe display
const COUNTRY_COORDS: Record<string, [number, number]> = {
  France: [48.85, 2.35],
  'United States': [40.71, -74.0],
  Germany: [52.52, 13.4],
  'United Kingdom': [51.5, -0.12],
  Japan: [35.68, 139.69],
  Canada: [45.5, -73.57],
  Australia: [-33.86, 151.2],
  Italy: [41.9, 12.49],
  Spain: [40.42, -3.7],
  Netherlands: [52.37, 4.9],
  Belgium: [50.85, 4.35],
  Switzerland: [47.37, 8.54],
  Brazil: [-23.55, -46.63],
  Mexico: [19.43, -99.13],
  India: [28.61, 77.21],
  Singapore: [1.35, 103.82],
  'United Arab Emirates': [25.2, 55.27],
  Sweden: [59.33, 18.07],
  Portugal: [38.72, -9.14],
  Poland: [52.23, 21.01],
}

const SITE_TABLES: Record<string, string> = {
  'gaming-posters': 'orders',
  'strap': 'orders',
  'pdf-guide-store': 'orders',
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site') || 'gaming-posters'

  try {
    const propertyId = getPropertyId(site)

    // Fetch GA4 realtime data and recent orders in parallel
    const [realtimeData, ordersRes] = await Promise.all([
      propertyId
        ? getRealtimeMetrics(propertyId).catch(() => [])
        : Promise.resolve([]),
      fetch(
        `${supabaseUrl}/rest/v1/${SITE_TABLES[site] || 'orders'}?site_id=eq.${site}&created_at=gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      ).then(r => r.json()).catch(() => []),
    ])

    // Convert GA4 realtime to globe markers
    const visitorMarkers = realtimeData.map(d => {
      const coords = COUNTRY_COORDS[d.country] || [0, 0]
      return {
        lat: coords[0],
        lng: coords[1],
        country: d.country,
        city: d.city,
        activeUsers: d.activeUsers,
        pageViews: d.pageViews,
        type: d.conversions > 0 ? 'purchase' : 'visit',
      }
    })

    // Convert orders to globe markers
    const orderMarkers = (Array.isArray(ordersRes) ? ordersRes : []).map((order: any) => {
      const country = order.shipping_country || order.country || ''
      const coords = COUNTRY_COORDS[country] || [48.85, 2.35]
      return {
        lat: order.shipping_lat || coords[0],
        lng: order.shipping_lng || coords[1],
        country,
        amount: order.total || order.amount || 0,
        product: order.line_items?.[0]?.title || order.product_title || '',
        created_at: order.created_at,
        type: 'purchase',
      }
    })

    // Top locations from GA4
    const topLocations = realtimeData
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 5)
      .map((d, i, arr) => ({
        city: `${d.city}, ${d.country}`,
        sessions: d.activeUsers,
        pct: arr[0].activeUsers > 0 ? Math.round((d.activeUsers / arr[0].activeUsers) * 100) : 0,
      }))

    // Total active users
    const totalActiveUsers = realtimeData.reduce((sum, d) => sum + d.activeUsers, 0)

    return NextResponse.json({
      realtime: {
        activeUsers: totalActiveUsers,
        visitors: visitorMarkers,
        topLocations,
      },
      orders: orderMarkers,
      recentOrders: (Array.isArray(ordersRes) ? ordersRes : []).slice(0, 5).map((o: any) => ({
        product: o.line_items?.[0]?.title || o.product_title || 'Commande',
        city: o.shipping_city || o.city || '',
        country: o.shipping_country || o.country || '',
        price: o.total || o.amount || 0,
        created_at: o.created_at,
      })),
    })
  } catch (error: any) {
    console.error('Analytics live error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch live data', details: error.message },
      { status: 500 }
    )
  }
}
