import { BetaAnalyticsDataClient } from '@google-analytics/data'

let _client: BetaAnalyticsDataClient | null = null

function getClient() {
  if (!_client) {
    _client = new BetaAnalyticsDataClient({
      credentials: JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS || '{}'),
    })
  }
  return _client
}

// Site → GA4 Property ID mapping
const PROPERTY_IDS: Record<string, string> = {
  'gaming-posters': process.env.GA4_PROPERTY_GAMING_POSTERS || '',
  'strap': process.env.GA4_PROPERTY_STRAP || '',
  'pdf-guide-store': process.env.GA4_PROPERTY_PDF_GUIDE || '',
}

export function getPropertyId(site: string): string {
  return PROPERTY_IDS[site] || PROPERTY_IDS['gaming-posters']
}

export async function getRealtimeMetrics(propertyId: string) {
  const client = getClient()
  const [response] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'conversions' },
    ],
    dimensions: [
      { name: 'country' },
      { name: 'city' },
    ],
  })

  return response.rows?.map(row => ({
    country: row.dimensionValues?.[0]?.value || '',
    city: row.dimensionValues?.[1]?.value || '',
    activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
    pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
    conversions: parseInt(row.metricValues?.[2]?.value || '0'),
  })) || []
}

export async function getDailyRevenue(propertyId: string, days: number = 30) {
  const client = getClient()
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    metrics: [
      { name: 'totalRevenue' },
      { name: 'transactions' },
      { name: 'totalUsers' },
    ],
    dimensions: [{ name: 'date' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  })

  return response.rows?.map(row => ({
    date: row.dimensionValues?.[0]?.value || '',
    revenue: parseFloat(row.metricValues?.[0]?.value || '0'),
    transactions: parseInt(row.metricValues?.[1]?.value || '0'),
    users: parseInt(row.metricValues?.[2]?.value || '0'),
  })) || []
}

export async function getKPIs(propertyId: string) {
  const client = getClient()

  // Today's data
  const [todayResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: 'today', endDate: 'today' }],
    metrics: [
      { name: 'totalRevenue' },
      { name: 'transactions' },
      { name: 'totalUsers' },
      { name: 'sessions' },
    ],
  })

  const todayRow = todayResponse.rows?.[0]
  const todayRevenue = parseFloat(todayRow?.metricValues?.[0]?.value || '0')
  const todayOrders = parseInt(todayRow?.metricValues?.[1]?.value || '0')
  const todayUsers = parseInt(todayRow?.metricValues?.[2]?.value || '0')
  const todaySessions = parseInt(todayRow?.metricValues?.[3]?.value || '0')

  // Realtime active users
  const [realtimeResponse] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'activeUsers' }],
  })
  const activeUsers = parseInt(realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0')

  const avgBasket = todayOrders > 0 ? todayRevenue / todayOrders : 0
  const conversionRate = todaySessions > 0 ? (todayOrders / todaySessions) * 100 : 0

  return {
    todayRevenue,
    todayOrders,
    avgBasket,
    conversionRate,
    activeUsers,
    todaySessions,
    todayUsers,
  }
}
