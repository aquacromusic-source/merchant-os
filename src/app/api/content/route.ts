import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

async function supabaseFetch(table: string, siteId: string) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  url.searchParams.set('select', '*')
  url.searchParams.set('site_id', `eq.${siteId}`)
  url.searchParams.set('order', 'created_at.desc')

  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })

  if (!res.ok) return []
  return await res.json()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  const [pages, articles] = await Promise.all([
    supabaseFetch('pages', siteId),
    supabaseFetch('blog_posts', siteId),
  ])

  return NextResponse.json({
    pages: pages || [],
    articles: articles || [],
  })
}
