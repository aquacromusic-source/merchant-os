import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

// GET /api/settings?site=gaming-posters
export async function GET(req: NextRequest) {
  const site = req.nextUrl.searchParams.get('site') || 'gaming-posters'

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?site_id=eq.${encodeURIComponent(site)}&limit=1`,
    {
      headers,
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const rows = await res.json()

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No settings found for this site' }, { status: 404 })
  }

  return NextResponse.json(rows[0])
}

// PUT /api/settings — update settings for a site
export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { site_id, id, created_at, ...updates } = body

  if (!site_id) {
    return NextResponse.json({ error: 'site_id is required' }, { status: 400 })
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?site_id=eq.${encodeURIComponent(site_id)}`,
    {
      method: 'PATCH',
      headers: {
        ...headers,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString(),
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const rows = await res.json()
  return NextResponse.json(rows[0])
}
