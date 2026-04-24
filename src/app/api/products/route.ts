import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const url = new URL(`${SUPABASE_URL}/rest/v1/posters`)
  url.searchParams.set('select', 'id,title,slug,image_url,price,is_active')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('order', 'title.asc')

  if (search) url.searchParams.set('title', `ilike.*${search}*`)

  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
    },
  })

  const data = await res.json()
  const total = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

  // Dédupliquer par titre (évite les doublons comme GTA V x2)
  const seen = new Set<string>()
  const unique = (data || []).filter((p: any) => {
    const key = (p.title || '').toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Mapper vers le format attendu par le BO
  const products = unique.map((p: any) => ({
    id: String(p.id),
    slug: p.slug || String(p.id),
    title: p.title,
    category: 'Poster',
    price: parseFloat(p.price) || 11.95,
    stock: p.is_active ? 1 : 0,
    status: p.is_active ? 'live' : 'draft',
    sku: `PX-${p.id}`,
    variants: 1,
    channels: 1,
    markets: 1,
    vendor: 'PIXELWALL',
    type: 'Poster',
    collections: 1,
    updated: 'Récemment',
    image_url: p.image_url,
  }))

  return NextResponse.json({ products, total: total || products.length })
}
