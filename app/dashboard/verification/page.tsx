"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, ChevronRight, Phone, CreditCard, Building2, Lock, ArrowRight, Loader2, Check } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { PhoneVerificationModal } from "@/components/phone-verification-modal"
import { useVerifyCac } from "@/lib/hooks/use-kyc"
import { BUSINESS_CATEGORIES } from "@/lib/constants"
import { toast } from "sonner"
import type { ApiError } from "@/lib/api/types"
import { BankSelector } from "@/components/bank-selector"
import { useUpdateBankAccount, useVerifyBankAccount } from "@/lib/hooks/use-auth"

export default function VerificationHubPage() {
  const { user, refreshUser } = useAuth()
  const [showPhoneModal, setShowPhoneModal] = useState(false)

  // Bank State (for Tier 1)
  const [showBankSetup, setShowBankSetup] = useState(false)
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [verifyingAccount, setVerifyingAccount] = useState(false)
  const verifyBankMutation = useVerifyBankAccount()
  const updateBankMutation = useUpdateBankAccount()

  // CAC State (for Tier 2)
  const [showCacSetup, setShowCacSetup] = useState(false)
  const verifyCacMutation = useVerifyCac()
  const [cacValue, setCacValue] = useState("")
  const [cacDocument, setCacDocument] = useState<File | null>(null)
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")

  const accountType = user?.accountType || "merchant"
  const isBranchMod = user?.role === "branch_mod"

  const phoneVerified = user?.phoneVerified || false
  const bankAdded = !!user?.bankAccount?.accountNumber
  const cacVerified = (user as any)?.cacVerified || false

  const tier = (user as any)?.tier ?? 0

  if (isBranchMod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
        <p className="text-gray-400">Moderators do not require verification.</p>
      </div>
    )
  }

  // Handle Bank Account Resolution
  const handleAccountNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10)
    setAccountNumber(cleaned)
    setAccountName("")

    if (cleaned.length === 10 && bankCode) {
      setVerifyingAccount(true)
      verifyBankMutation.mutate(
        { bankCode, accountNumber: cleaned },
        {
          onSuccess: (data: { accountName: string }) => {
            setAccountName(data.accountName)
            setVerifyingAccount(false)
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to verify account")
            setVerifyingAccount(false)
          },
        }
      )
    }
  }

  const handleSaveBank = () => {
    if (!bankCode || !accountNumber || !accountName) {
      toast.error("Please fill in and verify all bank details.")
      return
    }
    const bankName = "Selected Bank" 
    updateBankMutation.mutate(
      { bankCode, bankName, accountNumber, accountName },
      {
        onSuccess: () => {
          toast.success("Bank account added! Tier 1 completed.")
          refreshUser()
          setShowBankSetup(false)
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Failed to add bank account")
        },
      }
    )
  }

  const handleVerifyCac = () => {
    if (!cacValue.startsWith("RC") && !cacValue.startsWith("BN")) {
      toast.error("Invalid Business Number. Must start with 'RC' or 'BN'")
      return
    }
    if (!businessAddress || !businessCategory) {
      toast.error("Please provide Business Address and Category for Tier 2 verification")
      return
    }

    const formData = new FormData()
    formData.append("rcNumber", cacValue)
    formData.append("businessAddress", businessAddress)
    formData.append("businessCategory", businessCategory)
    if (cacDocument) {
      formData.append("document", cacDocument)
    }

    verifyCacMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("CAC Verified! You are now Tier 2.")
        refreshUser()
        setShowCacSetup(false)
      },
      onError: (err: ApiError) => {
        toast.error(err.message || "Failed to verify CAC")
      },
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Verification Limits</h1>
        <p className="text-gray-400 mt-1">Upgrade your tier to unlock higher limits and more features.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tier 0 Card */}
        <div className={`p-6 rounded-3xl border transition-colors ${tier >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800 border-gray-700'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tier 0</span>
              <h3 className="text-xl font-bold text-white mt-1">Email Verified</h3>
            </div>
            {tier >= 0 && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" /> Dashboard Access
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4 text-gray-500" /> Payments Disabled
            </li>
            {/* <li className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4 text-gray-500" /> API Access Disabled
            </li> */}
          </ul>
        </div>

        {/* Tier 1 Card */}
        <div className={`p-6 rounded-3xl border transition-colors ${tier >= 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0a0d10] border-gray-800'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${tier >= 1 ? 'text-emerald-400' : 'text-amber-400'}`}>Tier 1</span>
              <h3 className="text-xl font-bold text-white mt-1">Business Setup</h3>
            </div>
            {tier >= 1 ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Lock className="w-5 h-5 text-gray-600" />}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4 text-emerald-500" /> Enable Terminals
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4 text-emerald-500" /> Enable Payments
            </li>
            {/* <li className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4 text-emerald-500" /> Enable API Keys
            </li> */}
          </ul>

          <div className="space-y-3 border-t border-gray-800 pt-4">
            {/* Phone Verification Link */}
            <button 
              onClick={() => setShowPhoneModal(!showPhoneModal)} 
              disabled={phoneVerified}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${phoneVerified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                <Phone className={`w-4 h-4 ${phoneVerified ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${phoneVerified ? 'text-emerald-400' : 'text-gray-300'}`}>Phone Verification</span>
              </div>
              {phoneVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Bank Setup Link (Merchants Only) */}
            {accountType === 'merchant' && (
              <button 
                onClick={() => setShowBankSetup(!showBankSetup)} 
                disabled={bankAdded || !phoneVerified}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${bankAdded ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-4 h-4 ${bankAdded ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${bankAdded ? 'text-emerald-400' : (!phoneVerified ? 'text-gray-600' : 'text-gray-300')}`}>
                    Add Settlement Bank
                  </span>
                </div>
                {bankAdded ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ChevronRight className={`w-4 h-4 ${!phoneVerified ? 'text-gray-700' : 'text-gray-500'}`} />}
              </button>
            )}

            {/* Inline Bank Setup Form */}
            {showBankSetup && !bankAdded && phoneVerified && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-4 p-4 bg-gray-900/50 rounded-xl border border-emerald-500/30">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Select Bank</label>
                  <BankSelector value={bankCode} onChange={setBankCode} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="0123456789"
                    maxLength={10}
                    className="gemrails-input py-2"
                  />
                </div>
                {verifyingAccount && (
                  <div className="flex items-center gap-2 text-amber-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </div>
                )}
                {accountName && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs text-emerald-400">Account Verified</p>
                    <p className="text-sm font-medium text-white">{accountName}</p>
                  </div>
                )}
                <button
                  onClick={handleSaveBank}
                  disabled={!accountName || updateBankMutation.isPending}
                  className="w-full gemrails-button text-sm py-2"
                >
                  Save Bank Account
                </button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Tier 2 Card */}
        <div className={`p-6 rounded-3xl border transition-colors ${tier >= 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0a0d10] border-gray-800'}`}>
           <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${tier >= 2 ? 'text-emerald-400' : 'text-purple-400'}`}>Tier 2</span>
              <h3 className="text-xl font-bold text-white mt-1">Full KYC</h3>
            </div>
            {tier >= 2 ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Lock className="w-5 h-5 text-gray-600" />}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-white">
              <Check className="w-4 h-4 text-purple-500" /> Unlimited Volume
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-purple-500" /> High-limits settlements
            </li>
          </ul>

          <div className="space-y-3 border-t border-gray-800 pt-4">
             <button 
              onClick={() => setShowCacSetup(!showCacSetup)} 
              disabled={cacVerified || tier < 1}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${cacVerified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 ${cacVerified ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${cacVerified ? 'text-emerald-400' : (tier < 1 ? 'text-gray-600' : 'text-gray-300')}`}>CAC Document</span>
              </div>
              {cacVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ChevronRight className={`w-4 h-4 ${tier < 1 ? 'text-gray-700' : 'text-gray-500'}`} />}
            </button>

            {/* Inline CAC Setup Form */}
            {showCacSetup && !cacVerified && tier >= 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-4 p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">RC Number</label>
                  <input
                    type="text"
                    value={cacValue}
                    onChange={(e) => setCacValue(e.target.value)}
                    placeholder="RC1234567"
                    className="gemrails-input py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Business Category</label>
                  <select value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="gemrails-select py-2">
                    <option value="" disabled>Select category</option>
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Registered Address</label>
                  <textarea
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    rows={2}
                    placeholder="E.g. 14 Admiralty Way"
                    className="gemrails-input resize-none py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">CAC Document (Optional PDF/PNG)</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*"
                    onChange={(e) => setCacDocument(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                  />
                </div>
                <button
                  onClick={handleVerifyCac}
                  disabled={!cacValue || !businessCategory || verifyCacMutation.isPending}
                  className="w-full gemrails-button text-sm py-2 bg-purple-500 hover:bg-purple-600 text-white shadow-none"
                >
                  {verifyCacMutation.isPending ? "Submitting..." : "Verify CAC"}
                </button>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      <PhoneVerificationModal 
        isOpen={showPhoneModal} 
        onClose={() => setShowPhoneModal(false)} 
        onVerified={() => {
          setShowPhoneModal(false);
          refreshUser();
        }}
        initialPhone={user?.phone}
        userHasPhone={!!user?.phone}
      />
    </div>
  )
}
