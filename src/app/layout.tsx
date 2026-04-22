import type { Metadata } from 'next'
import { Shell } from '@/components/ui/Shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Merchant OS',
  description: 'Back-office Merchant OS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
