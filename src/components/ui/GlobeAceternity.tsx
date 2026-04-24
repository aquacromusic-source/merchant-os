'use client'

import React, { useEffect, useRef } from 'react'

interface GlobeProps {
  markers?: { location: [number, number]; size: number; color?: [number, number, number] }[]
}

export function GlobeAceternity({ markers = [] }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let globe: any
    let cancelled = false

    import('globe.gl').then(({ default: GlobeGL }) => {
      if (cancelled || !containerRef.current) return
      const w = containerRef.current.clientWidth || 600

      globe = new (GlobeGL as any)()(containerRef.current)
      globe
        .width(w)
        .height(w)
        .backgroundColor('rgba(2,8,20,1)')
        .globeImageUrl('/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('rgba(80,160,255,0.7)')
        .atmosphereAltitude(0.2)
        .pointsData(markers)
        .pointLat((d: any) => d.location[0])
        .pointLng((d: any) => d.location[1])
        .pointColor((d: any) => {
          const c = d.color || [0.2, 1, 0.4]
          return `rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)},0.9)`
        })
        .pointAltitude(0.04)
        .pointRadius(0.6)
        .ringsData(markers.filter((_, i) => i % 2 === 0))
        .ringLat((d: any) => d.location[0])
        .ringLng((d: any) => d.location[1])
        .ringColor((d: any) => {
          const c = (d as any).color || [0.2, 1, 0.4]
          return () => `rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)},0.5)`
        })
        .ringMaxRadius(3)
        .ringPropagationSpeed(2.5)
        .ringRepeatPeriod(1200)

      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.4
      globe.controls().enableZoom = false
      globe.pointOfView({ lat: 25, lng: -10, altitude: 1.8 }, 0)
    })

    return () => {
      cancelled = true
      try { globe?.destroy?.() } catch {}
    }
  }, [markers.length])

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: 600, margin: '0 auto' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 14, background: 'rgba(0,0,0,0.65)',
        padding: '5px 14px', borderRadius: 20, backdropFilter: 'blur(4px)',
      }}>
        {[['#33e66a', 'En ligne'], ['#3380ff', 'Commandes']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'white' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
