import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SITE_CONFIG: Record<string, {
  table: string
  titleCol: string
  priceCol: string
  imageCol: string
  skuPrefix: string
  hasStock: boolean
}> = {
  'gaming-posters': {
    table: 'posters',
    titleCol: 'title',
    priceCol: 'price',
    imageCol: 'image_url',
    skuPrefix: 'PX',
    hasStock: true,
  },
  'strap': {
    table: 'kettel_products',
    titleCol: 'title',
    priceCol: 'price',
    imageCol: 'thumb_image',
    skuPrefix: 'ST',
    hasStock: false,
  },
  'pdf-guide-store': {
    table: 'guides',
    titleCol: 'title',
    priceCol: 'price',
    imageCol: 'cover_url',
    skuPrefix: 'GD',
    hasStock: false,
  },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  const config = SITE_CONFIG[siteId] || SITE_CONFIG['gaming-posters']

  // Fetch products
  const productsUrl = new URL(`${SUPABASE_URL}/rest/v1/${config.table}`)
  productsUrl.searchParams.set('select', '*')

  // Fetch locations
  const locationsUrl = new URL(`${SUPABASE_URL}/rest/v1/locations`)
  locationsUrl.searchParams.set('select', '*')
  locationsUrl.searchParams.set('site_id', `eq.${siteId}`)
  locationsUrl.searchParams.set('order', 'created_at.desc')

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  }

  const [productsRes, locationsRes] = await Promise.all([
    fetch(productsUrl.toString(), { headers }),
    fetch(locationsUrl.toString(), { headers }),
  ])

  const productsData = productsRes.ok ? await productsRes.json() : []
  const locationsData = locationsRes.ok ? await locationsRes.json() : []

  const products = (productsData || []).map((p: any) => ({
    id: String(p.id),
    title: p[config.titleCol],
    price: parseFloat(p[config.priceCol]) || 0,
    stock: config.hasStock && p.stock !== undefined ? p.stock : null,
    image_url: p[config.imageCol],
    sku: `${config.skuPrefix}-${p.id}`,
  }))

  return NextResponse.json({
    products,
    locations: locationsData || [],
  })
}
