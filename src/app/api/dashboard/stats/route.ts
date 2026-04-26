import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  try {
    // Fetch all orders for this site
    const ordersUrl = new URL(`${SUPABASE_URL}/rest/v1/orders`)
    ordersUrl.searchParams.set('select', '*')
    ordersUrl.searchParams.set('site_id', `eq.${siteId}`)
    ordersUrl.searchParams.set('order', 'created_at.desc')

    // Fetch recent 6 orders
    const recentUrl = new URL(`${SUPABASE_URL}/rest/v1/orders`)
    recentUrl.searchParams.set('select', '*')
    recentUrl.searchParams.set('site_id', `eq.${siteId}`)
    recentUrl.searchParams.set('order', 'created_at.desc')
    recentUrl.searchParams.set('limit', '6')

    const [allRes, recentRes] = await Promise.all([
      fetch(ordersUrl.toString(), { headers }),
      fetch(recentUrl.toString(), { headers }),
    ])

    if (!allRes.ok || !recentRes.ok) {
      const err = await allRes.text()
      return NextResponse.json({ error: err }, { status: allRes.status })
    }

    const allOrders = await allRes.json()
    const recentOrders = await recentRes.json()

    const totalOrders = (allOrders || []).length
    const totalRevenue = (allOrders || []).reduce(
      (sum: number, o: any) => sum + (parseFloat(o.total) || 0),
      0
    )
    const pendingOrders = (allOrders || []).filter(
      (o: any) => o.payment?.key === 'pending' || o.fulfill?.key === 'unfulfilled'
    ).length

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      recentOrders: recentOrders || [],
      pendingOrders,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
