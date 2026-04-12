"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, X, Check, Loader2, ChevronRight, Upload, Info } from "lucide-react"
import { useVerifyCac } from "@/lib/hooks/use-kyc"
import { CategorySelector } from "@/components/category-selector"
import { BUSINESS_CATEGORIES } from "@/lib/constants"
import { toast } from "sonner"
import type { ApiError } from "@/lib/api/types"

interface BusinessVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
}

export function BusinessVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: BusinessVerificationModalProps) {
  const verifyCacMutation = useVerifyCac()
  const [rcNumber, setRcNumber] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [cacDocument, setCacDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerifyCac = () => {
    if (!rcNumber.startsWith("RC") && !rcNumber.startsWith("BN")) {
      toast.error("Invalid Business Number. Must start with 'RC' or 'BN'")
      return
    }
    if (!businessAddress || !businessCategory) {
      toast.error("Please provide Business Address and Category for Tier 2 verification")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("rcNumber", rcNumber)
    formData.append("businessAddress", businessAddress)
    formData.append("businessCategory", businessCategory)
    if (cacDocument) {
      formData.append("document", cacDocument)
    }

    verifyCacMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Business documents submitted for verification! ✓")
        onVerified()
        onClose()
      },
      onError: (err: ApiError) => {
        toast.error(err.message || "Failed to submit verification")
      },
      onSettled: () => {
        setIsSubmitting(false)
      }
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#12161c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Business Verification</h2>
                  <p className="text-sm text-gray-400">Tier 2 Verification (CAC)</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                   Enter your business details exactly as they appear on your CAC documents. Verification usually takes 24-48 hours.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-2">RC / BN Number</label>
                    <input
                        type="text"
                        value={rcNumber}
                        onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
                        placeholder="RC1234567"
                        className="gemrails-input w-full"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-2">Business Category</label>
                    <CategorySelector
                        value={businessCategory}
                        onChange={setBusinessCategory}
                        categories={BUSINESS_CATEGORIES}
                    />
                </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Registered Business Address</label>
              <textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                rows={3}
                placeholder="E.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                className="gemrails-input w-full resize-none py-3"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">CAC Document (Optional PDF/PNG)</label>
              <div className="relative border-2 border-dashed border-gray-800 hover:border-purple-500/50 rounded-xl p-6 transition-colors text-center bg-gray-900/50">
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={(e) => setCacDocument(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">
                            {cacDocument ? cacDocument.name : "Click to upload CAC Document"}
                        </p>
                        <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or PDF (max. 5MB)
                        </p>
                    </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
                <motion.button
                    onClick={handleVerifyCac}
                    disabled={isSubmitting || !rcNumber || !businessCategory}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="gemrails-button w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 h-12"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Submit for Verification
                        </>
                    )}
                </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
