'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Page, Card, BlockStack, InlineStack, Text, Badge, Divider, InlineGrid } from '@shopify/polaris'

// Données mock — visiteurs en direct sur le globe
const MOCK_VISITORS = [
  { lat: 48.85, lng: 2.35, city: 'Paris', country: 'France', flag: '🇫🇷', action: 'Consulte GTA V Poster', value: null },
  { lat: 51.50, lng: -0.12, city: 'Londres', country: 'UK', flag: '🇬🇧', action: 'Paiement en cours', value: '39,95 €' },
  { lat: 40.71, lng: -74.00, city: 'New York', country: 'USA', flag: '🇺🇸', action: 'Consulte Forza Horizon', value: null },
  { lat: 35.68, lng: 139.69, city: 'Tokyo', country: 'Japon', flag: '🇯🇵', action: 'Consulte Assassin\'s Creed', value: null },
  { lat: 52.52, lng: 13.40, city: 'Berlin', country: 'Allemagne', flag: '🇩🇪', action: 'Ajoute au panier', value: '11,95 €' },
  { lat: 41.90, lng: 12.49, city: 'Rome', country: 'Italie', flag: '🇮🇹', action: 'Consulte FIFA 22', value: null },
  { lat: -33.86, lng: 151.20, city: 'Sydney', country: 'Australie', flag: '🇦🇺', action: 'Paiement en cours', value: '29,95 €' },
  { lat: 19.43, lng: -99.13, city: 'Mexico', country: 'Mexique', flag: '🇲🇽', action: 'Consulte Call of Duty', value: null },
  { lat: 55.75, lng: 37.61, city: 'Moscou', country: 'Russie', flag: '🇷🇺', action: 'Consulte Minecraft', value: null },
  { lat: 1.35, lng: 103.82, city: 'Singapour', country: 'Singapour', flag: '🇸🇬', action: 'Achat confirmé', value: '74,95 €' },
  { lat: 25.20, lng: 55.27, city: 'Dubaï', country: 'UAE', flag: '🇦🇪', action: 'Ajoute au panier', value: '11,95 €' },
  { lat: -23.55, lng: -46.63, city: 'São Paulo', country: 'Brésil', flag: '🇧🇷', action: 'Consulte Spider-Man', value: null },
]

const MOCK_SALES = [
  { product: 'Grand Theft Auto V', qty: 3, revenue: '89,85 €', flag: '🇫🇷', ago: 'il y a 2 min' },
  { product: 'Forza Horizon 5', qty: 1, revenue: '39,95 €', flag: '🇬🇧', ago: 'il y a 5 min' },
  { product: 'Assassin\'s Creed Valhalla', qty: 2, revenue: '23,90 €', flag: '🇩🇪', ago: 'il y a 8 min' },
  { product: 'FIFA 22', qty: 1, revenue: '11,95 €', flag: '🇮🇹', ago: 'il y a 11 min' },
  { product: 'Spider-Man 2', qty: 4, revenue: '159,80 €', flag: '🇸🇬', ago: 'il y a 14 min' },
]

// Globe 3D style Shopify — hexagonal cyan sur fond clair
function Globe3D({ visitors }: { visitors: typeof MOCK_VISITORS }) {
  const ref = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return
    let cancelled = false

    import('globe.gl').then(({ default: GlobeGL }) => {
      if (cancelled || !ref.current) return

      const globe = new (GlobeGL as any)()(ref.current)
      globeRef.current = globe

      // Style Shopify : globe blanc avec points dotted cyan
      globe
        .width(ref.current.offsetWidth || 500)
        .height(ref.current.offsetHeight || 500)
        .backgroundColor('#0a1628')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .showAtmosphere(true)
        .atmosphereColor('rgba(0,180,255,0.6)')
        .atmosphereAltitude(0.12)
        // Points visiteurs violets pulsants
        .pointsData(visitors)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(() => '#00ff88')
        .pointAltitude(0.03)
        .pointRadius(0.7)
        // Anneaux autour des visiteurs actifs
        .ringsData(visitors.filter(v => v.value))
        .ringLat('lat')
        .ringLng('lng')
        .ringColor(() => () => 'rgba(0,255,136,0.6)')
        .ringMaxRadius(3)
        .ringPropagationSpeed(3)
        .ringRepeatPeriod(1200)

      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.4
      globe.controls().enableZoom = false
      globe.pointOfView({ lat: 25, lng: -10, altitude: 1.8 }, 0)
    })

    return () => {
      cancelled = true
      if (globeRef.current) {
        try { globeRef.current._destructor?.() } catch {}
      }
    }
  }, [visitors])

  return (
    <div ref={ref} style={{ width: '100%', height: 520, borderRadius: 12, overflow: 'hidden', background: '#0a1628' }} />
  )
}

// Compteur animé
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = display
    const end = value
    const duration = 800
    const startTime = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.round(start + (end - start) * progress))
      if (progress >= 1) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return <span>{display.toLocaleString('fr-FR')}{suffix}</span>
}

export default function LivePage() {
  const [visitors, setVisitors] = useState(MOCK_VISITORS)
  const [stats, setStats] = useState({
    online: 12,
    sessions: 46820,
    revenue: 30580,
    orders: 518,
    conversion: 0.77,
  })
  const [activeVisitors, setActiveVisitors] = useState(MOCK_VISITORS.slice(0, 6))
  const [tick, setTick] = useState(0)

  // Simuler des mises à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      setStats(prev => ({
        ...prev,
        online: Math.max(8, prev.online + Math.round((Math.random() - 0.4) * 3)),
        sessions: prev.sessions + Math.round(Math.random() * 5),
        revenue: prev.revenue + Math.round(Math.random() * 50),
        orders: prev.orders + (Math.random() > 0.7 ? 1 : 0),
      }))
      // Faire tourner les visiteurs actifs
      setActiveVisitors(prev => {
        const shuffled = [...MOCK_VISITORS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 6)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const KPIS = [
    { label: 'Visiteurs en ligne', value: stats.online, suffix: '', color: '#00e5ff', icon: '🟢', live: true },
    { label: 'Sessions aujourd\'hui', value: stats.sessions, suffix: '', color: '#ffd600', icon: '📊', live: false },
    { label: 'Ventes totales', value: stats.revenue, suffix: ' €', color: '#00c853', icon: '💰', live: false },
    { label: 'Commandes', value: stats.orders, suffix: '', color: '#7c3aed', icon: '📦', live: false },
  ]

  return (
    <Page title="Vue en direct" titleMetadata={<Badge tone="success">Live</Badge>}>
      <BlockStack gap="400">
        {/* KPIs */}
        <InlineGrid columns={4} gap="300">
          {KPIS.map((k, i) => (
            <Card key={i}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm" tone="subdued">{k.label}</Text>
                  {k.live && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#00c853' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853', animation: 'pulse 1.5s infinite' }}/>
                      Live
                    </span>
                  )}
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold">
                  <span style={{ color: k.color }}>
                    <AnimatedCounter value={k.value} suffix={k.suffix} />
                  </span>
                </Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, lg: '380px 1fr' }} gap="400">
          {/* Activité en direct — GAUCHE */}
          <BlockStack gap="400">
            {/* Visiteurs actifs */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Activité en cours</Text>
                  <span style={{ fontSize: 11, color: '#8c9196' }}>mise à jour auto</span>
                </InlineStack>
                <BlockStack gap="0">
                  {activeVisitors.map((v, i) => (
                    <div key={`${v.city}-${tick}-${i}`}>
                      {i > 0 && <Divider />}
                      <div style={{ padding: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{v.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{v.city}</div>
                          <div style={{ fontSize: 12, color: '#6d7175', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.action}</div>
                        </div>
                        {v.value && (
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#00c853', flexShrink: 0 }}>{v.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Ventes récentes */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes récentes</Text>
                <BlockStack gap="0">
                  {MOCK_SALES.map((s, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{s.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.product}</div>
                          <div style={{ fontSize: 11, color: '#8c9196' }}>{s.qty} article{s.qty > 1 ? 's' : ''} · {s.ago}</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', flexShrink: 0 }}>{s.revenue}</span>
                      </div>
                    </div>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>

          {/* Globe — DROITE */}
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Visiteurs dans le monde</Text>
                <Badge tone="success">{`${stats.online} en ligne`}</Badge>
              </InlineStack>
              <Globe3D visitors={visitors} />
              <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                Données en temps réel — mise à jour toutes les 30 secondes
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* Comportement visiteurs */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingSm" fontWeight="semibold">Entonnoir de conversion</Text>
            <InlineGrid columns={4} gap="400">
              {[
                { label: 'Visiteurs', value: stats.online, color: '#00e5ff', pct: 100 },
                { label: 'Ont consulté un produit', value: Math.round(stats.online * 0.68), color: '#7c3aed', pct: 68 },
                { label: 'Ont ajouté au panier', value: Math.round(stats.online * 0.23), color: '#ffd600', pct: 23 },
                { label: 'En cours de paiement', value: Math.round(stats.online * 0.08), color: '#00c853', pct: 8 },
              ].map((step, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: step.color }}>{String(step.value)}</div>
                  <div style={{ fontSize: 12, color: '#6d7175', marginBottom: 8 }}>{step.label}</div>
                  <div style={{ height: 4, background: '#f1f1f1', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${step.pct}%`, background: step.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#8c9196', marginTop: 4 }}>{step.pct}%</div>
                </div>
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
      </BlockStack>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </Page>
  )
}
