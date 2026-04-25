import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id = `rate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const insertData = {
      id,
      zone_id: body.zone_id,
      site_id: body.site || 'gaming-posters',
      name: body.name,
      carrier: body.carrier || null,
      price: body.price ?? 0,
      delivery_time: body.delivery_time || null,
      min_order: body.min_order ?? 0,
      max_order: body.max_order ?? null,
      is_active: true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/shipping_rates`, {
      method: 'POST',
      headers,
      body: JSON.stringify(insertData),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, rate: data[0] }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
