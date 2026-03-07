import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'CodeMouse — AI Code Review Bot for GitHub',
  description: 'Instant AI-powered code reviews on every pull request. Install in 2 clicks. No reviewer needed.',
  metadataBase: new URL('https://codemouse.io'),
  openGraph: {
    title: 'CodeMouse — AI Code Review Bot for GitHub',
    description: 'Instant AI-powered code reviews on every pull request. Install in 2 clicks.',
    url: 'https://codemouse.io',
    siteName: 'CodeMouse',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeMouse — AI Code Review Bot for GitHub',
    description: 'Instant AI-powered code reviews on every pull request.',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
