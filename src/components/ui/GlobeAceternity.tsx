'use client'

import React, { useEffect, useRef } from 'react'
import createGlobe from 'cobe'
import { useSpring } from 'react-spring'

interface GlobeProps {
  markers?: { location: [number, number]; size: number; color?: [number, number, number] }[]
  className?: string
}

export function GlobeAceternity({ markers = [], className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const phiRef = useRef(0)
  const widthRef = useRef(0)

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: { mass: 1, tension: 280, friction: 40, precision: 0.001 },
  }))

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth
    }
    window.addEventListener('resize', onResize)
    onResize()

    const globe = (createGlobe as any)(canvasRef.current, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0.6,
      theta: 0.15,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.08, 0.28],      // bleu marine foncé
      markerColor: [0.2, 0.85, 0.95],      // cyan
      glowColor: [0.05, 0.15, 0.6],         // halo bleu
      markers,
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) phiRef.current += 0.003
        state.phi = phiRef.current + r.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1'
    }, 100)

    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [markers])

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        aspectRatio: '1/1',
        margin: '0 auto',
        position: 'relative',
        background: 'black',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({ r: delta / 200 })
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({ r: delta / 100 })
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  )
}
