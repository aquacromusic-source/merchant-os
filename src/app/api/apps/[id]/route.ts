import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

// GET /api/apps/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/apps`)
    url.searchParams.set('id', `eq.${params.id}`)
    url.searchParams.set('select', '*')

    const res = await fetch(url.toString(), { headers })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    return NextResponse.json({ app: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT /api/apps/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const allowedFields = ['name', 'description', 'category', 'config', 'is_active']
    const updates: Record<string, any> = {}

    for (const key of allowedFields) {
      if (key in body) {
        updates[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const url = new URL(`${SUPABASE_URL}/rest/v1/apps`)
    url.searchParams.set('id', `eq.${params.id}`)

    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    return NextResponse.json({ app: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/apps/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/apps`)
    url.searchParams.set('id', `eq.${params.id}`)

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers,
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ success: true, deleted: Array.isArray(data) ? data[0] : data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
