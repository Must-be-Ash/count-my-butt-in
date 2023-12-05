import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Binder | Signature Booth',
  description: 'Powered by Binder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  )
}
