'use client'

import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
const GlobeAceternity = dynamic(
  () => import('@/components/ui/GlobeAceternity').then(m => ({ default: m.GlobeAceternity })),
  { ssr: false }
)
import { Page } from '@shopify/polaris'
import { useSite } from '@/contexts/SiteContext'

// Country → flag mapping
const FLAGS: Record<string, string> = {
  France: '\u{1F1EB}\u{1F1F7}', 'United States': '\u{1F1FA}\u{1F1F8}', Germany: '\u{1F1E9}\u{1F1EA}',
  'United Kingdom': '\u{1F1EC}\u{1F1E7}', Japan: '\u{1F1EF}\u{1F1F5}', Canada: '\u{1F1E8}\u{1F1E6}',
  Australia: '\u{1F1E6}\u{1F1FA}', Italy: '\u{1F1EE}\u{1F1F9}', Spain: '\u{1F1EA}\u{1F1F8}',
  Netherlands: '\u{1F1F3}\u{1F1F1}', Belgium: '\u{1F1E7}\u{1F1EA}', Switzerland: '\u{1F1E8}\u{1F1ED}',
  Brazil: '\u{1F1E7}\u{1F1F7}', Mexico: '\u{1F1F2}\u{1F1FD}', India: '\u{1F1EE}\u{1F1F3}',
  Singapore: '\u{1F1F8}\u{1F1EC}', 'United Arab Emirates': '\u{1F1E6}\u{1F1EA}',
  Sweden: '\u{1F1F8}\u{1F1EA}', Portugal: '\u{1F1F5}\u{1F1F9}', Poland: '\u{1F1F5}\u{1F1F1}',
}

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'maintenant'
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

interface LiveData {
  realtime: {
    activeUsers: number
    visitors: { lat: number; lng: number; country: string; city: string; type: string }[]
    topLocations: { city: string; sessions: number; pct: number }[]
  }
  orders: { lat: number; lng: number; amount: number; type: string }[]
  recentOrders: { product: string; city: string; country: string; price: number; created_at: string }[]
}

export default function LivePage() {
  const { activeSite } = useSite()
  const [liveData, setLiveData] = useState<LiveData | null>(null)
  const [kpis, setKpis] = useState({ todayRevenue: 0, todayOrders: 0, activeUsers: 0, todaySessions: 0 })
  const [carts, setCarts] = useState({ active: 0, checkout: 0, purchased: 0 })
  const [error, setError] = useState(false)

  const fetchLiveData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/live?site=${activeSite}`)
      if (!res.ok) throw new Error()
      const data: LiveData = await res.json()
      setLiveData(data)
      setError(false)

      // Derive cart behavior from realtime visitors
      const visitors = data.realtime.visitors || []
      setCarts({
        active: visitors.filter(v => v.type === 'visit').length,
        checkout: Math.max(0, Math.floor(visitors.length * 0.1)),
        purchased: visitors.filter(v => v.type === 'purchase').length,
      })
    } catch {
      setError(true)
    }
  }, [activeSite])

  const fetchKPIs = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/kpis?site=${activeSite}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (!data.error) setKpis(data)
    } catch {}
  }, [activeSite])

  useEffect(() => {
    fetchLiveData()
    fetchKPIs()
    const liveInterval = setInterval(fetchLiveData, 30000)
    const kpiInterval = setInterval(fetchKPIs, 60000)
    return () => {
      clearInterval(liveInterval)
      clearInterval(kpiInterval)
    }
  }, [fetchLiveData, fetchKPIs])

  // Build globe markers from live data
  const globeMarkers = liveData ? [
    ...(liveData.realtime.visitors || []).map(v => ({
      location: [v.lat, v.lng] as [number, number],
      size: 0.12,
      type: (v.type === 'purchase' ? 'purchase' : 'visit') as 'purchase' | 'visit',
    })),
    ...(liveData.orders || []).map(o => ({
      location: [o.lat, o.lng] as [number, number],
      size: Math.min(0.2, 0.06 + (o.amount / 500) * 0.14),
      type: 'purchase' as const,
    })),
  ] : []

  const topLocations = liveData?.realtime.topLocations || []
  const recentOrders = liveData?.recentOrders || []

  return (
    <Page title="">
      <style>{`
        @keyframes ping { 75%,100%{ transform:scale(1.8);opacity:0; } }
      `}</style>

      {error && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '8px 14px', marginBottom: 12, fontSize: 12 }}>
          {"Connexion GA4 non configurée — ajoutez GOOGLE_ANALYTICS_CREDENTIALS et GA4_PROPERTY_* dans vos variables d'environnement."}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'stretch' }}>

        {/* GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard label="Visiteurs en ligne" value={kpis.activeUsers} color="#00c853" />
            <StatCard label="Ventes aujourd'hui" value={`${kpis.todayRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} \u20AC`} />
            <StatCard label="Sessions" value={kpis.todaySessions.toLocaleString('fr-FR')} />
            <StatCard label="Commandes" value={kpis.todayOrders} />
          </div>

          {/* Top locations */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Top emplacements</div>
            {topLocations.length > 0 ? topLocations.map((loc, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span>{loc.city}</span>
                  <span style={{ color: '#6d7175' }}>{loc.sessions} sessions</span>
                </div>
                <div style={{ height: 4, background: '#f1f1f1', borderRadius: 2 }}>
                  <div style={{ width: `${loc.pct}%`, height: '100%', background: '#3380ff', borderRadius: 2 }}/>
                </div>
              </div>
            )) : (
              <div style={{ fontSize: 12, color: '#8c9196' }}>En attente de données GA4</div>
            )}
          </div>

          {/* Commandes récentes */}
          <div style={{ background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Commandes récentes</div>
            {recentOrders.length > 0 ? recentOrders.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid #f1f1f1' : 'none' }}>
                <span style={{ fontSize: 18 }}>{FLAGS[o.country] || '\u{1F30D}'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.product}</div>
                  <div style={{ fontSize: 11, color: '#8c9196' }}>{o.city} {'\u00B7'} {timeAgo(o.created_at)}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00c853' }}>{o.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {'\u20AC'}</span>
              </div>
            )) : (
              <div style={{ fontSize: 12, color: '#8c9196' }}>Aucune commande récente</div>
            )}
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

        {/* DROITE — Globe */}
        <div style={{ backgroundImage: "url('/space-background.webp')", backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 'auto', overflow: 'visible', padding: 40 }}>
          <GlobeAceternity markers={globeMarkers} />
        </div>
      </div>
    </Page>
  )
}
