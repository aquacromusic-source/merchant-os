'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Page, Badge, Text } from '@shopify/polaris'

const GlobeAceternity = dynamic(
  () => import('@/components/ui/GlobeAceternity').then(m => ({ default: m.GlobeAceternity })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: '100%', height: 500, background: '#0a1628', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff', fontSize: 12 }}>
        Chargement du globe...
      </div>
    )
  }
)


// Visiteurs en ligne (vert)
const ONLINE_VISITORS = [
  { lat: 48.85, lng: 2.35, city: 'Paris', flag: '🇫🇷', action: 'Consulte GTA V Poster' },
  { lat: 51.50, lng: -0.12, city: 'Londres', flag: '🇬🇧', action: 'Ajoute au panier' },
  { lat: 40.71, lng: -74.00, city: 'New York', flag: '🇺🇸', action: 'Consulte Forza Horizon' },
  { lat: 35.68, lng: 139.69, city: 'Tokyo', flag: '🇯🇵', action: 'Consulte FIFA 22' },
  { lat: 52.52, lng: 13.40, city: 'Berlin', flag: '🇩🇪', action: 'En cours de paiement' },
  { lat: 1.35, lng: 103.82, city: 'Singapour', flag: '🇸🇬', action: 'Consulte Minecraft' },
]

// Villes avec commandes récentes (bleu)
const ORDER_CITIES = [
  { lat: 48.85, lng: 2.35 },   // Paris
  { lat: 41.90, lng: 12.49 },  // Rome
  { lat: -33.86, lng: 151.20 }, // Sydney
  { lat: 19.43, lng: -99.13 }, // Mexico
  { lat: 55.75, lng: 37.61 },  // Moscou
  { lat: 25.20, lng: 55.27 },  // Dubai
]

const MOCK_TOP_LOCATIONS = [
  { city: 'Paris, France', sessions: 4, pct: 100 },
  { city: 'Londres, UK', sessions: 3, pct: 75 },
  { city: 'New York, USA', sessions: 2, pct: 50 },
  { city: 'Tokyo, Japon', sessions: 1, pct: 25 },
]

function PulseCircle({ color }: { color: string }) {
  return (
    <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${color}`, opacity: 0.3, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}/>
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `2px solid ${color}`, opacity: 0.5 }}/>
      <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', background: color, opacity: 0.9 }}/>
    </div>
  )
}

function StatCard({ label, value, color = '#1a1a1a' }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '14px 16px', border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 12, color: '#6d7175', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

export default function LivePage() {
  const [stats, setStats] = useState({ online: 12, sessions: 46820, revenue: 30580, orders: 518 })
  const [carts, setCarts] = useState({ active: 3, checkout: 1, purchased: 2 })
  const [recentOrders] = useState([
    { product: 'Grand Theft Auto V', city: 'Paris', flag: '🇫🇷', price: '29,95 €', ago: '2 min' },
    { product: 'Forza Horizon 5', city: 'Rome', flag: '🇮🇹', price: '39,95 €', ago: '5 min' },
    { product: 'FIFA 22', city: 'Sydney', flag: '🇦🇺', price: '11,95 €', ago: '9 min' },
  ])

  useEffect(() => {
    const iv = setInterval(() => {
      setStats(prev => ({
        online: Math.max(8, prev.online + Math.round((Math.random() - 0.4) * 2)),
        sessions: prev.sessions + Math.round(Math.random() * 3),
        revenue: prev.revenue + Math.round(Math.random() * 40),
        orders: prev.orders + (Math.random() > 0.8 ? 1 : 0),
      }))
      setCarts(prev => ({
        active: Math.max(0, prev.active + Math.round((Math.random() - 0.4) * 2)),
        checkout: Math.max(0, prev.checkout + Math.round(Math.random() - 0.6)),
        purchased: Math.max(0, prev.purchased + (Math.random() > 0.7 ? 1 : 0)),
      }))
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <Page title="Vue en direct" titleMetadata={<Badge tone="success">● Live</Badge>}>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes ping { 75%,100%{ transform:scale(1.8);opacity:0; } }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard label="Visiteurs en ligne" value={stats.online} color="#00c853" />
            <StatCard label="Ventes totales" value={`${stats.revenue.toLocaleString('fr-FR')} €`} />
            <StatCard label="Sessions" value={stats.sessions.toLocaleString('fr-FR')} />
            <StatCard label="Commandes" value={stats.orders} />
          </div>

          {/* Top locations */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Top emplacements</div>
            {MOCK_TOP_LOCATIONS.map((loc, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span>{loc.city}</span>
                  <span style={{ color: '#6d7175' }}>{loc.sessions} sessions</span>
                </div>
                <div style={{ height: 4, background: '#f1f1f1', borderRadius: 2 }}>
                  <div style={{ width: `${loc.pct}%`, height: '100%', background: '#3380ff', borderRadius: 2 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Commandes récentes */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Commandes récentes</div>
            {recentOrders.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid #f1f1f1' : 'none' }}>
                <span style={{ fontSize: 18 }}>{o.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.product}</div>
                  <div style={{ fontSize: 11, color: '#8c9196' }}>{o.city} · il y a {o.ago}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00c853' }}>{o.price}</span>
              </div>
            ))}
          </div>

          {/* Customer behavior */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Comportement clients</span>
              <span style={{ fontSize: 11, color: '#8c9196', background: '#f1f1f1', padding: '2px 8px', borderRadius: 10 }}>en direct</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
              {[
                { count: carts.active, label: 'Paniers actifs', color: '#3380ff' },
                { count: carts.checkout, label: 'En paiement', color: '#7c3aed' },
                { count: carts.purchased, label: 'Achetés', color: '#00c853' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <PulseCircle color={item.color} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{item.count}</div>
                  <div style={{ fontSize: 11, color: '#8c9196' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DROITE — Globe Cobe */}
        <div style={{ background: 'white', borderRadius: 12, padding: '20px 20px 16px', border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-pixel, monospace)', fontSize: 13, fontWeight: 600, color: 'white', letterSpacing: '0.04em' }}>Visiteurs dans le monde</span>
            <Badge tone="success">{`${stats.online} en ligne`}</Badge>
          </div>
          <div style={{ width: '100%', height: 500, borderRadius: 12, overflow: 'hidden', background: 'transparent' }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            {/* Halo néon */}
            <div style={{
              position: 'absolute', inset: -20,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,100,255,0.12) 60%, rgba(0,200,255,0.06) 75%, transparent 85%)',
              pointerEvents: 'none', zIndex: 1,
            }}/>
            {/* Second halo plus vif */}
            <div style={{
              position: 'absolute', inset: -8,
              borderRadius: '50%',
              boxShadow: '0 0 40px rgba(0,150,255,0.25), 0 0 80px rgba(0,100,200,0.12)',
              pointerEvents: 'none', zIndex: 1,
            }}/>
            <GlobeAceternity
              markers={[
                ...ONLINE_VISITORS.map(v => ({ location: [v.lat, v.lng] as [number,number], size: 0.12, color: [0.2, 1.0, 0.4] as [number,number,number] })),
                ...ORDER_CITIES.map(o => ({ location: [o.lat, o.lng] as [number,number], size: 0.09, color: [0.2, 0.55, 1.0] as [number,number,number] })),
              ]}
            />
          </div>
          {/* Activité en cours */}
          <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Activité en cours</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ONLINE_VISITORS.slice(0, 4).map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#33e66a', flexShrink: 0 }}/>
                  <span style={{ color: '#6d7175' }}>{v.flag} {v.city}</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)', marginLeft: 'auto' }}>{v.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
