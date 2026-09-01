"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, X, Check, Loader2, Upload, Info, AlertCircle, Clock, Shield, Sparkles, FileText, Camera } from "lucide-react"
import { useVerifyCac } from "@/lib/hooks/use-kyc"
import { getKycStatus, getSmileIdToken, recordKycSubmitted } from "@/lib/api/kyc"
import { useVerifyMerchantCac } from "@/lib/hooks/use-admin"
import { getMerchantKycStatus } from "@/lib/api/admin"
import { CategorySelector } from "@/components/category-selector"
import { BUSINESS_CATEGORIES } from "@/lib/constants"
import { toast } from "sonner"
import type { ApiError, SmileIdentityConfig } from "@/lib/api/types"
import { useAuth } from "@/context/auth-context"

interface BusinessVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  merchantId?: string
  isAdmin?: boolean
}

export function BusinessVerificationModal({
  isOpen,
  onClose,
  onVerified,
  merchantId,
  isAdmin = false,
}: BusinessVerificationModalProps) {
  const { user, refreshUser } = useAuth()
  const verifyCacMutation = useVerifyCac()
  const verifyMerchantCacMutation = useVerifyMerchantCac()

  const [mode, setMode] = useState<"choose" | "smileid" | "manual">("choose")
  const [rcNumber, setRcNumber] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [cacDocument, setCacDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [pollMessage, setPollMessage] = useState("Authenticating with CAC Registry...")
  const [sdkLoading, setSdkLoading] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const pollCount = useRef(0)
  const MAX_POLLS = 20 // 20 * 3s = 60s total

  // Load SmileID v12 Web SDK dynamically
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.SmileIdentity || document.querySelector('script[src*="usesmileid.com"]')) {
      setSdkLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.usesmileid.com/inline/v12/js/script.min.js"
    script.async = true
    script.onload = () => setSdkLoaded(true)
    script.onerror = () => setErrorMessage("Failed to load SmileID verification SDK.")
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [])

  const startPolling = (jobId: string) => {
    setIsPolling(true)
    pollCount.current = 0

    pollingInterval.current = setInterval(async () => {
      pollCount.current += 1

      if (pollCount.current > 5) setPollMessage("Verification taking longer than usual...")
      if (pollCount.current > 12) setPollMessage("Still processing. Please stay with us...")

      try {
        const result = isAdmin && merchantId
          ? await getMerchantKycStatus(merchantId, jobId)
          : await getKycStatus(jobId)

        if (result.status === "success") {
          if (pollingInterval.current) clearInterval(pollingInterval.current)
          toast.success("Business verified successfully! 🎉")
          refreshUser()
          onVerified()
          onClose()
        } else if (result.status === "failed") {
          if (pollingInterval.current) clearInterval(pollingInterval.current)
          setIsPolling(false)
          setIsSubmitting(false)
          toast.error(result.message || "Verification failed")
        }
      } catch (error) {
        console.error("Polling error:", error)
      }

      if (pollCount.current >= MAX_POLLS) {
        if (pollingInterval.current) clearInterval(pollingInterval.current)
        setIsPolling(false)
        setIsSubmitting(false)
        toast.error("Verification timed out. We will update your status once CAC responds.")
        onClose()
      }
    }, 3000)
  }

  // SmileID Hosted Web SDK Flow
  const startSmileIDHostedFlow = useCallback(async (productType: "doc_verification" | "biometric_kyc" = "doc_verification") => {
    setSdkLoading(true)
    setErrorMessage("")

    try {
      // 1. Mint v3 Web Token
      const tokenData = await getSmileIdToken(productType === "doc_verification" ? "document_verification" : "biometric_kyc")

      if (!tokenData?.token) {
        throw new Error("Failed to generate verification session token.")
      }

      const nameParts = (user?.contactName || user?.businessName || "Merchant User").split(" ")
      const firstName = nameParts[0] || "Merchant"
      const lastName = nameParts.slice(1).join(" ") || "User"

      const smileConfig: SmileIdentityConfig = {
        token: tokenData.token,
        product: productType,
        callback_url: tokenData.callback_url || "https://api.gemrails.com/api/v1/webhooks/smileid",
        environment: tokenData.environment || "production",
        partner_details: {
          partner_id: tokenData.partner_id || "8428",
          name: "GemRails",
          theme_color: "#10B981",
          logo_url: "https://gemrails.com/logo.png",
          policy_url: "https://gemrails.com/privacy",
        },
        user_details: {
          given_names: firstName,
          last_name: lastName,
          email: user?.email,
          phone_number: user?.phone,
        },
        consent_information: {
          granted: true,
          granted_at: new Date().toISOString(),
          notice_language: "EN",
          notice_privacy_policy_url: "https://gemrails.com/privacy",
        },
        onResult: async (res) => {
          console.log("[SmileID SDK] Result received:", res)
          try {
            await recordKycSubmitted()
            toast.success("Verification submitted! Processing your business documents.")
            refreshUser()
            onVerified()
            onClose()
          } catch (e) {
            console.error("Error recording KYC submission:", e)
            toast.success("Verification completed with SmileID.")
            refreshUser()
            onVerified()
            onClose()
          }
        },
        onSuccess: async () => {
          try {
            await recordKycSubmitted()
            toast.success("Identity verified successfully!")
            refreshUser()
            onVerified()
            onClose()
          } catch (e) {
            console.error(e)
          }
        },
        onError: (err) => {
          console.error("[SmileID SDK] Error:", err)
          setErrorMessage(typeof err === "string" ? err : err?.message || "Verification session encountered an issue.")
          setSdkLoading(false)
        },
        onClose: () => {
          setSdkLoading(false)
        },
      }

      if (typeof window.SmileIdentity === "function") {
        window.SmileIdentity(smileConfig)
      } else {
        throw new Error("SmileID SDK is still initializing. Please try again.")
      }
    } catch (err: any) {
      console.error("[SmileID] Start flow error:", err)
      const msg = err?.response?.data?.message || err?.message || "Failed to initialize SmileID verification."
      setErrorMessage(msg)
      setSdkLoading(false)
    }
  }, [user, refreshUser, onVerified, onClose])

  const SMILE_ID_REGEX = /^0{7}$|^(?![0]+$)[A-Z0-9]{1,8}$/i

  const handleVerifyCac = () => {
    const normalizedInput = rcNumber.trim().toUpperCase()
    const numericPart = normalizedInput.replace(/^(RC|BN)/, "")

    if (!normalizedInput.startsWith("RC") && !normalizedInput.startsWith("BN")) {
      toast.error("Invalid Business Number. Must start with 'RC' or 'BN'")
      return
    }

    if (!SMILE_ID_REGEX.test(numericPart)) {
      toast.error("Unsupported ID number format. Please ensure you are using a valid RC or BN number.")
      return
    }

    if (!businessAddress || !businessCategory) {
      toast.error("Please provide Business Address and Category for Tier 2 verification")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("rcNumber", normalizedInput)
    formData.append("businessAddress", businessAddress)
    formData.append("businessCategory", businessCategory)
    if (cacDocument) {
      formData.append("document", cacDocument)
    }

    const handleSuccess = (data: any) => {
      if (data.status === "success") {
        toast.success("Business verified successfully! ✓")
        refreshUser()
        onVerified()
        onClose()
      } else {
        startPolling(data.jobId)
      }
    }

    const handleError = (err: ApiError) => {
      toast.error(err.message || "Failed to submit verification")
      setIsSubmitting(false)
    }

    if (isAdmin && merchantId) {
      verifyMerchantCacMutation.mutate(
        { merchantId, data: formData },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      )
    } else {
      verifyCacMutation.mutate(formData, {
        onSuccess: handleSuccess,
        onError: handleError,
      })
    }
  }

  if (!isOpen) return null

  const handleInputChange = (val: string) => {
    let formatted = val.toUpperCase()
    if (/^\d/.test(formatted)) {
      formatted = "RC" + formatted
    }
    setRcNumber(formatted)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting && !sdkLoading ? onClose : undefined}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#12161c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col my-auto"
        >
          {isPolling ? (
            <div className="p-10 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-t-2 border-r-2 border-emerald-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Verifying Business</h3>
                <p className="text-gray-400 text-sm max-w-[280px]">{pollMessage}</p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Average time: 15-30 seconds</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-white">Business Verification</h2>
                    <p className="text-xs text-gray-400">Tier 2 Verification (CAC & Documents)</p>
                  </div>
                </div>
                {!isSubmitting && !sdkLoading && (
                  <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {mode === "choose" && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-300 leading-relaxed">
                        <p className="font-semibold text-emerald-300 mb-0.5">Automated Identity & CAC Verification</p>
                        Choose how you would like to verify your business with SmileID.
                      </div>
                    </div>

                    {/* Option 1: SmileID Instant Web SDK Hosted Flow */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => startSmileIDHostedFlow("doc_verification")}
                      disabled={sdkLoading}
                      className="w-full text-left p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-white">Instant Document & Liveness Capture</p>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Scan your CAC Certificate, National ID or Passport with live camera capture.
                        </p>
                      </div>
                    </motion.button>

                    {/* Option 2: Manual CAC Number & Details */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setMode("manual")}
                      className="w-full text-left p-4 rounded-xl border border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-800/40 transition-all flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white mb-1">Manual CAC Registration Lookup</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Enter your RC/BN Number, registered address, and attach your CAC document file.
                        </p>
                      </div>
                    </motion.button>

                    {sdkLoading && (
                      <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing SmileID secure session...</span>
                      </div>
                    )}
                  </div>
                )}

                {mode === "manual" && (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Enter your details exactly as they appear on your CAC documents.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">RC / BN Number</label>
                        <input
                          type="text"
                          value={rcNumber}
                          disabled={isSubmitting}
                          onChange={(e) => handleInputChange(e.target.value)}
                          placeholder="RC1234567"
                          className="gemrails-input w-full text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Business Category</label>
                        <CategorySelector
                          value={businessCategory}
                          onChange={setBusinessCategory}
                          categories={BUSINESS_CATEGORIES}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Registered Business Address</label>
                      <textarea
                        value={businessAddress}
                        disabled={isSubmitting}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        rows={2}
                        placeholder="E.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                        className="gemrails-input w-full resize-none py-2.5 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">CAC Document (Optional PDF/PNG)</label>
                      <div className={`relative border-2 border-dashed ${isSubmitting ? "opacity-50 cursor-not-allowed" : "border-gray-800 hover:border-emerald-500/50 cursor-pointer"} rounded-xl p-4 transition-colors text-center bg-gray-900/50`}>
                        <input
                          type="file"
                          disabled={isSubmitting}
                          accept=".pdf,image/*"
                          onChange={(e) => setCacDocument(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="space-y-1">
                          <div className="mx-auto w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                            <Upload className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-white truncate px-2">
                              {cacDocument ? cacDocument.name : "Click to upload CAC Document"}
                            </p>
                            <p className="text-[11px] text-gray-500">PDF, PNG, JPG (max 20MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={() => setMode("choose")}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 text-xs sm:text-sm font-medium transition-all"
                      >
                        Back
                      </button>
                      <motion.button
                        onClick={handleVerifyCac}
                        disabled={isSubmitting || !rcNumber || !businessCategory}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="gemrails-button flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 h-10 sm:h-11 disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Starting Verification...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Submit for Verification
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
