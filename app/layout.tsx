import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/context/auth-context"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
