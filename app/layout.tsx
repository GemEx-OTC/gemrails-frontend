import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/context/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "GemRails - Accept Crypto, Get Naira Instantly",
  description:
    "Enable your business to accept USDT & USDC payments with instant Naira settlement. No crypto knowledge required.",
  keywords: ["crypto payments", "USDT", "USDC", "Naira", "merchant", "Nigeria", "payment gateway"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#1a1a2e',
              border: '1px solid #2d2d3d',
              color: '#f0f0f0',
            },
          }}
        />
      </body>
    </html>
  )
}
