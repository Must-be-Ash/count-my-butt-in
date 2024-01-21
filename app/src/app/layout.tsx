import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Providers } from './providers';
import './globals.css'
import { cn } from "@/lib/utils"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <Providers>
        <div vaul-drawer-wrapper="" className="bg-background">
          {children}
        </div>
      </Providers>
      </body>
    </html>
  )
}
