import { NextResponse } from 'next/server'

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY
  const stripePublishableConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const googleMapsConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  return NextResponse.json({
    stripe: {
      secretKeyConfigured: stripeConfigured,
      publishableKeyConfigured: stripePublishableConfigured,
    },
    googleMaps: {
      apiKeyConfigured: googleMapsConfigured,
    },
    endpoints: {
      shipping: '/api/checkout/shipping',
      payment: '/api/checkout/payment',
    },
  })
}
