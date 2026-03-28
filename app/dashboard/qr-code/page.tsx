"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { QRCode } from "react-qrcode-logo"
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

  const isEnterpriseNoMerchantId = user?.accountType === 'enterprise' && !user?.merchantId
  const effectiveMerchantId = user?.merchantId || (isEnterpriseNoMerchantId ? "demo-merchant" : "")
  const paymentUrl = effectiveMerchantId ? `${baseUrl}/pay/${effectiveMerchantId}` : ""
  const businessName = user?.businessName || "My Business"
  // Use local fallback logo if external logo fails to load
  const businessLogo = getImageUrl(user?.businessLogo) || "/logo.png"

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
      const canvas = qrRef.current?.querySelector("canvas")
      if (!canvas) {
        // Fallback to searching for img if it's rendered as image (though react-qrcode-logo usually uses canvas)
        const img = qrRef.current?.querySelector("img")
        if (!img) return
        
        const link = document.createElement("a")
        link.download = `gemrails-qr-${effectiveMerchantId || "code"}.png`
        link.href = img.src
        link.click()
        setDownloading(false)
        return
      }

      const link = document.createElement("a")
      link.download = `gemrails-qr-${effectiveMerchantId || "code"}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
      setDownloading(false)
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

  if (!effectiveMerchantId && !isEnterpriseNoMerchantId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Payment QR Code</h1>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          You need a Merchant ID to generate a QR code. Please contact support.
        </div>
      </div>
    )
  }

  // If it's an enterprise without merchantId, show a friendly "Demo Mode" notice if not already showing
  // paymentUrl is already declared above.


  return (
    <>
      {/* ========== PRINT VIEW - OPay Inspired with GemRails Branding ========== */}
      <div className="hidden print:flex print:fixed print:inset-0 print:z-9999 print:flex-col print:items-center print:justify-start print:min-h-screen print:w-full print:bg-linear-to-b print:from-emerald-500 print:via-teal-600 print:to-teal-700">
        
        {/* Top Logo Badge */}
        <div className="mt-8 mb-6 w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2">
          <img src="/logo/logo_icon.png" alt="GemRails" className="w-full h-full object-contain" />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-6xl font-black text-white tracking-tight mb-2 text-center px-4 drop-shadow-md">
          PAY WITH CRYPTO
        </h1>
        <p className="text-xl font-bold text-white/90 tracking-[0.3em] uppercase mb-4">
          Fast & Secure Payments
        </p>

        {/* Platform Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-white/80 text-lg font-medium">Powered by</span>
          <span className="text-3xl font-black text-white drop-shadow-sm">
            GemRails
          </span>
        </div>

        {/* Business Name Card */}
        <div className="w-[90%] max-w-[600px] bg-white rounded-2xl shadow-xl p-6 mb-6 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wider shadow-lg">
            Business Name
          </div>
          <p className="text-2xl md:text-3xl font-bold text-emerald-950 text-center uppercase mt-2">
            {businessName}
          </p>
        </div>

        {/* Scan Instruction */}
        <p className="text-white font-semibold text-xl mb-4">
          Scan to Pay with USDT or USDC
        </p>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl mb-4">
          <QRCode
            value={paymentUrl}
            size={450}
            qrStyle="dots"
            eyeRadius={15}
            logoImage={effectiveLogo}
            logoWidth={150}
            logoHeight={150}
            logoPadding={0}
            logoPaddingStyle="circle"
            removeQrCodeBehindLogo={true}
            ecLevel="H"
          />  
        </div>

        {/* Tagline */}
        <p className="text-white/90 font-medium text-lg italic mb-6">
          GemRails — Crypto Payments Made Simple
        </p>

        {/* Footer */}
        <div className="w-[90%] max-w-[600px] bg-emerald-950/20 backdrop-blur rounded-xl py-4 px-8 flex items-center justify-center gap-6">
          <span className="text-white text-base font-semibold flex items-center gap-1">
            <span>🔒</span> Secure
          </span>
          <span className="text-white/40 text-lg">|</span>
          <span className="text-white text-base font-semibold flex items-center gap-1">
            <span>⚡</span> Instant
          </span>
          <span className="text-white/40 text-lg">|</span>
          <span className="text-white text-base font-semibold flex items-center gap-1">
            <span>💎</span> GemRails
          </span>
        </div>
      </div>

      {/* ========== SCREEN VIEW ========== */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Your Payment QR Code</h1>
            <p className="text-gray-400 mt-1">Display this QR code to receive crypto payments</p>
          </div>
          {isEnterpriseNoMerchantId && (
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Enterprise Demo Mode
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-center">
              <div ref={qrRef} className="inline-block p-1 bg-white rounded-2xl shadow-xl mb-6">
                <QRCode
                  value={paymentUrl}
                  size={300}
                  qrStyle="dots"
                  eyeRadius={10}
                  logoImage={effectiveLogo}
                  logoWidth={100}
                  logoHeight={100}
                  logoPadding={0}
                  logoPaddingStyle="circle"
                  removeQrCodeBehindLogo={true}
                  ecLevel="H"
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
                <motion.button onClick={handlePrint} whileHover={{ scale: 1.02, x: 4 }} className="w-full flex items-center justify-between p-3 bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-3"><Printer className="w-5 h-5 text-emerald-400" /><span className="text-white font-medium">Print QR Code</span></div>
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
