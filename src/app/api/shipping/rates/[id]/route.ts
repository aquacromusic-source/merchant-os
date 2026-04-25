import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updateData: Record<string, any> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.carrier !== undefined) updateData.carrier = body.carrier
    if (body.price !== undefined) updateData.price = body.price
    if (body.delivery_time !== undefined) updateData.delivery_time = body.delivery_time
    if (body.min_order !== undefined) updateData.min_order = body.min_order
    if (body.max_order !== undefined) updateData.max_order = body.max_order
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const url = `${SUPABASE_URL}/rest/v1/shipping_rates?id=eq.${params.id}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, rate: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/shipping_rates?id=eq.${params.id}`
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
