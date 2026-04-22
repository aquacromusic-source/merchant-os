export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!
    
    const url = `${SUPABASE_URL}/rest/v1/posters?slug=eq.${id}&is_active=eq.true&limit=1`
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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { put } from '@vercel/blob'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://depztempjsdlpnfcjxir.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY!
)

// PATCH — mettre à jour un produit
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const { title, seo_desc, tags, collections, status, price, genres } = body

    // Construire l'objet de mise à jour
    const updateData: Record<string, any> = {}
    if (title !== undefined) updateData.title = title
    if (seo_desc !== undefined) updateData.seo_desc = seo_desc
    if (tags !== undefined) updateData.tags = tags
    if (status !== undefined) updateData.is_active = status === 'live'
    if (price !== undefined) updateData.price = price
    if (genres !== undefined) updateData.genres = genres

    // Essayer avec igdb_id d'abord, sinon avec slug
    let result
    // Si l'id est numérique, chercher par ID
    if (!isNaN(Number(id.replace('P-', '')))) {
      // ID mock → chercher dans posters par position
      const { data, error } = await supabase
        .from('posters')
        .select('id, slug')
        .limit(50)

      if (error) throw error
      // Pour les IDs mock (P-1000, P-1001...), mapper à la DB
      const idx = parseInt(id.replace('P-', '')) - 1000
      const poster = data?.[idx]
      if (poster) {
        result = await supabase
          .from('posters')
          .update(updateData)
          .eq('id', poster.id)
      }
    } else {
      // Sinon chercher par slug
      result = await supabase
        .from('posters')
        .update(updateData)
        .eq('slug', id)
    }

    if (result?.error) throw result.error

    return NextResponse.json({ success: true, updated: updateData })
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

    // Mettre à jour le premier en image_url si pas encore défini
    if (uploadedUrls[0]) {
      // Chercher le poster par ID mock
      const { data } = await supabase
        .from('posters')
        .select('id, images')
        .limit(50)

      const idx = parseInt(id.replace('P-', '')) - 1000
      const poster = data?.[idx]

      if (poster) {
        const existingImages = poster.images || []
        await supabase
          .from('posters')
          .update({
            images: [...existingImages, ...uploadedUrls],
            image_url: poster.images?.length ? poster.images[0] : uploadedUrls[0],
          })
          .eq('id', poster.id)
      }
    }

    return NextResponse.json({ success: true, urls: uploadedUrls })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
