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
      const cw = containerRef.current.clientWidth || 600
      const ch = containerRef.current.clientHeight || 600
      // Use ~80% of available space, keep square (proportional)
      const size = Math.round(Math.min(cw, ch) * 0.82)
      const w = size
      const h = size

      globe = new (GlobeGL as any)()(containerRef.current)
      globe
        .width(w)
        .height(h)
        .backgroundColor('#000000')
        .globeImageUrl('/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('rgba(60,140,255,0.6)')
        .atmosphereAltitude(0.25)
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
      globe.pointOfView({ lat: 20, lng: -10, altitude: 1.5 }, 0)
    })

    return () => {
      cancelled = true
      try { globe?.destroy?.() } catch {}
    }
  }, [markers.length])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
  )
}
