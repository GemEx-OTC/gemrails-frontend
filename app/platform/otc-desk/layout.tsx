import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "OTC Crypto Desk — Buy & Sell USDT Instantly in Nigeria | GemRails",
  description:
    "GemRails OTC Desk lets individuals and businesses buy or sell USDT, USDC and other digital assets instantly, with direct Naira settlement to your Nigerian bank account. Non-custodial, automated and built for Africa.",
  keywords: [
    "OTC crypto desk Nigeria",
    "buy USDT Nigeria",
    "sell USDT Naira",
    "crypto OTC Africa",
    "buy USDC Nigeria",
    "stablecoin OTC desk",
    "USDT to Naira instantly",
    "crypto to bank account Nigeria",
    "GemRails OTC",
    "institutional crypto liquidity Nigeria",
    "business crypto OTC Nigeria",
    "KYB crypto Nigeria",
    "non-custodial crypto desk",
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
    canonical: "https://gemrails.com/platform/otc-desk",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://gemrails.com/platform/otc-desk",
    siteName: "GemRails",
    title: "OTC Crypto Desk — Buy & Sell USDT Instantly in Nigeria | GemRails",
    description:
      "GemRails OTC Desk lets individuals and businesses buy or sell USDT, USDC and other digital assets instantly, with direct Naira settlement to your Nigerian bank account.",
    images: [
      {
        url: "https://gemrails.com/og-otc-desk.png",
        width: 1200,
        height: 630,
        alt: "GemRails OTC Desk — Buy & Sell Crypto in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OTC Crypto Desk — Buy & Sell USDT Instantly in Nigeria | GemRails",
    description:
      "GemRails OTC Desk lets individuals and businesses buy or sell USDT, USDC and other digital assets instantly, with direct Naira settlement to your Nigerian bank account.",
    images: ["https://gemrails.com/og-otc-desk.png"],
    creator: "@gemrails",
    site: "@gemrails",
  },
}

export default function OTCDeskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
