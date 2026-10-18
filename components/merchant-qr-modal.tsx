"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BusinessQRCode } from "@/components/business-qr-code"
import {
  X,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Download,
  Loader2,
  Building2,
  Store,
  Landmark,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { copyToClipboard } from "@/lib/clipboard"
import { getImageUrl } from "@/lib/utils/image"
import { useAdminMerchantDetails } from "@/lib/hooks/use-admin"
import type { AdminMerchant, AdminMerchantDetails } from "@/lib/api/types"

interface MerchantQRCodeModalProps {
  isOpen: boolean
  merchant: AdminMerchant | AdminMerchantDetails | null
  initialTerminalId?: string
  onClose: () => void
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function MerchantQRCodeModal({
  isOpen,
  merchant,
  initialTerminalId,
  onClose,
}: MerchantQRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>(initialTerminalId || "")
  const [logoError, setLogoError] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const { data: merchantDetails, isLoading: isLoadingDetails } = useAdminMerchantDetails(
    isOpen && merchant ? merchant.id : ""
  )

  const resolvedMerchant = merchantDetails || merchant
  const isEnterprise = resolvedMerchant?.accountType === "enterprise"
  const terminals = merchantDetails?.terminals || []

  // Sync selected terminal when modal opens or terminals load
  useEffect(() => {
    if (!isOpen) return
    if (initialTerminalId) {
      setSelectedTerminalId(initialTerminalId)
    } else if (terminals.length > 0) {
      setSelectedTerminalId((prev) =>
        prev && terminals.some((t) => t.id === prev) ? prev : terminals[0].id
      )
    } else {
      setSelectedTerminalId("")
    }
  }, [isOpen, initialTerminalId, terminals])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const rawLogoUrl = getImageUrl(resolvedMerchant?.businessLogo)

  // Preload external logo and fall back to default logo if unreachable
  useEffect(() => {
    setLogoError(false)
    if (rawLogoUrl) {
      const img = new Image()
      img.onload = () => setLogoError(false)
      img.onerror = () => setLogoError(true)
      img.src = rawLogoUrl
    }
  }, [rawLogoUrl])

  if (!isOpen || !merchant) return null

  const baseUrl =
    process.env.NEXT_PUBLIC_GEMRAILS_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")

  const businessName = resolvedMerchant?.businessName || "Merchant"
  const effectiveLogo = !rawLogoUrl || logoError ? "/logo.png" : rawLogoUrl

  const selectedTerminal = isEnterprise
    ? terminals.find((t) => t.id === selectedTerminalId) || terminals[0] || null
    : null

  const selectedBranchName = selectedTerminal
    ? selectedTerminal.branchName ||
      (typeof selectedTerminal.branchId === "object" && selectedTerminal.branchId
        ? selectedTerminal.branchId.name
        : "Main")
    : ""

  const effectiveMerchantId = selectedTerminal
    ? selectedTerminal.merchantId
    : resolvedMerchant?.merchantId || ""

  const paymentUrl = selectedTerminal
    ? `${baseUrl}/pay/${slugify(selectedBranchName || "branch")}/${selectedTerminal.merchantId}`
    : effectiveMerchantId
      ? `${baseUrl}/pay/${effectiveMerchantId}`
      : ""

  const handleCopy = async () => {
    if (!paymentUrl) return
    const success = await copyToClipboard(paymentUrl)
    if (success) {
      setCopied(true)
      toast.success("Payment link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async () => {
    if (!paymentUrl) return
    setDownloading(true)
    try {
      const canvas = qrRef.current?.querySelector("canvas")
      if (!canvas) {
        const img = qrRef.current?.querySelector("img")
        if (!img) {
          setDownloading(false)
          return
        }
        const link = document.createElement("a")
        link.download = `gemrails-qr-${effectiveMerchantId || slugify(businessName)}.png`
        link.href = img.src
        link.click()
        setDownloading(false)
        return
      }

      const link = document.createElement("a")
      link.download = `gemrails-qr-${effectiveMerchantId || slugify(businessName)}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
      setDownloading(false)
    } catch (err) {
      console.error("Download failed:", err)
      toast.error("Failed to download QR image. Use Print to save as PDF.")
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    if (!paymentUrl) return
    window.print()
  }

  return (
    <>
      {/* ========== PRINT VIEW (A4 Poster — OPay Inspired with GemRails Branding) ========== */}
      {paymentUrl && (
        <div className="hidden print:flex print:fixed print:inset-0 print:z-[9999] print:flex-col print:items-center print:justify-start print:min-h-screen print:w-full print:bg-gradient-to-b print:from-emerald-500 print:via-teal-600 print:to-teal-700">
          {/* Top Logo Badge */}
          <div className="mt-8 mb-6 w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2">
            <img src="/logo/logo_icon.png" alt="GemRails" className="w-full h-full object-contain rounded-xl" />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl font-black text-white tracking-tight mb-2 text-center px-4 drop-shadow-md">
            PAY WITH CRYPTO
          </h1>
          <p className="text-xl font-bold text-white/90 tracking-[0.3em] uppercase mb-4">
            Fast &amp; Secure Payments
          </p>

          {/* Platform Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-white/80 text-lg font-medium">Powered by</span>
            <span className="text-3xl font-black text-white drop-shadow-sm">GemRails</span>
          </div>

          {/* Business Name Card */}
          <div className="w-[90%] max-w-[600px] bg-white rounded-2xl shadow-xl p-6 mb-6 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wider shadow-lg">
              {selectedTerminal ? "Business" : "Business Name"}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-emerald-950 text-center uppercase mt-2">
              {businessName}
            </p>
            {selectedTerminal && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Branch
                  </p>
                  <p className="text-xl font-black text-emerald-900">
                    {selectedBranchName || "Main"}
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Terminal
                  </p>
                  <p className="text-xl font-black text-emerald-900">{selectedTerminal.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Scan Instruction */}
          <p className="text-white font-semibold text-xl mb-4">
            Scan to Pay with USDT or USDC
          </p>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl mb-4">
            <BusinessQRCode
              value={paymentUrl}
              size={450}
              qrStyle="dots"
              eyeRadius={15}
              logoImage={effectiveLogo}
              logoWidth={135}
              logoHeight={135}
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
              <span aria-hidden="true">🔒</span> Secure
            </span>
            <span className="text-white/40 text-lg" aria-hidden="true">
              |
            </span>
            <span className="text-white text-base font-semibold flex items-center gap-1">
              <span aria-hidden="true">⚡</span> Instant
            </span>
            <span className="text-white/40 text-lg" aria-hidden="true">
              |
            </span>
            <span className="text-white text-base font-semibold flex items-center gap-1">
              <span aria-hidden="true">💎</span> GemRails
            </span>
          </div>
        </div>
      )}

      {/* ========== SCREEN MODAL ========== */}
      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="merchant-qr-modal-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0d10] border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close QR code modal"
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800/60 z-10"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="p-6 sm:p-8 text-center pt-10">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                {isEnterprise ? (
                  <>
                    <Building2 className="w-3 h-3" aria-hidden="true" /> Enterprise QR Code
                  </>
                ) : (
                  <>
                    <Store className="w-3 h-3" aria-hidden="true" /> Merchant QR Code
                  </>
                )}
              </div>

              <h2 id="merchant-qr-modal-title" className="text-xl font-bold text-white mb-1">
                {businessName}
              </h2>

              {/* Terminal Selector for Enterprise Accounts */}
              {isEnterprise && terminals.length > 0 && (
                <div className="mt-4 mb-4 text-left">
                  <label
                    htmlFor="admin-qr-terminal-select"
                    className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5"
                  >
                    Select Terminal ({terminals.length})
                  </label>
                  <select
                    id="admin-qr-terminal-select"
                    value={selectedTerminal?.id || ""}
                    onChange={(e) => setSelectedTerminalId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500 text-white text-sm px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                  >
                    {terminals.map((t) => {
                      const bName =
                        t.branchName ||
                        (typeof t.branchId === "object" && t.branchId ? t.branchId.name : "Main")
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} — {bName} ({t.merchantId})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {isLoadingDetails && !paymentUrl ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" aria-hidden="true" />
                  <p className="text-sm">Loading business QR code...</p>
                </div>
              ) : !paymentUrl ? (
                <div className="my-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" aria-hidden="true" />
                  <p className="text-white font-semibold text-sm">
                    {isEnterprise ? "No Terminals Created Yet" : "No Merchant ID Found"}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {isEnterprise
                      ? `${businessName} is an Enterprise account and has not created any payment terminals yet. Once they create a terminal under a branch, you can view and print its QR code here.`
                      : `This business does not have a payment Merchant ID assigned yet.`}
                  </p>
                </div>
              ) : (
                <>
                  {selectedTerminal ? (
                    <p className="text-gray-400 text-xs mb-4 flex items-center justify-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>
                        {selectedBranchName || "Main"} •{" "}
                        <span className="text-white font-semibold">{selectedTerminal.name}</span>
                      </span>
                    </p>
                  ) : (
                    <p className="text-emerald-400 font-mono text-xs mb-4">
                      ID: {effectiveMerchantId}
                    </p>
                  )}

                  {/* QR Code Canvas */}
                  <div
                    ref={qrRef}
                    className="mb-5 inline-block p-2 bg-white rounded-2xl shadow-xl shadow-emerald-500/10"
                  >
                    <BusinessQRCode
                      value={paymentUrl}
                      size={240}
                      qrStyle="dots"
                      eyeRadius={10}
                      logoImage={effectiveLogo}
                      logoWidth={72}
                      logoHeight={72}
                      ecLevel="H"
                    />
                  </div>

                  {/* Payment Link Input + Copy */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2.5 bg-gray-900 border border-gray-800 rounded-xl">
                      <label htmlFor="admin-merchant-payment-url" className="sr-only">
                        Payment URL
                      </label>
                      <input
                        id="admin-merchant-payment-url"
                        type="text"
                        value={paymentUrl}
                        readOnly
                        className="flex-1 bg-transparent text-gray-300 text-xs outline-none truncate font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy payment URL"
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Copy className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    {/* Primary Action: Print QR Code */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full gemrails-button flex items-center justify-center gap-2 text-sm py-3"
                    >
                      <Printer className="w-4 h-4" aria-hidden="true" />
                      Print QR Code Poster
                    </button>

                    {/* Secondary Actions: Download PNG & Preview */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="gemrails-button-outline flex items-center justify-center gap-2 text-xs py-2.5"
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                        {downloading ? "Saving..." : "Download PNG"}
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(paymentUrl, "_blank", "noopener,noreferrer")}
                        className="gemrails-button-outline flex items-center justify-center gap-2 text-xs py-2.5"
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        Preview Page
                      </button>
                    </div>
                  </div>
                </>
              )}

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
