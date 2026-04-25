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
    titleCol: 'name',
    activeCol: null,
    slugCol: null,
    imageCol: 'image_url',
    priceCol: 'price',
    category: 'Accessoire',
    vendor: 'STRAP.',
    skuPrefix: 'ST',
  },
  'pdf-guide-store': {
    table: 'guides',
    titleCol: 'title',
    activeCol: 'is_published',
    slugCol: null,
    imageCol: 'cover_url',
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

  const url = new URL(`${SUPABASE_URL}/rest/v1/${config.table}`)
  url.searchParams.set('select', '*')
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
      category: p.category || config.category,
      price: parseFloat(p[config.priceCol]) || 0,
      stock: p.stock !== undefined ? p.stock : null,
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

// POST — créer un nouveau produit dans la table du site actif
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const siteId = body.site || 'gaming-posters'
    const config = SITE_CONFIG[siteId] || SITE_CONFIG['gaming-posters']

    const insertData: Record<string, any> = {}
    insertData[config.titleCol] = body.title || 'Nouveau produit'
    insertData[config.priceCol] = body.price ?? 0
    if (config.activeCol) insertData[config.activeCol] = body.status === 'live' ? true : (body.status === 'draft' ? false : true)
    if (body.image_url) insertData[config.imageCol] = body.image_url
    if (body.category && siteId === 'strap') insertData.category = body.category
    if (body.category && siteId === 'pdf-guide-store') insertData.category = body.category
    if (body.description && siteId === 'pdf-guide-store') insertData.description = body.description
    if (body.stock !== undefined && siteId === 'strap') insertData.stock = body.stock
    if (config.slugCol && body.slug) insertData[config.slugCol] = body.slug

    const url = `${SUPABASE_URL}/rest/v1/${config.table}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(insertData),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, product: data[0] }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
