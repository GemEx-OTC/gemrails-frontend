"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { Download, Share2, Copy, Check, Smartphone, Printer, ExternalLink } from "lucide-react"
import { copyToClipboard } from "@/lib/clipboard"

const mockMerchant = {
  id: "DEMO123",
  businessName: "Demo Restaurant",
  paymentUrl: "https://pay.gemrails.ng/DEMO123",
}

export default function QRCodePage() {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleCopyLink = async () => {
    const success = await copyToClipboard(mockMerchant.paymentUrl)
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

      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = 512
        canvas.height = 512
        ctx?.fillRect(0, 0, canvas.width, canvas.height)
        ctx!.fillStyle = "white"
        ctx?.fillRect(0, 0, canvas.width, canvas.height)
        ctx?.drawImage(img, 0, 0, 512, 512)

        const link = document.createElement("a")
        link.download = `gemrails-qr-${mockMerchant.id}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
        setDownloading(false)
      }

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    } catch (err) {
      console.error("Download failed:", err)
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${mockMerchant.businessName}`,
          text: `Scan to pay ${mockMerchant.businessName} with crypto`,
          url: mockMerchant.paymentUrl,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Payment QR Code</h1>
        <p className="text-gray-400 mt-1">Display this QR code to receive crypto payments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="text-center">
            <div ref={qrRef} className="inline-block p-6 bg-white rounded-2xl shadow-xl mb-6">
              <QRCodeSVG
                value={mockMerchant.paymentUrl}
                size={256}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png",
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">{mockMerchant.businessName}</h2>
            <p className="text-gray-400 text-sm mb-4">Scan to pay with USDT or USDC</p>

            <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-xl mb-4">
              <input type="text" value={mockMerchant.paymentUrl} readOnly className="flex-1 bg-transparent text-gray-300 text-sm outline-none" />
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
                { step: 3, title: "Pay with Crypto", desc: "They send USDT or USDC to complete payment" },
                { step: 4, title: "Instant Settlement", desc: "You receive Naira + ₦500 bonus instantly" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">{item.step}</div>
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
              <motion.button onClick={() => window.print()} whileHover={{ scale: 1.02, x: 4 }} className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3"><Printer className="w-5 h-5 text-gray-400" /><span className="text-white">Print QR Code</span></div>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </motion.button>
              <motion.button onClick={() => window.open(mockMerchant.paymentUrl, "_blank")} whileHover={{ scale: 1.02, x: 4 }} className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all">
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
  )
}
