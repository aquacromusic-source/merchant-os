import { NextResponse } from 'next/server'
import { getDailyRevenue, getPropertyId } from '@/lib/analytics-ga4'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site') || 'gaming-posters'
  const period = searchParams.get('period') || '30d'

  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30

  try {
    const propertyId = getPropertyId(site)

    if (!propertyId) {
      return NextResponse.json([])
    }

    const data = await getDailyRevenue(propertyId, days)

    // Format dates for display
    const formatted = data.map(d => ({
      date: d.date
        ? `${d.date.slice(6, 8)}/${d.date.slice(4, 6)}`
        : '',
      revenue: d.revenue,
      transactions: d.transactions,
      users: d.users,
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    console.error('Analytics sales error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data', details: error.message },
      { status: 500 }
    )
  }
}
