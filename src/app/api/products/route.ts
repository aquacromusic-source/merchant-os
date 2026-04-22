import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://depztempjsdlpnfcjxir.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHp0ZW1wanNkbHBuZmNqeGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTQwNiwiZXhwIjoyMDkyMDM1NDA2fQ.fldUtbH9jF6F1-Z-oKEp15xp1WSB4VsXnMm44n2olqE'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const url = new URL(`${SUPABASE_URL}/rest/v1/posters`)
  url.searchParams.set('select', 'id,title,slug,year,genres,franchise,rating,image_url,price,is_active,decade')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('order', 'rating.desc.nullslast')

  if (search) url.searchParams.set('title', `ilike.*${search}*`)
  if (status === 'live') url.searchParams.set('is_active', 'eq.true')
  if (status === 'draft') url.searchParams.set('is_active', 'eq.false')

  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
    },
  })

  const data = await res.json()
  const total = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

  // Mapper vers le format attendu par le BO
  const products = (data || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.genres?.[0] || 'Poster',
    price: parseFloat(p.price) || 11.95,
    stock: 99,
    status: p.is_active ? 'live' : 'draft',
    sku: `PX-${p.id}`,
    variants: 4,
    channels: 3,
    markets: 5,
    vendor: p.franchise || 'PIXELWALL',
    type: 'Poster',
    collections: 1,
    updated: 'Récemment',
    image_url: p.image_url,
    year: p.year,
    genres: p.genres,
    franchise: p.franchise,
    rating: p.rating,
  }))

  return NextResponse.json({ products, total })
}
