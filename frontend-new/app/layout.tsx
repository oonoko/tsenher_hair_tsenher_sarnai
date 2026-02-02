import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Romantic Greeting Web',
  description: 'Хайртай хүндээ зориулсан тусгай веб',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
