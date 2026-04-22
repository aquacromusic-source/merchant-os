'use client'
import { AppProvider } from '@shopify/polaris'
import fr from '@shopify/polaris/locales/fr.json'

export function PolarisProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={fr}>
      {children}
    </AppProvider>
  )
}
