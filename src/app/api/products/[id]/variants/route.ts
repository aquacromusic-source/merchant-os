import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const TABLE = 'product_variants'

async function supaFetch(path: string, init?: RequestInit) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
}

// GET — list variants for a product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const site = new URL(req.url).searchParams.get('site') || 'gaming-posters'

    const res = await supaFetch(
      `${TABLE}?product_id=eq.${id}&site=eq.${site}&order=position.asc,created_at.asc`
    )

    if (!res.ok) {
      const err = await res.text()
      // Table might not exist yet
      if (err.includes('product_variants')) {
        return NextResponse.json([])
      }
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT — replace all variants for a product (bulk save)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { site, variants } = body as { site: string; variants: any[] }

    if (!Array.isArray(variants)) {
      return NextResponse.json({ error: 'variants must be an array' }, { status: 400 })
    }

    // Delete existing variants for this product+site
    const delRes = await supaFetch(
      `${TABLE}?product_id=eq.${id}&site=eq.${site}`,
      { method: 'DELETE' }
    )

    if (!delRes.ok) {
      const err = await delRes.text()
      if (err.includes('product_variants')) {
        return NextResponse.json({ error: 'product_variants table does not exist. Run migration first.', migration_needed: true }, { status: 400 })
      }
      return NextResponse.json({ error: err }, { status: delRes.status })
    }

    // Insert new variants
    if (variants.length > 0) {
      const rows = variants.map((v, i) => ({
        product_id: id,
        site: site || 'gaming-posters',
        option1_name: v.option1_name || null,
        option1_value: v.option1_value || null,
        option2_name: v.option2_name || null,
        option2_value: v.option2_value || null,
        sku: v.sku || null,
        price: v.price ?? 0,
        compare_at_price: v.compare_at_price || null,
        stock: v.stock ?? 0,
        barcode: v.barcode || null,
        weight_grams: v.weight_grams || null,
        image_url: v.image_url || null,
        position: v.position ?? i,
      }))

      const insRes = await supaFetch(TABLE, {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(rows),
      })

      if (!insRes.ok) {
        const err = await insRes.text()
        return NextResponse.json({ error: err }, { status: insRes.status })
      }

      const inserted = await insRes.json()
      return NextResponse.json({ success: true, variants: inserted })
    }

    return NextResponse.json({ success: true, variants: [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — add a single variant
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const site = body.site || 'gaming-posters'

    const row = {
      product_id: id,
      site,
      option1_name: body.option1_name || null,
      option1_value: body.option1_value || null,
      option2_name: body.option2_name || null,
      option2_value: body.option2_value || null,
      sku: body.sku || null,
      price: body.price ?? 0,
      compare_at_price: body.compare_at_price || null,
      stock: body.stock ?? 0,
      barcode: body.barcode || null,
      weight_grams: body.weight_grams || null,
      image_url: body.image_url || null,
      position: body.position ?? 0,
    }

    const res = await supaFetch(TABLE, {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(row),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, variant: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE — delete a single variant by variant ID (query param ?variantId=xxx)
export async function DELETE(
  req: NextRequest,
) {
  try {
    const variantId = new URL(req.url).searchParams.get('variantId')
    if (!variantId) {
      return NextResponse.json({ error: 'variantId required' }, { status: 400 })
    }

    const res = await supaFetch(`${TABLE}?id=eq.${variantId}`, { method: 'DELETE' })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
