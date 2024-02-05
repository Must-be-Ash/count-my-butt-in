import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'iframe (signed.gg)',
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
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
