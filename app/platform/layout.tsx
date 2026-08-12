import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stablecoin Payment Infrastructure for African Businesses | GemRails",
  description:
    "Accept stablecoin payments online and in-store while settling instantly in local currency. GemRails powers checkout, settlement, and cross-border payments for African businesses.",
  keywords: [
    "stablecoin payment infrastructure",
    "USDT payment gateway Nigeria",
    "crypto payment gateway Africa",
    "accept USDT payments",
    "stablecoin checkout",
    "payment infrastructure Africa",
    "merchant checkout platform Nigeria",
    "cross-border payment infrastructure",
    "USDC payments Nigeria",
    "instant Naira settlement",
    "GemRails platform",
    "crypto merchant Nigeria",
  ],
  authors: [{ name: "GemRails", url: "https://gemrails.com" }],
  creator: "GemRails",
  publisher: "GemRails",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gemrails.com/platform",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://gemrails.com/platform",
    siteName: "GemRails",
    title: "Stablecoin Payment Infrastructure for African Businesses | GemRails",
    description:
      "Accept stablecoin payments online and in-store while settling instantly in local currency. GemRails powers checkout, settlement, and cross-border payments for African businesses.",
    images: [
      {
        url: "https://gemrails.com/og-platform.png",
        width: 1200,
        height: 630,
        alt: "GemRails — Stablecoin Payment Infrastructure for African Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stablecoin Payment Infrastructure for African Businesses | GemRails",
    description:
      "Accept stablecoin payments online and in-store while settling instantly in local currency. GemRails powers checkout, settlement, and cross-border payments for African businesses.",
    images: ["https://gemrails.com/og-platform.png"],
    creator: "@gemrails",
    site: "@gemrails",
  },
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
