'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type SiteId = 'gaming-posters' | 'strap' | 'pdf-guide-store'

export interface SiteContextValue {
  activeSite: SiteId
  setActiveSite: (site: SiteId) => void
  activeSiteLabel: string
}

const SITE_LABELS: Record<SiteId, string> = {
  'gaming-posters': 'Gaming Posters',
  'strap': 'STRAP.',
  'pdf-guide-store': 'PDF Guide Store',
}

const SiteContext = createContext<SiteContextValue>({
  activeSite: 'gaming-posters',
  setActiveSite: () => {},
  activeSiteLabel: 'Gaming Posters',
})

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [activeSite, setActiveSiteState] = useState<SiteId>('gaming-posters')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('activeSite') as SiteId | null
    if (saved && saved in SITE_LABELS) {
      setActiveSiteState(saved)
    }
    setHydrated(true)
  }, [])

  const setActiveSite = (site: SiteId) => {
    setActiveSiteState(site)
    localStorage.setItem('activeSite', site)
  }

  const activeSiteLabel = SITE_LABELS[activeSite]

  // Don't render children until we've read the saved site from localStorage
  // to prevent a flash-fetch with the wrong default site
  if (!hydrated) return null

  return (
    <SiteContext.Provider value={{ activeSite, setActiveSite, activeSiteLabel }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
