'use client'

import React, { useEffect, useRef } from 'react'

interface Marker {
  location: [number, number]
  size: number
  color?: [number, number, number]
}

interface GlobeProps {
  markers?: Marker[]
}

// Coordonnées simplifiées des continents pour dessin canvas
const CONTINENT_PATHS = [
  // Europe
  [[2,48],[8,47],[14,50],[18,54],[20,60],[15,65],[10,63],[5,58],[0,50],[2,48]],
  // Afrique
  [[-5,35],[30,37],[45,10],[42,-5],[35,-30],[18,-35],[-18,-28],[-18,15],[0,15],[-5,35]],
  // Amérique du Nord
  [[-125,48],[-65,45],[-60,50],[-50,60],[-80,65],[-100,70],[-140,60],[-165,55],[-140,48],[-125,48]],
  // Amérique du Sud
  [[-80,10],[-50,5],[-35,-8],[-40,-20],[-55,-35],[-70,-55],[-75,-40],[-78,-5],[-80,10]],
  // Asie
  [[25,35],[55,25],[75,15],[100,10],[120,20],[140,35],[130,50],[100,55],[60,65],[30,60],[25,35]],
  // Australie
  [[115,-20],[130,-15],[150,-25],[150,-38],[140,-38],[120,-35],[115,-28],[115,-20]],
]

function latLngToXY(lat: number, lng: number, w: number, h: number): [number, number] {
  const x = (lng + 180) / 360 * w
  const y = (90 - lat) / 180 * h
  return [x, y]
}

function drawGlobe(canvas: HTMLCanvasElement, markers: Marker[], phi: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.44

  ctx.clearRect(0, 0, w, h)

  // Fond globe
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r)
  grad.addColorStop(0, '#1a2a6c')
  grad.addColorStop(0.5, '#0a1540')
  grad.addColorStop(1, '#040a20')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Halo
  const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.15)
  halo.addColorStop(0, 'rgba(100,180,255,0.15)')
  halo.addColorStop(1, 'rgba(100,180,255,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2)
  ctx.fillStyle = halo
  ctx.fill()

  // Grille méridiens
  ctx.strokeStyle = 'rgba(100,150,255,0.08)'
  ctx.lineWidth = 0.5
  for (let lng = -180; lng <= 180; lng += 30) {
    ctx.beginPath()
    for (let lat = -90; lat <= 90; lat += 5) {
      const a = (lng + phi * (180 / Math.PI)) % 360
      const x = cx + r * Math.cos(lat * Math.PI / 180) * Math.sin(a * Math.PI / 180)
      const y = cy - r * Math.sin(lat * Math.PI / 180)
      if (lat === -90) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Continents — grille dense de points
  for (const path of CONTINENT_PATHS) {
    // Dessiner les bordures avec des points
    for (let i = 0; i < path.length - 1; i++) {
      const [lng1, lat1] = path[i]
      const [lng2, lat2] = path[i + 1]
      for (let t = 0; t <= 1; t += 0.03) {
        const lng = lng1 + (lng2 - lng1) * t
        const lat = lat1 + (lat2 - lat1) * t
        const angle = (lng + phi * 180 / Math.PI) * Math.PI / 180
        const cosLat = Math.cos(lat * Math.PI / 180)
        const sinLat = Math.sin(lat * Math.PI / 180)
        const x3d = cosLat * Math.sin(angle)
        const y3d = sinLat
        const z3d = cosLat * Math.cos(angle)
        if (z3d > -0.05) {
          const px = cx + r * x3d
          const py = cy - r * y3d
          const alpha = Math.max(0, z3d * 0.9 + 0.4)
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(150,210,255,${alpha})`
          ctx.fill()
        }
      }
    }
    // Remplir l'intérieur des continents avec une grille
    const lngs = path.map(p => p[0])
    const lats = path.map(p => p[1])
    const minLng = Math.min(...lngs) - 2
    const maxLng = Math.max(...lngs) + 2
    const minLat = Math.min(...lats) - 2
    const maxLat = Math.max(...lats) + 2
    for (let lat = minLat; lat <= maxLat; lat += 4) {
      for (let lng = minLng; lng <= maxLng; lng += 4) {
        const angle = (lng + phi * 180 / Math.PI) * Math.PI / 180
        const cosLat = Math.cos(lat * Math.PI / 180)
        const sinLat = Math.sin(lat * Math.PI / 180)
        const x3d = cosLat * Math.sin(angle)
        const y3d = sinLat
        const z3d = cosLat * Math.cos(angle)
        if (z3d > 0.05) {
          const px = cx + r * x3d
          const py = cy - r * y3d
          ctx.beginPath()
          ctx.arc(px, py, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(120,190,255,${z3d * 0.5})`
          ctx.fill()
        }
      }
    }
  }

  // Markers avec rings pulsants
  const now = Date.now()
  for (const m of markers) {
    const [lat, lng] = m.location
    const angle = (lng + phi * 180 / Math.PI) * Math.PI / 180
    const cosLat = Math.cos(lat * Math.PI / 180)
    const sinLat = Math.sin(lat * Math.PI / 180)
    const x3d = cosLat * Math.sin(angle)
    const y3d = sinLat
    const z3d = cosLat * Math.cos(angle)

    if (z3d > -0.1) {
      const px = cx + r * x3d
      const py = cy - r * y3d
      const c = m.color || [0.1, 0.85, 1]
      const color = `rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)}`

      // Ring pulsant
      const pulse = (now % 2000) / 2000
      const ringR = r * 0.04 * (1 + pulse * 2)
      const ringAlpha = (1 - pulse) * 0.6 * Math.max(0, z3d)
      ctx.beginPath()
      ctx.arc(px, py, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = `${color},${ringAlpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Point central
      ctx.beginPath()
      ctx.arc(px, py, r * 0.025, 0, Math.PI * 2)
      ctx.fillStyle = `${color},${Math.max(0, z3d * 0.9 + 0.1)})`
      ctx.fill()
    }
  }

  // Arcs entre markers
  if (markers.length >= 2) {
    const arcProgress = ((now % 3000) / 3000)
    for (let i = 0; i < Math.min(markers.length - 1, 3); i++) {
      const m1 = markers[i]
      const m2 = markers[(i + 1) % markers.length]
      ctx.beginPath()
      let first = true
      for (let t = 0; t <= arcProgress; t += 0.02) {
        const lat = m1.location[0] + (m2.location[0] - m1.location[0]) * t
        const lng = m1.location[1] + (m2.location[1] - m1.location[1]) * t
        const angle = (lng + phi * 180 / Math.PI) * Math.PI / 180
        const cosLat = Math.cos(lat * Math.PI / 180)
        const sinLat = Math.sin(lat * Math.PI / 180)
        const x3d = cosLat * Math.sin(angle)
        const y3d = sinLat
        const z3d = cosLat * Math.cos(angle)
        const altitude = 1 + Math.sin(t * Math.PI) * 0.3
        const px = cx + r * x3d * altitude
        const py = cy - r * y3d * altitude
        if (z3d > 0) {
          if (first) { ctx.moveTo(px, py); first = false }
          else ctx.lineTo(px, py)
        }
      }
      ctx.strokeStyle = 'rgba(100,220,255,0.6)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  // Brillance
  const shine = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, 0, cx - r * 0.2, cy - r * 0.2, r * 0.6)
  shine.addColorStop(0, 'rgba(255,255,255,0.08)')
  shine.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = shine
  ctx.fill()
}

export function GlobeAceternity({ markers = [] }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const animRef = useRef<number>(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const size = canvas.parentElement?.clientWidth || 500
      canvas.width = size * 2
      canvas.height = size * 2
      canvas.style.width = size + 'px'
      canvas.style.height = size + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      if (!isDragging.current) phiRef.current += 0.003
      drawGlobe(canvas, markers, phiRef.current)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [markers])

  return (
    <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', maxWidth: 600, margin: '0 auto', borderRadius: '50%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: 'grab', display: 'block' }}
        onMouseDown={e => { isDragging.current = true; lastX.current = e.clientX }}
        onMouseUp={() => { isDragging.current = false }}
        onMouseLeave={() => { isDragging.current = false }}
        onMouseMove={e => {
          if (isDragging.current) {
            phiRef.current += (e.clientX - lastX.current) * 0.005
            lastX.current = e.clientX
          }
        }}
      />
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 14, background: 'rgba(0,0,0,0.7)',
        padding: '5px 14px', borderRadius: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'white' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#33e66a' }}/> En ligne
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'white' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3380ff' }}/> Commandes
        </div>
      </div>
    </div>
  )
}
