import { NextRequest, NextResponse } from 'next/server'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency = 'eur', site, metadata = {}, shipping } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être supérieur à 0' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe non configuré' },
        { status: 500, headers: corsHeaders() }
      )
    }

    // Use Stripe REST API directly (no SDK dependency needed)
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(Math.round(amount * 100)),
        currency,
        'metadata[site]': site || 'gaming-posters',
        'metadata[source]': 'merchant-os-checkout',
        ...Object.fromEntries(
          Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, String(v)])
        ),
        'automatic_payment_methods[enabled]': 'true',
        ...(shipping?.name ? { 'shipping[name]': shipping.name } : {}),
        ...(shipping?.address?.line1 ? { 'shipping[address][line1]': shipping.address.line1 } : {}),
        ...(shipping?.address?.line2 ? { 'shipping[address][line2]': shipping.address.line2 } : {}),
        ...(shipping?.address?.city ? { 'shipping[address][city]': shipping.address.city } : {}),
        ...(shipping?.address?.postal_code ? { 'shipping[address][postal_code]': shipping.address.postal_code } : {}),
        ...(shipping?.address?.country ? { 'shipping[address][country]': shipping.address.country } : {}),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Erreur Stripe' },
        { status: res.status, headers: corsHeaders() }
      )
    }

    return NextResponse.json(
      {
        clientSecret: data.client_secret,
        paymentIntentId: data.id,
      },
      { headers: corsHeaders() }
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders() }
    )
  }
}
