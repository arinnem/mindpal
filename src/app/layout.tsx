import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'
import { StagewiseClient } from '@/components/StagewiseClient'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Bạn thương - Không gian an toàn cho học sinh Việt Nam',
  description: 'Một không gian số ấm áp và an toàn, nơi học sinh Việt Nam có thể chia sẻ, lắng nghe và phát triển bản thân.',
  keywords: ['học sinh', 'tâm lý', 'hỗ trợ', 'Việt Nam', 'wellbeing', 'mental health'],
  authors: [{ name: 'Bạn thương Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FDFBF6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <StagewiseClient />
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 