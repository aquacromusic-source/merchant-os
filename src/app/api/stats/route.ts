import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SITE_CONFIG: Record<string, {
  table: string
  titleCol: string
  activeCol: string | null
  priceCol: string
}> = {
  'gaming-posters': { table: 'posters', titleCol: 'title', activeCol: 'is_active', priceCol: 'price' },
  'strap': { table: 'kettel_products', titleCol: 'name', activeCol: 'is_active', priceCol: 'price' },
  'pdf-guide-store': { table: 'guides', titleCol: 'title', activeCol: 'is_published', priceCol: 'price' },
}

async function supabaseGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
    },
  })
  const total = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')
  const data = await res.json()
  return { data, total }
}

export async function GET(req: NextRequest) {
  const siteId = new URL(req.url).searchParams.get('site') || 'gaming-posters'
  const config = SITE_CONFIG[siteId] || SITE_CONFIG['gaming-posters']

  try {
    // Fetch all products with price and stock
    const selectCols = ['id', config.priceCol]
    if (config.activeCol) selectCols.push(config.activeCol)
    if (siteId === 'strap') selectCols.push('stock')

    const { data: products, total: totalProducts } = await supabaseGet(
      `${config.table}?select=${selectCols.join(',')}&limit=10000`
    )

    const arr = products || []

    // Count active products
    const activeCount = config.activeCol
      ? arr.filter((p: any) => p[config.activeCol!] === true).length
      : arr.length

    const draftCount = config.activeCol
      ? arr.filter((p: any) => p[config.activeCol!] === false).length
      : 0

    // Sum prices (as revenue proxy / catalog value)
    const totalValue = arr.reduce((sum: number, p: any) => sum + (parseFloat(p[config.priceCol]) || 0), 0)

    // Sum stock (only for sites that have stock column)
    const totalStock = siteId === 'strap'
      ? arr.reduce((sum: number, p: any) => sum + (p.stock || 0), 0)
      : null

    return NextResponse.json({
      totalProducts: totalProducts || arr.length,
      activeCount,
      draftCount,
      totalValue,
      totalStock,
      // No orders table in Supabase — real count is 0
      orderCount: 0,
      orderRevenue: 0,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
