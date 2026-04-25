'use client'

import React, { useEffect, useRef } from 'react'

interface GlobeMarker {
  location: [number, number]
  size: number
  type?: 'purchase' | 'visit' | 'cart'
}

interface GlobeProps {
  markers?: GlobeMarker[]
}

const RING_COLORS: Record<string, string> = {
  purchase: 'rgba(0,255,136,0.8)',
  cart: 'rgba(255,214,0,0.8)',
  visit: 'rgba(0,229,255,0.8)',
}

const POINT_COLORS: Record<string, string> = {
  purchase: 'rgba(0,255,136,0.9)',
  cart: 'rgba(255,214,0,0.9)',
  visit: 'rgba(0,229,255,0.9)',
}

export function GlobeAceternity({ markers = [] }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let globe: any
    let cancelled = false

    import('globe.gl').then(({ default: GlobeGL }) => {
      if (cancelled || !containerRef.current) return
      const w = containerRef.current.offsetWidth - 40
      const h = containerRef.current.offsetHeight - 40

      globe = new (GlobeGL as any)()(containerRef.current)
      globe
        .width(w)
        .height(h)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('rgba(60,140,255,0.8)')
        .atmosphereAltitude(0.12)
        .pointsData(markers)
        .pointLat((d: any) => d.location[0])
        .pointLng((d: any) => d.location[1])
        .pointColor((d: any) => POINT_COLORS[d.type] || POINT_COLORS.visit)
        .pointAltitude(0.01)
        .pointRadius(0.4)
        .ringsData(markers)
        .ringLat((d: any) => d.location[0])
        .ringLng((d: any) => d.location[1])
        .ringColor((d: any) => () => RING_COLORS[d.type] || RING_COLORS.visit)
        .ringMaxRadius(2)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(2000)

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
    <div ref={containerRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '85%', maxWidth: 700, maxHeight: 700, zIndex: 1, overflow: 'visible' }} />
  )
}
