import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

// Table config per site
const SITE_CONFIG: Record<string, {
  table: string
  titleCol: string
  activeCol: string | null
  slugCol: string | null
  imageCol: string
  priceCol: string
  category: string
  vendor: string
  skuPrefix: string
}> = {
  'gaming-posters': {
    table: 'posters',
    titleCol: 'title',
    activeCol: 'is_active',
    slugCol: 'slug',
    imageCol: 'image_url',
    priceCol: 'price',
    category: 'Poster',
    vendor: 'PIXELWALL',
    skuPrefix: 'PX',
  },
  'strap': {
    table: 'kettel_products',
    titleCol: 'title',
    activeCol: 'is_active',
    slugCol: 'slug',
    imageCol: 'image_url',
    priceCol: 'price',
    category: 'Accessoire',
    vendor: 'STRAP.',
    skuPrefix: 'ST',
  },
  'pdf-guide-store': {
    table: 'guides',
    titleCol: 'title',
    activeCol: 'is_active',
    slugCol: 'slug',
    imageCol: 'image_url',
    priceCol: 'price',
    category: 'Guide PDF',
    vendor: 'PDF Guide Store',
    skuPrefix: 'GD',
  },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const siteId = searchParams.get('site') || 'gaming-posters'

  const config = SITE_CONFIG[siteId] || SITE_CONFIG['gaming-posters']

  // Build select columns — only request columns that exist
  const selectCols = ['id', config.titleCol, config.imageCol, config.priceCol]
  if (config.slugCol) selectCols.push(config.slugCol)
  if (config.activeCol) selectCols.push(config.activeCol)

  const url = new URL(`${SUPABASE_URL}/rest/v1/${config.table}`)
  url.searchParams.set('select', selectCols.join(','))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('order', `${config.titleCol}.asc`)

  if (search) url.searchParams.set(config.titleCol, `ilike.*${search}*`)

  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
    },
  })

  const data = await res.json()
  const total = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

  // Dédupliquer par titre
  const seen = new Set<string>()
  const unique = (data || []).filter((p: any) => {
    const key = (p[config.titleCol] || '').toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Mapper vers le format attendu par le BO
  const products = unique.map((p: any) => {
    const isActive = config.activeCol ? p[config.activeCol] : true
    return {
      id: String(p.id),
      slug: (config.slugCol ? p[config.slugCol] : null) || String(p.id),
      title: p[config.titleCol],
      category: config.category,
      price: parseFloat(p[config.priceCol]) || 0,
      stock: isActive ? 1 : 0,
      status: isActive ? 'live' as const : 'draft' as const,
      sku: `${config.skuPrefix}-${p.id}`,
      variants: 1,
      channels: 1,
      markets: 1,
      vendor: config.vendor,
      type: config.category,
      collections: 1,
      updated: 'Récemment',
      image_url: p[config.imageCol],
    }
  })

  return NextResponse.json({ products, total: total || products.length })
}
