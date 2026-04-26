import { NextResponse } from 'next/server'
import { getKPIs, getPropertyId } from '@/lib/analytics-ga4'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site') || 'gaming-posters'

  try {
    const propertyId = getPropertyId(site)

    if (!propertyId) {
      return NextResponse.json({
        todayRevenue: 0,
        todayOrders: 0,
        avgBasket: 0,
        conversionRate: 0,
        activeUsers: 0,
        todaySessions: 0,
        todayUsers: 0,
      })
    }

    const kpis = await getKPIs(propertyId)
    return NextResponse.json(kpis)
  } catch (error: any) {
    console.error('Analytics KPIs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs', details: error.message },
      { status: 500 }
    )
  }
}
