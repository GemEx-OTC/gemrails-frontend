"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, ChevronRight, Phone, CreditCard, Building2, Lock, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { PhoneVerificationModal } from "@/components/phone-verification-modal"
import { useVerifyCac } from "@/lib/hooks/use-kyc"
import { BUSINESS_CATEGORIES, TIER_LIMITS } from "@/lib/constants"
import { toast } from "sonner"
import type { ApiError } from "@/lib/api/types"
import { BankSelector } from "@/components/bank-selector"
import { useUpdateBankAccount, useVerifyBankAccount, useBanks } from "@/lib/hooks/use-auth"
import { useDashboard } from "@/lib/hooks/use-dashboard"
import { BusinessVerificationModal } from "@/components/business-verification-modal"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

export default function VerificationHubPage() {
  const { user, refreshUser } = useAuth()
  const { data: dashboardData } = useDashboard()
  const [showPhoneModal, setShowPhoneModal] = useState(false)

  // Bank State (for Tier 1)
  const [showBankSetup, setShowBankSetup] = useState(false)
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [verifyingAccount, setVerifyingAccount] = useState(false)
  const verifyBankMutation = useVerifyBankAccount()
  const updateBankMutation = useUpdateBankAccount()
  const { data: banksData } = useBanks()

  // CAC State (for Tier 2)
  const [showBusinessModal, setShowBusinessModal] = useState(false)

  const accountType = user?.accountType || "merchant"
  const isBranchMod = user?.role === "branch_mod"

  const phoneVerified = user?.phoneVerified || false
  const bankAdded = !!user?.bankAccount?.accountNumber
  const cacVerified = user?.cacVerified || false

  const tier = user?.tier ?? 0

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
    const bank = banksData?.find(b => b.code === bankCode)
    updateBankMutation.mutate(
      { bankCode, bankName: bank?.name || "Selected Bank", accountNumber, accountName },
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
              <p className="text-emerald-400/80 text-sm font-semibold mt-1">{formatCurrency(TIER_LIMITS[0])} Settlement Limit</p>
            </div>
            {tier >= 0 && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" /> Dashboard Access
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" /> Basic Payouts Enabled
            </li>
          </ul>

          {/* Volume Progress for Tier 0 */}
          {tier === 0 && (
            <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Settlement Progress</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {Math.round(((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[0])) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[0])) * 100)}%` }}
                  className={`h-full ${((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[0])) > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                <span className="text-white font-medium">{formatCurrency(dashboardData?.user?.settledVolume || 0)}</span> settled of {formatCurrency(dashboardData?.user?.tierLimit || TIER_LIMITS[0])}
              </p>
            </div>
          )}
        </div>

        {/* Tier 1 Card */}
        <div className={`p-6 rounded-3xl border transition-colors ${tier >= 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0a0d10] border-gray-800'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${tier >= 1 ? 'text-emerald-400' : 'text-amber-400'}`}>Tier 1</span>
              <h3 className="text-xl font-bold text-white mt-1">Business Setup</h3>
              <p className={`text-sm font-semibold mt-1 ${tier >= 1 ? 'text-emerald-400/80' : 'text-amber-400/80'}`}>{formatCurrency(TIER_LIMITS[1])} Settlement Limit</p>
            </div>
            {tier >= 1 ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Lock className="w-5 h-5 text-gray-600" />}
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4 text-emerald-500" /> Enable Terminals
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4 text-emerald-500" /> Extended Payouts
            </li>
          </ul>

          {/* Volume Progress for Tier 1 */}
          {tier === 1 && (
            <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Settlement Progress</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {Math.round(((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[1])) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[1])) * 100)}%` }}
                  className={`h-full ${((dashboardData?.user?.settledVolume || 0) / (dashboardData?.user?.tierLimit || TIER_LIMITS[1])) > 0.8 ? 'bg-red-500' : 'bg-amber-500'}`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                <span className="text-white font-medium">{formatCurrency(dashboardData?.user?.settledVolume || 0)}</span> settled of {formatCurrency(dashboardData?.user?.tierLimit || TIER_LIMITS[1])}
              </p>
            </div>
          )}

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
                disabled={bankAdded}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${bankAdded ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-4 h-4 ${bankAdded ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${bankAdded ? 'text-emerald-400' : 'text-gray-300'}`}>
                    Add Settlement Bank
                  </span>
                </div>
                {bankAdded ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
              </button>
            )}

            {/* Inline Bank Setup Form */}
            {showBankSetup && !bankAdded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-4 p-4 bg-gray-900/50 rounded-xl border border-emerald-500/30">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Select Bank</label>
                  <BankSelector value={bankCode} onChange={setBankCode} banks={banksData || []} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{10}"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="0123456789"
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
              <p className={`text-sm font-semibold mt-1 ${tier >= 2 ? 'text-emerald-400/80' : 'text-purple-400/80'}`}>Unlimited Volume</p>
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
              onClick={() => setShowBusinessModal(true)} 
              disabled={cacVerified || tier < 1}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                cacVerified 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : user?.kycStatus === 'rejected'
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : user?.kycSubmittedAt
                      ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 ${
                  cacVerified 
                    ? 'text-emerald-400' 
                    : user?.kycStatus === 'rejected'
                      ? 'text-red-400'
                      : user?.kycSubmittedAt
                        ? 'text-purple-400'
                        : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  cacVerified 
                    ? 'text-emerald-400' 
                    : user?.kycStatus === 'rejected'
                      ? 'text-red-300'
                      : user?.kycSubmittedAt
                        ? 'text-purple-300'
                        : tier < 1 
                          ? 'text-gray-600' 
                          : 'text-gray-300'
                }`}>
                  {cacVerified 
                    ? 'CAC Verified' 
                    : user?.kycStatus === 'rejected'
                      ? 'Verification Failed (Retry)'
                      : user?.kycSubmittedAt
                        ? 'Verification in Progress...'
                        : 'CAC Document & ID'}
                </span>
              </div>
              {cacVerified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : user?.kycStatus === 'rejected' ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : user?.kycSubmittedAt ? (
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              ) : (
                <ChevronRight className={`w-4 h-4 ${tier < 1 ? 'text-gray-700' : 'text-gray-500'}`} />
              )}
            </button>
            {user?.kycStatus === 'rejected' && user?.kycRejectionReason && (
              <p className="text-xs text-red-400/90 px-1">
                Reason: {user.kycRejectionReason}
              </p>
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

      <BusinessVerificationModal
        isOpen={showBusinessModal}
        onClose={() => setShowBusinessModal(false)}
        onVerified={() => {
          refreshUser();
          setShowBusinessModal(false);
        }}
      />
    </div>
  )
}
