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
      const h = containerRef.current.clientHeight || 600
      // Shrink the globe to 40% — full sphere visible as a small blue ball with margin all around
      const scale = 0.4
      const gw = Math.round(w * scale)
      const gh = Math.round(h * scale)

      globe = new (GlobeGL as any)()(containerRef.current)
      globe
        .width(gw)
        .height(gh)
        .backgroundColor('#000000')
        .globeImageUrl('/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('rgba(60,130,255,0.4)')
        .atmosphereAltitude(0.15)
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
      globe.pointOfView({ lat: 20, lng: -10, altitude: 2.8 }, 0)

      // Center the reduced-size canvas inside the container
      const canvas = containerRef.current.querySelector('canvas')
      if (canvas) {
        canvas.style.display = 'block'
        canvas.style.margin = 'auto'
      }
    })

    return () => {
      cancelled = true
      try { globe?.destroy?.() } catch {}
    }
  }, [markers.length])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
  )
}
