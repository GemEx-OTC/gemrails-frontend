"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Building2, MapPin, User, Phone, CreditCard, Check, ChevronRight, ChevronLeft, Shield } from "lucide-react"
import { toast } from "sonner"
import { BUSINESS_CATEGORIES, NIGERIAN_BANKS } from "@/lib/constants"
import { useAuth } from "@/context/auth-context"
import { useUpdateProfile, useUpdateBankAccount } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

type OnboardingStep = "business" | "bank" | "complete"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [step, setStep] = useState<OnboardingStep>("business")

  const updateProfileMutation = useUpdateProfile()
  const updateBankMutation = useUpdateBankAccount()

  // Business details
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [rcNumber, setRcNumber] = useState("")
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")

  // Bank details
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [verifyingAccount, setVerifyingAccount] = useState(false)

  useEffect(() => {
    if (user) {
      setBusinessCategory(user.businessCategory || "")
      setBusinessAddress(user.businessAddress || "")
      setRcNumber(user.rcNumber || "")
      setContactName(user.contactName || "")
      setPhone(user.phone || "")

      if (user.bankAccount) {
        setBankCode(user.bankAccount.bankCode || "")
        setAccountNumber(user.bankAccount.accountNumber || "")
        setAccountName(user.bankAccount.accountName || "")
      }
    }
  }, [user])

  useEffect(() => {
    if (user?.bankAccount?.accountNumber === accountNumber && user?.bankAccount?.bankCode === bankCode && accountName) {
      return
    }

    if (accountNumber.length === 10 && bankCode) {
      setVerifyingAccount(true)
      setTimeout(() => {
        setAccountName("DEMO BUSINESS ACCOUNT")
        setVerifyingAccount(false)
      }, 1500)
    } else {
      setAccountName("")
    }
  }, [accountNumber, bankCode, user, accountName])

  const steps = [
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "bank", label: "Bank Account", icon: CreditCard },
    { id: "complete", label: "Complete", icon: Check },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  const validateBusinessStep = () => {
    if (!businessCategory) return "Please select a business category"
    if (!businessAddress.trim()) return "Business address is required"
    if (!contactName.trim()) return "Contact name is required"
    if (!phone || phone.length < 10) return "Please enter a valid phone number"
    return null
  }

  const validateBankStep = () => {
    if (!bankCode) return "Please select a bank"
    if (accountNumber.length !== 10) return "Account number must be 10 digits"
    if (!accountName.trim()) return "Account name is required"
    return null
  }

  const handleNext = async () => {
    if (step === "business") {
      const err = validateBusinessStep()
      if (err) {
        toast.error(err)
        return
      }

      updateProfileMutation.mutate(
        { businessName: user?.businessName, businessCategory, businessAddress, contactName, phone, rcNumber },
        {
          onSuccess: () => {
            toast.success("Business profile updated!")
            refreshUser()
            setStep("bank")
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to update profile")
          },
        }
      )
    } else if (step === "bank") {
      const err = validateBankStep()
      if (err) {
        toast.error(err)
        return
      }

      const bank = NIGERIAN_BANKS.find((b) => b.code === bankCode)
      updateBankMutation.mutate(
        { bankCode, bankName: bank?.name || "", accountNumber, accountName },
        {
          onSuccess: () => {
            toast.success("Bank account added!")
            setStep("complete")
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to add bank account")
          },
        }
      )
    }
  }

  const handleBack = () => {
    if (step === "bank") setStep("business")
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  const loading = updateProfileMutation.isPending || updateBankMutation.isPending

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, idx) => {
              const Icon = s.icon
              const isActive = idx === currentStepIndex
              const isCompleted = idx < currentStepIndex
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                            ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                            : "bg-gray-800 text-gray-500 border border-gray-700"
                      }`}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </motion.div>
                    <span className={`text-xs mt-2 ${isActive || isCompleted ? "text-emerald-400" : "text-gray-500"}`}>{s.label}</span>
                  </div>
                  {idx < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 ${idx < currentStepIndex ? "bg-emerald-500" : "bg-gray-700"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === "business" && (
              <motion.div key="business" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Business Profile</h2>
                  <p className="text-gray-400 mt-1 text-sm">This helps us verify your business and provide better service</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Business Category</label>
                    <select value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="gemrails-select">
                      <option value="">Select category</option>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Business Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                      <textarea
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        placeholder="Full business address"
                        rows={2}
                        className="gemrails-input-icon resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      RC/BN Number <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={rcNumber}
                      onChange={(e) => setRcNumber(e.target.value)}
                      placeholder="Business registration number"
                      className="gemrails-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Person</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Full name"
                          className="gemrails-input-icon"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" className="gemrails-input-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleSkip}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 py-3.5 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Skip for now
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="gemrails-button flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? "Saving..." : "Continue"} <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "bank" && (
              <motion.div key="bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Add Settlement Account</h2>
                  <p className="text-gray-400 mt-1 text-sm">Where you'll receive your Naira payments</p>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-sm text-emerald-300">💡 Payments are settled instantly to this account. Make sure the details are correct.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bank</label>
                    <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} className="gemrails-select">
                      <option value="">Select your bank</option>
                      {NIGERIAN_BANKS.map((bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit account number"
                      className="gemrails-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Name</label>
                    <div className="relative">
                      <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account Name" className="gemrails-input" />
                      {verifyingAccount && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="gemrails-button-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    disabled={loading || verifyingAccount}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="gemrails-button flex-1"
                  >
                    {loading ? "Saving..." : "Complete Setup"}
                  </motion.button>
                </div>

                <button onClick={handleSkip} className="w-full py-2 text-gray-500 hover:text-gray-400 transition-colors text-sm">
                  Skip for now
                </button>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
                <p className="text-gray-400 mb-6">Your business profile is complete. You can now start accepting payments.</p>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Verified Merchant</span>
                  </div>
                </div>

                <motion.button onClick={handleComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button w-full">
                  Go to Dashboard
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
