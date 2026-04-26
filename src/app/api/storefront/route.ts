import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  const url = new URL(`${SUPABASE_URL}/rest/v1/themes`)
  url.searchParams.set('select', '*')
  url.searchParams.set('site_id', `eq.${siteId}`)
  url.searchParams.set('order', 'created_at.desc')

  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const data: any[] = await res.json()
  const themes = data || []

  const current = themes.find((t: any) => t.role === 'current') || themes[0] || null
  const drafts = themes.filter((t: any) => t !== current)

  return NextResponse.json({ current, drafts })
}
