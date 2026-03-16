import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orflie - Dashboard Onboarding',
  description: 'Visualizador de dados de onboarding',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}