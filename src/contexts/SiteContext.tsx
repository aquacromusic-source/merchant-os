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
    const saved = localStorage.getItem('mos_active_site') as SiteId | null
    if (saved && saved in SITE_LABELS) {
      setActiveSiteState(saved)
    }
    setHydrated(true)
  }, [])

  const setActiveSite = (site: SiteId) => {
    setActiveSiteState(site)
    localStorage.setItem('mos_active_site', site)
  }

  const activeSiteLabel = SITE_LABELS[activeSite]

  return (
    <SiteContext.Provider value={{ activeSite, setActiveSite, activeSiteLabel }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
