import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

// GET /api/apps?site=gaming-posters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/apps`)
    url.searchParams.set('site_id', `eq.${siteId}`)
    url.searchParams.set('order', 'created_at.desc')
    url.searchParams.set('select', '*')

    const res = await fetch(url.toString(), { headers })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ apps: Array.isArray(data) ? data : [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, apps: [] }, { status: 500 })
  }
}

// POST /api/apps
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { site, name, description, category, config } = body

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const row = {
      id,
      site_id: site || 'gaming-posters',
      name,
      description: description || null,
      category: category || 'other',
      config: config || {},
      is_active: true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/apps`, {
      method: 'POST',
      headers,
      body: JSON.stringify(row),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status })
    }

    return NextResponse.json({ app: Array.isArray(data) ? data[0] : data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
