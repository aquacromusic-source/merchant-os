'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Page, Badge, Text, Divider } from '@shopify/polaris'

const MOCK_VISITORS = [
  { lat: 48.85, lng: 2.35, city: 'Paris', country: 'France', flag: '🇫🇷' },
  { lat: 51.50, lng: -0.12, city: 'Londres', country: 'UK', flag: '🇬🇧' },
  { lat: 40.71, lng: -74.00, city: 'New York', country: 'USA', flag: '🇺🇸' },
  { lat: 35.68, lng: 139.69, city: 'Tokyo', country: 'Japon', flag: '🇯🇵' },
  { lat: 52.52, lng: 13.40, city: 'Berlin', country: 'Allemagne', flag: '🇩🇪' },
  { lat: 1.35, lng: 103.82, city: 'Singapour', country: 'Singapour', flag: '🇸🇬' },
]

const MOCK_TOP_LOCATIONS = [
  { city: 'Paris, France', sessions: 4, pct: 100 },
  { city: 'Londres, UK', sessions: 3, pct: 75 },
  { city: 'New York, USA', sessions: 2, pct: 50 },
  { city: 'Tokyo, Japon', sessions: 1, pct: 25 },
]

function GlobeShopify({ visitors }: { visitors: typeof MOCK_VISITORS }) {
  const ref = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return
    let cancelled = false

    import('globe.gl').then(({ default: GlobeGL }) => {
      if (cancelled || !ref.current) return

      const globe = new (GlobeGL as any)()(ref.current)
      globeRef.current = globe

      globe
        .width(ref.current.offsetWidth || 600)
        .height(ref.current.offsetHeight || 600)
        .backgroundColor('rgba(0,0,0,0)')
        .showGlobe(true)
        .showAtmosphere(true)
        .atmosphereColor('rgba(150,230,220,0.5)')
        .atmosphereAltitude(0.18)
        // Pas de texture — globe blanc
        .globeImageUrl('')
        // Hexagones turquoise style Shopify
        .hexBinPointsData(
          (() => {
            const pts: {lat: number, lng: number}[] = []
            for (let lat = -85; lat <= 85; lat += 3.5) {
              for (let lng = -180; lng <= 180; lng += 3.5) {
                pts.push({ lat, lng })
              }
            }
            return pts
          })()
        )
        .hexBinPointLat('lat')
        .hexBinPointLng('lng')
        .hexBinResolution(3)
        .hexTopColor(() => 'rgba(80,200,190,0.95)')
        .hexSideColor(() => 'rgba(80,200,190,0.4)')
        .hexAltitude(0.006)
        // Pins visiteurs violets
        .pointsData(visitors)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(() => '#7c3aed')
        .pointAltitude(0.06)
        .pointRadius(0.5)

      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.35
      globe.controls().enableZoom = false
      globe.pointOfView({ lat: 25, lng: -15, altitude: 1.6 }, 0)
    })

    return () => {
      cancelled = true
      if (globeRef.current) { try { globeRef.current._destructor?.() } catch {} }
    }
  }, [visitors])

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

// Cercle animé style Shopify (Customer behavior)
function PulseCircle({ color }: { color: string }) {
  return (
    <div style={{ position: 'relative', width: 52, height: 52 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: `2px solid ${color}`, opacity: 0.3,
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
      }}/>
      <div style={{
        position: 'absolute', inset: 6, borderRadius: '50%',
        border: `2px solid ${color}`, opacity: 0.5,
      }}/>
      <div style={{
        position: 'absolute', inset: 14, borderRadius: '50%',
        background: color, opacity: 0.8,
      }}/>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', borderRadius: 10, padding: '14px 16px',
      border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 12, color: '#6d7175', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

export default function LivePage() {
  const [stats, setStats] = useState({ online: 12, sessions: 46820, revenue: 30580, orders: 518 })
  const [tick, setTick] = useState(0)
  const [carts, setCarts] = useState({ active: 3, checkout: 1, purchased: 2 })

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1)
      setStats(prev => ({
        online: Math.max(8, prev.online + Math.round((Math.random() - 0.4) * 2)),
        sessions: prev.sessions + Math.round(Math.random() * 3),
        revenue: prev.revenue + Math.round(Math.random() * 30),
        orders: prev.orders + (Math.random() > 0.8 ? 1 : 0),
      }))
      setCarts(prev => ({
        active: Math.max(0, prev.active + Math.round((Math.random() - 0.4) * 2)),
        checkout: Math.max(0, prev.checkout + Math.round((Math.random() - 0.5))),
        purchased: Math.max(0, prev.purchased + (Math.random() > 0.7 ? 1 : 0)),
      }))
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <Page title="Vue en direct" titleMetadata={<Badge tone="success">Live</Badge>}>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>

        {/* GAUCHE — Données */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* En-tête légende */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed' }}/>
              <span style={{ fontSize: 13, color: '#6d7175' }}>Commandes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }}/>
              <span style={{ fontSize: 13, color: '#6d7175' }}>Visiteurs</span>
            </div>
          </div>

          {/* KPIs 2x2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard label="Visiteurs en ce moment" value={stats.online} />
            <StatCard label="Ventes totales" value={`${stats.revenue.toLocaleString('fr-FR')} €`} />
            <StatCard label="Sessions totales" value={stats.sessions.toLocaleString('fr-FR')}
              sub={<div style={{ height: 3, background: '#e5e5e5', borderRadius: 2 }}><div style={{ width: '60%', height: '100%', background: '#2563eb', borderRadius: 2 }}/></div>}
            />
            <StatCard label="Commandes totales" value={stats.orders}
              sub={<div style={{ height: 3, background: '#e5e5e5', borderRadius: 2 }}><div style={{ width: '40%', height: '100%', background: '#7c3aed', borderRadius: 2 }}/></div>}
            />
          </div>

          {/* Top locations */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Top emplacements</span>
            </div>
            {MOCK_TOP_LOCATIONS.map((loc, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#1a1a1a', marginBottom: 4 }}>
                  <span>{loc.city}</span>
                  <span style={{ color: '#6d7175' }}>{loc.sessions} session{loc.sessions > 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: 4, background: '#f1f1f1', borderRadius: 2 }}>
                  <div style={{ width: `${loc.pct}%`, height: '100%', background: '#2563eb', borderRadius: 2 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Customers */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Clients</div>
            {MOCK_VISITORS.slice(0, 3).map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: i < 2 ? '1px solid #f1f1f1' : 'none' }}>
                <span style={{ fontSize: 18 }}>{v.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v.city}</div>
                  <div style={{ fontSize: 11, color: '#8c9196' }}>Consulte un produit</div>
                </div>
              </div>
            ))}
          </div>

          {/* Customer behavior */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Comportement clients</span>
              <span style={{ fontSize: 12, color: '#8c9196', background: '#f1f1f1', padding: '2px 8px', borderRadius: 10 }}>10 min</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <PulseCircle color="#2563eb" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{carts.active}</div>
                <div style={{ fontSize: 11, color: '#8c9196' }}>Paniers actifs</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <PulseCircle color="#7c3aed" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{carts.checkout}</div>
                <div style={{ fontSize: 11, color: '#8c9196' }}>En paiement</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <PulseCircle color="#00c853" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{carts.purchased}</div>
                <div style={{ fontSize: 11, color: '#8c9196' }}>Achetés</div>
              </div>
            </div>
          </div>
        </div>

        {/* DROITE — Globe */}
        <div style={{
          background: '#f8f9fa', borderRadius: 12, overflow: 'hidden',
          height: 700, position: 'sticky', top: 80,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GlobeShopify visitors={MOCK_VISITORS} />
        </div>
      </div>
    </Page>
  )
}
