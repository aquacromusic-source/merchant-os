import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site') || 'gaming-posters'

  const url = new URL(`${SUPABASE_URL}/rest/v1/orders`)
  url.searchParams.set('select', '*')
  url.searchParams.set('site_id', `eq.${siteId}`)
  url.searchParams.set('order', 'created_at.desc')
  url.searchParams.set('limit', '200')

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

  const data = await res.json()

  const orders = (data || []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number || o.id,
    customer: o.customer_email || o.customer || 'Client inconnu',
    date: o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '',
    total: parseFloat(o.total) || 0,
    payment: o.payment || { key: 'paid', tone: 'success', label: 'Payée' },
    fulfill: o.fulfill || { key: 'unfulfilled', tone: 'warn', label: 'Non traitée' },
    items: Array.isArray(o.items) ? o.items : [],
    channel: o.channel || 'Boutique en ligne',
    site_id: o.site_id,
    tags: o.tags || [],
    risk: o.risk || 'low',
  }))

  return NextResponse.json({ orders })
}
