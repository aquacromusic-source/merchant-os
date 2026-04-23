'use client'

import React, { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'

interface GlobeProps {
  markers?: { location: [number, number]; size: number; color?: [number, number, number] }[]
}

export function GlobeAceternity({ markers = [] }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return

    // Attendre que le DOM soit prêt et que le canvas ait des dimensions
    const initGlobe = () => {
      if (!canvasRef.current) return
      const w = canvasRef.current.parentElement?.clientWidth || 600
      widthRef.current = w
      canvasRef.current.width = w * 2
      canvasRef.current.height = w * 2
      canvasRef.current.style.width = w + 'px'
      canvasRef.current.style.height = w + 'px'

      const onResize = () => {
        if (canvasRef.current) {
          const newW = canvasRef.current.parentElement?.clientWidth || 600
          widthRef.current = newW
        }
      }
      window.addEventListener('resize', onResize)

      let globe: any
      try {
        globe = (createGlobe as any)(canvasRef.current, {
          devicePixelRatio: 2,
          width: w * 2,
          height: w * 2,
        phi: 0.6,
        theta: 0.15,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.05, 0.08, 0.28],
        mapSamples: 20000,
        mapBrightness: 8,
        markerColor: [0.1, 0.8, 1],
        glowColor: [0.05, 0.15, 0.6],
        markers,
        onRender: (state: Record<string, any>) => {
          if (!pointerInteracting.current) {
            phiRef.current += 0.003
          }
          state.phi = phiRef.current + rotationRef.current
          state.width = widthRef.current * 2
          state.height = widthRef.current * 2
        },
      })

        setTimeout(() => {
          if (canvasRef.current) canvasRef.current.style.opacity = '1'
        }, 200)
      } catch (e) {
        console.error('Globe error:', e)
      }

      return () => {
        globe?.destroy()
        window.removeEventListener('resize', onResize)
      }
    }

    // Init après un frame pour que le DOM soit peint
    const timeout = setTimeout(initGlobe, 100)
    return () => clearTimeout(timeout)
  }, []) // eslint-disable-line

  return (
    <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', maxWidth: 600, margin: '0 auto', overflow: 'visible' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = (e.clientX - pointerInteracting.current) / 200
            rotationRef.current = delta
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
      {/* Légende */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 14, background: 'rgba(0,0,0,0.6)',
        padding: '5px 14px', borderRadius: 20, backdropFilter: 'blur(4px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'white' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#33e66a' }}/>
          En ligne
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'white' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3380ff' }}/>
          Commandes
        </div>
      </div>
    </div>
  )
}
