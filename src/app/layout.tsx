// app/layout.tsx

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/chakra/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | My Frontend App',
    default: 'My Frontend App - Modern UI with Chakra UI',
  },
  description: 'A beautiful frontend application built with Next.js, Chakra UI v2, and TypeScript',
  keywords: ['Next.js', 'React', 'Chakra UI', 'TypeScript', 'Frontend'],
  authors: [{ name: 'Your Name' }],
}

// ✅ Move themeColor here, inside viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0967D2' },
    { media: '(prefers-color-scheme: dark)', color: '#2186EB' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
