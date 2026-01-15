"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { Download, Share2, Copy, Check, Smartphone, Printer, ExternalLink, Loader2 } from "lucide-react"
import { copyToClipboard } from "@/lib/clipboard"
import { useAuth } from "@/context/auth-context"
import { getImageUrl } from "@/lib/utils/image"

export default function QRCodePage() {
  const { user, isLoading } = useAuth()
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const baseUrl = process.env.NEXT_PUBLIC_GEMRAILS_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")

  const paymentUrl = user?.merchantId ? `${baseUrl}/pay/${user.merchantId}` : ""
  const businessName = user?.businessName || "My Business"
  // Use local fallback logo if external logo fails to load
  const businessLogo = getImageUrl(user?.businessLogo) || "/logo.png"
  const merchantId = user?.merchantId || ""

  // Track if external logo loaded successfully
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoError, setLogoError] = useState(false)

  // Preload logo to check if it's accessible
  useEffect(() => {
    if (user?.businessLogo) {
      const img = new Image()
      img.onload = () => setLogoLoaded(true)
      img.onerror = () => setLogoError(true)
      img.src = getImageUrl(user.businessLogo) || ""
    }
  }, [user?.businessLogo])

  // Use fallback if logo failed to load
  const effectiveLogo = logoError ? "/logo.png" : businessLogo

  const handleCopyLink = async () => {
    if (!paymentUrl) return
    const success = await copyToClipboard(paymentUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const svg = qrRef.current?.querySelector("svg")
      if (!svg) return

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 512
      canvas.height = 512

      ctx!.fillStyle = "white"
      ctx?.fillRect(0, 0, canvas.width, canvas.height)

      const svgData = new XMLSerializer().serializeToString(svg)
      const qrImg = new Image()
      
      qrImg.onload = async () => {
        ctx?.drawImage(qrImg, 0, 0, 512, 512)

        if (effectiveLogo && effectiveLogo !== "/logo.png") {
          const logoImg = new Image()
          logoImg.crossOrigin = "anonymous"
          
          logoImg.onload = () => {
            const logoSize = 106
            const logoX = (canvas.width - logoSize) / 2
            const logoY = (canvas.height - logoSize) / 2
            ctx?.drawImage(logoImg, logoX, logoY, logoSize, logoSize)

            const link = document.createElement("a")
            link.download = `gemrails-qr-${user?.merchantId || "code"}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
            setDownloading(false)
          }

          logoImg.onerror = () => {
            // Download without logo if it fails
            const link = document.createElement("a")
            link.download = `gemrails-qr-${user?.merchantId || "code"}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
            setDownloading(false)
          }

          logoImg.src = effectiveLogo
        } else {
          const link = document.createElement("a")
          link.download = `gemrails-qr-${user?.merchantId || "code"}.png`
          link.href = canvas.toDataURL("image/png")
          link.click()
          setDownloading(false)
        }
      }

      qrImg.src = "data:image/svg+xml;base64," + btoa(decodeURIComponent(encodeURIComponent(svgData)))
    } catch (err) {
      console.error("Download failed:", err)
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && paymentUrl) {
      try {
        await navigator.share({
          title: `Pay ${businessName}`,
          text: `Scan to pay ${businessName} with crypto`,
          url: paymentUrl,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      handleCopyLink()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!user?.merchantId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Payment QR Code</h1>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          You need a Merchant ID to generate a QR code. Please contact support.
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ========== PRINT VIEW - OPay Inspired with GemRails Branding ========== */}
      <div className="hidden print:flex print:fixed print:inset-0 print:z-[9999] print:flex-col print:items-center print:justify-start print:min-h-screen print:w-full print:bg-gradient-to-b print:from-emerald-500 print:via-teal-600 print:to-teal-700">
        
        {/* Top Logo Badge */}
        <div className="mt-16 mb-12 w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl md:text-8xl font-black text-emerald-950 tracking-tight mb-4 text-center px-8">
          PAY WITH CRYPTO
        </h1>
        <p className="text-2xl font-bold text-emerald-800 tracking-[0.3em] uppercase mb-8">
          Fast & Secure Payments
        </p>

        {/* Platform Badge */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-emerald-800 text-2xl font-medium">Powered by</span>
          <span className="text-5xl font-black text-emerald-950">
            GemRails
          </span>
        </div>

        {/* Merchant ID Card */}
        {/* <div className="w-[90%] max-w-[800px] bg-white rounded-3xl shadow-xl p-12 mb-8 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold px-8 py-3 rounded-full uppercase tracking-wider shadow-lg">
            Merchant ID
          </div>
          <p className="text-6xl md:text-7xl font-black text-emerald-950 text-center tracking-wider mt-4">
            {merchantId}
          </p>
        </div> */}

        {/* Business Name Card */}
        <div className="w-[90%] max-w-[800px] bg-white rounded-3xl shadow-xl p-10 mb-12 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold px-8 py-3 rounded-full uppercase tracking-wider shadow-lg">
            Business Name
          </div>
          <p className="text-4xl md:text-5xl font-bold text-emerald-950 text-center uppercase mt-4">
            {businessName}
          </p>
        </div>

        {/* Scan Instruction */}
        <p className="text-emerald-900 font-semibold text-3xl mb-8">
          Scan to Pay with USDT or USDC
        </p>

        {/* QR Code */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl mb-8">
          <QRCodeSVG
            value={paymentUrl}
            size={400}
            level="H"
            imageSettings={{
              src: effectiveLogo,
              height: 90,
              width: 90,
              excavate: true,
            }}
          />
        </div>

        {/* Tagline */}
        <p className="text-emerald-800 font-medium text-2xl italic mb-12">
          GemRails — Crypto Payments Made Simple
        </p>

        {/* Footer */}
        <div className="w-[90%] max-w-[800px] bg-emerald-950/20 backdrop-blur rounded-2xl py-6 px-12 flex items-center justify-center gap-8">
          <span className="text-white text-xl font-semibold flex items-center gap-2">
            <span>🔒</span> Secure
          </span>
          <span className="text-white/40 text-2xl">|</span>
          <span className="text-white text-xl font-semibold flex items-center gap-2">
            <span>⚡</span> Instant
          </span>
          <span className="text-white/40 text-2xl">|</span>
          <span className="text-white text-xl font-semibold flex items-center gap-2">
            <span>💎</span> GemRails
          </span>
        </div>
      </div>

      {/* ========== SCREEN VIEW ========== */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Payment QR Code</h1>
          <p className="text-gray-400 mt-1">Display this QR code to receive crypto payments</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-center">
              <div ref={qrRef} className="inline-block p-6 bg-white rounded-2xl shadow-xl mb-6">
                <QRCodeSVG
                  value={paymentUrl}
                  size={256}
                  level="H"
                  imageSettings={{
                    src: effectiveLogo,
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{businessName}</h2>
              <p className="text-gray-400 text-sm mb-4">Scan to pay with USDT or USDC</p>

              <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-xl mb-4">
                <input type="text" value={paymentUrl} readOnly className="flex-1 bg-transparent text-gray-300 text-sm outline-none" />
                <motion.button onClick={handleCopyLink} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button onClick={handleDownload} disabled={downloading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> {downloading ? "..." : "Download"}
                </motion.button>
                <motion.button onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button-outline flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" /> Share
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Customer Scans", desc: "Customer scans your QR code with their phone" },
                  { step: 2, title: "Enter Amount", desc: "They enter the Naira amount to pay (min ₦5,000)" },
                  { step: 3, title: "Pay with Crypto", desc: "They send Stable Coin to complete payment" },
                  { step: 4, title: "Instant Settlement", desc: "You receive Naira + ₦100 bonus instantly" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">More Options</h3>
              <div className="space-y-3">
                <motion.button onClick={handlePrint} whileHover={{ scale: 1.02, x: 4 }} className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-3"><Printer className="w-5 h-5 text-emerald-400" /><span className="text-white font-medium">Print QR Code</span></div>
                  {/* <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">Pro Style</span> */}
                </motion.button>
                <motion.button onClick={() => window.open(paymentUrl, "_blank")} whileHover={{ scale: 1.02, x: 4 }} className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-gray-400" /><span className="text-white">Preview Payment Page</span></div>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 font-medium mb-2">💡 Pro Tips</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Display the QR code at your checkout counter</li>
                <li>• Print and laminate for durability</li>
                <li>• Add to your menu or receipts</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
