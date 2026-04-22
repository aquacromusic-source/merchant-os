import type { Metadata } from 'next'
import { Shell } from '@/components/ui/Shell'
import { PolarisProvider } from '@/components/ui/PolarisProvider'
import './globals.css'
import '@shopify/polaris/build/esm/styles.css'

export const metadata: Metadata = {
  title: 'Merchant OS',
  description: 'Back-office Merchant OS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" style={{ background: "#1a1a1a" }}>
      <body style={{ background: "#1a1a1a", margin: 0 }}>
        <PolarisProvider>
          <div className="shell-wrapper"><Shell>{children}</Shell></div>
        </PolarisProvider>
      </body>
    </html>
  )
}
