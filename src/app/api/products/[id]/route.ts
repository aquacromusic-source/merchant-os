import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SITE_CONFIG: Record<string, {
  table: string
  titleCol: string
  activeCol: string | null
  imageCol: string
  priceCol: string
}> = {
  'gaming-posters': { table: 'posters', titleCol: 'title', activeCol: 'is_active', imageCol: 'image_url', priceCol: 'price' },
  'strap': { table: 'kettel_products', titleCol: 'name', activeCol: null, imageCol: 'thumb_image', priceCol: 'price' },
  'pdf-guide-store': { table: 'guides', titleCol: 'title', activeCol: 'is_published', imageCol: 'cover_url', priceCol: 'price' },
}

function getConfig(site: string) {
  return SITE_CONFIG[site] || SITE_CONFIG['gaming-posters']
}

// GET — récupérer un produit par ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const site = new URL(req.url).searchParams.get('site') || 'gaming-posters'
    const config = getConfig(site)

    const url = `${SUPABASE_URL}/rest/v1/${config.table}?id=eq.${id}&limit=1`
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    })
    const data = await res.json()
    if (!data[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT — mettre à jour un produit par ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const site = body.site || 'gaming-posters'
    const config = getConfig(site)

    const updateData: Record<string, any> = {}
    if (body.title !== undefined) updateData[config.titleCol] = body.title
    if (body.price !== undefined) updateData[config.priceCol] = body.price
    if (body.image_url !== undefined) updateData[config.imageCol] = body.image_url
    if (body.status !== undefined && config.activeCol) {
      updateData[config.activeCol] = body.status === 'live'
    }
    // Site-specific fields
    if (body.category !== undefined && (site === 'strap' || site === 'pdf-guide-store')) updateData.category = body.category
    if (body.description !== undefined && site === 'pdf-guide-store') updateData.description = body.description
    if (body.stock !== undefined && site === 'strap') updateData.stock = body.stock
    // Gaming posters specific
    if (body.seo_desc !== undefined && site === 'gaming-posters') updateData.seo_desc = body.seo_desc
    if (body.tags !== undefined && site === 'gaming-posters') updateData.tags = body.tags
    if (body.genres !== undefined && site === 'gaming-posters') updateData.genres = body.genres
    if (body.slug !== undefined && site === 'gaming-posters') updateData.slug = body.slug

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const url = `${SUPABASE_URL}/rest/v1/${config.table}?id=eq.${id}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(updateData),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, product: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PATCH — alias pour PUT (compatibilité)
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return PUT(req, ctx)
}

// DELETE — supprimer un produit par ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const site = new URL(req.url).searchParams.get('site') || 'gaming-posters'
    const config = getConfig(site)

    const url = `${SUPABASE_URL}/rest/v1/${config.table}?id=eq.${id}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — upload d'images
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await req.formData()
    const files = formData.getAll('images') as File[]
    const site = formData.get('site') as string || 'gaming-posters'
    const config = getConfig(site)

    if (files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const blob = await put(`products/${id}/${Date.now()}-${file.name}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      uploadedUrls.push(blob.url)
    }

    // Update the product's image
    if (uploadedUrls[0]) {
      const updateData: Record<string, any> = {}
      updateData[config.imageCol] = uploadedUrls[0]

      const url = `${SUPABASE_URL}/rest/v1/${config.table}?id=eq.${id}`
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
    }

    return NextResponse.json({ success: true, urls: uploadedUrls })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
