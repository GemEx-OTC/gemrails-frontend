"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QRCode } from "react-qrcode-logo"
import { X, Copy, Check, Printer, ExternalLink } from "lucide-react"
import { copyToClipboard } from "@/lib/clipboard"
import { Terminal } from "@/lib/api/enterprise"
import { getImageUrl } from "@/lib/utils/image"
import { useAuth } from "@/context/auth-context"

interface TerminalQRCodeModalProps {
  terminal: Terminal | null
  onClose: () => void
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TerminalQRCodeModal({ terminal, onClose }: TerminalQRCodeModalProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const baseUrl = process.env.NEXT_PUBLIC_GEMRAILS_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")

  let paymentUrl = ""
  if (terminal) {
    const branchName = typeof terminal.branchId === 'object' ? terminal.branchId.name : "branch"
    paymentUrl = `${baseUrl}/pay/${slugify(branchName)}/${terminal.merchantId}`
  }

  const effectiveLogo = getImageUrl(user?.businessLogo) || "/logo.png"

  const handleCopy = async () => {
    if (!paymentUrl) return
    const success = await copyToClipboard(paymentUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!terminal) return null

  return (
    <>
      {/* ========== PRINT VIEW ========== */}
      <div className="hidden print:flex print:fixed print:inset-0 print:z-[9999] print:flex-col print:items-center print:justify-start print:min-h-screen print:w-full print:bg-gradient-to-b print:from-emerald-500 print:via-teal-600 print:to-teal-700">
        <div className="mt-8 mb-6 w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2">
          <img src="/logo/logo_icon.png" alt="GemRails" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight mb-2 text-center px-4 drop-shadow-md">
          PAY WITH CRYPTO
        </h1>
        <p className="text-xl font-bold text-white/90 tracking-[0.3em] uppercase mb-4">
          Fast & Secure Payments
        </p>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-white/80 text-lg font-medium">Powered by</span>
          <span className="text-3xl font-black text-white drop-shadow-sm">GemRails</span>
        </div>
        <div className="w-[90%] max-w-[600px] bg-white rounded-2xl shadow-xl p-6 mb-6 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wider shadow-lg">
            Terminal
          </div>
          <p className="text-2xl font-bold text-emerald-950 text-center uppercase mt-2">
            {terminal.name}
          </p>
        </div>
        <p className="text-white font-semibold text-xl mb-4">
          Scan to Pay with USDT or USDC
        </p>
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
        <p className="text-white/90 font-medium text-lg italic mb-6">
          GemRails — Crypto Payments Made Simple
        </p>
        <div className="w-[90%] max-w-[600px] bg-emerald-950/20 backdrop-blur rounded-xl py-4 px-8 flex items-center justify-center gap-6">
          <span className="text-white text-base font-semibold">🔒 Secure</span>
          <span className="text-white/40 text-lg">|</span>
          <span className="text-white text-base font-semibold">⚡ Instant</span>
          <span className="text-white/40 text-lg">|</span>
          <span className="text-white text-base font-semibold">💎 GemRails</span>
        </div>
      </div>

      {/* ========== MODAL (screen only) ========== */}
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#0a0d10] border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 text-center pt-12">
              <div className="mb-6 inline-block p-1 bg-white rounded-2xl shadow-xl shadow-emerald-500/10" ref={qrRef}>
                <QRCode
                  value={paymentUrl}
                  size={240}
                  qrStyle="dots"
                  eyeRadius={8}
                  logoImage={effectiveLogo}
                  logoWidth={70}
                  logoHeight={70}
                  logoPadding={0}
                  logoPaddingStyle="circle"
                  removeQrCodeBehindLogo={true}
                  ecLevel="H"
                />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{terminal.name}</h2>
              <p className="text-emerald-400 font-mono text-sm mb-2">{terminal.merchantId}</p>
              <p className="text-gray-400 text-sm mb-6 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {typeof terminal.branchId === 'object' ? terminal.branchId.name : 'Active Terminal'}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-800 rounded-xl">
                  <input
                    type="text"
                    value={paymentUrl}
                    readOnly
                    className="flex-1 bg-transparent text-gray-400 text-xs outline-none truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handlePrint}
                    className="gemrails-button flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => window.open(paymentUrl, '_blank')}
                    className="gemrails-button-outline flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>

              <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                Powered by GemRails
              </p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  )
}