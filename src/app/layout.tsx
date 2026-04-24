import type { Metadata } from 'next'
import { Shell } from '@/components/ui/Shell'
import { PolarisProvider } from '@/components/ui/PolarisProvider'
import { SiteProvider } from '@/contexts/SiteContext'
import './globals.css'
import '@shopify/polaris/build/esm/styles.css'

export const metadata: Metadata = {
  title: 'Merchant OS',
  description: 'Back-office Merchant OS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div style={{ background: "#1a1a1a", minHeight: "100vh" }}>
          <PolarisProvider>
            <SiteProvider>
              <div className="shell-wrapper"><Shell>{children}</Shell></div>
            </SiteProvider>
          </PolarisProvider>
        </div>
      </body>
    </html>
  )
}
