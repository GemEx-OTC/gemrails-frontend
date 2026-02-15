"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, User, CreditCard, Bell, Shield, Save, Check, Upload, MapPin, Mail, Phone, X, Lock } from "lucide-react"
import { toast } from "sonner"
import { NIGERIAN_BANKS, BUSINESS_CATEGORIES } from "@/lib/constants"
import { OTPInput } from "@/components/otp-input"
import { InlineAlert } from "@/components/alert"
import { useAuth } from "@/context/auth-context"
import { useUpdateProfile, useUpdateSettings, useUpdateBankAccount, useUploadLogo, useDeleteLogo } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"
import { getImageUrl } from "@/lib/utils/image"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<"business" | "bank" | "notifications">("business")

  // Mutations
  const updateProfileMutation = useUpdateProfile()
  const updateSettingsMutation = useUpdateSettings()
  const updateBankMutation = useUpdateBankAccount()
  const uploadLogoMutation = useUploadLogo()
  const deleteLogoMutation = useDeleteLogo()

  // Business form state
  const [businessName, setBusinessName] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [businessLogo, setBusinessLogo] = useState("")
  const [rcNumber, setRcNumber] = useState("")

  // Bank form state
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [showBankChangeModal, setShowBankChangeModal] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // Notification state
  const [notifyEmail, setNotifyEmail] = useState(false)
  const [notifySms, setNotifySms] = useState(false)

  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || "")
      setBusinessCategory(user.businessCategory || "")
      setBusinessAddress(user.businessAddress || "")
      setContactName(user.contactName || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setBusinessLogo(user.businessLogo || "")
      setRcNumber(user.rcNumber || "")

      if (user.bankAccount) {
        setBankCode(user.bankAccount.bankCode || "")
        setAccountNumber(user.bankAccount.accountNumber || "")
        setAccountName(user.bankAccount.accountName || "")
      }

      if (user.settings) {
        setNotifyEmail(user.settings.emailNotifications)
        setNotifySms(user.settings.smsNotifications)
      }
    }
  }, [user])

  const handleSave = async () => {
    if (activeTab === "business") {
      updateProfileMutation.mutate(
        { businessName, businessCategory, businessAddress, contactName, phone, rcNumber },
        {
          onSuccess: () => {
            toast.success("Business profile updated!")
            refreshUser()
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to update profile")
          },
        }
      )
    } else if (activeTab === "notifications") {
      updateSettingsMutation.mutate(
        { emailNotifications: notifyEmail, smsNotifications: notifySms },
        {
          onSuccess: () => {
            toast.success("Notification settings updated!")
            refreshUser()
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to update settings")
          },
        }
      )
    }
  }

  const handleBankChange = () => {
    setShowBankChangeModal(true)
    setOtpValue("")
    setOtpError(false)
    setOtpSent(false)
  }

  const handleSendOtp = () => {
    setOtpSending(true)
    setTimeout(() => {
      setOtpSending(false)
      setOtpSent(true)
      toast.success("OTP sent to your phone!")
    }, 1500)
  }

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError(true)
      toast.error("Please enter a valid 6-digit code")
      return
    }

    setVerifying(true)
    // Simulated OTP verification
    if (otpValue === "123456") {
      const bank = NIGERIAN_BANKS.find((b) => b.code === bankCode)
      updateBankMutation.mutate(
        { bankCode, bankName: bank?.name || "", accountNumber, accountName },
        {
          onSuccess: () => {
            toast.success("Bank account updated successfully!")
            setShowBankChangeModal(false)
            refreshUser()
          },
          onError: (err: ApiError) => {
            toast.error(err.message || "Failed to update bank account")
          },
        }
      )
    } else {
      setOtpError(true)
      toast.error("Invalid OTP code")
    }
    setVerifying(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB")
      e.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("logo", file)

    uploadLogoMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Logo uploaded successfully!")
        refreshUser()
      },
      onError: (err: ApiError) => {
        toast.error(err.message || "Failed to upload logo")
      },
    })
    e.target.value = ""
  }

  const handleLogoDelete = async () => {
    deleteLogoMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logo removed!")
        setBusinessLogo("")
        refreshUser()
      },
      onError: (err: ApiError) => {
        toast.error(err.message || "Failed to delete logo")
      },
    })
  }

  const saving = updateProfileMutation.isPending || updateSettingsMutation.isPending
  const uploadingLogo = uploadLogoMutation.isPending || deleteLogoMutation.isPending

  const tabs = [
    { id: "business", label: "Business Profile", icon: Building2 },
    { id: "bank", label: "Bank Account", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your business profile and preferences</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        {activeTab === "business" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">Business Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden relative group">
                  {businessLogo ? (
                    <img 
                      src={getImageUrl(businessLogo) || undefined} 
                      alt="Business Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide broken image and show fallback
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-3xl ${businessLogo ? 'hidden' : ''}`}>🏪</span>
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label
                      className={`gemrails-button-outline flex items-center gap-2 cursor-pointer ${uploadingLogo ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Upload className="w-4 h-4" />
                      {businessLogo ? "Change Logo" : "Upload Logo"}
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                    </label>
                    {businessLogo && (
                      <button
                        onClick={handleLogoDelete}
                        disabled={uploadingLogo}
                        className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">PNG or JPG, max 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Merchant ID</label>
                <div className="font-mono text-white">{user?.merchantId || "N/A"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                  {user?.merchantStatus || "Pending"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="gemrails-input-icon"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Business Category</label>
                <select value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="gemrails-select">
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">RC Number (Optional)</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value)}
                  placeholder="RC123456"
                  className="gemrails-input-icon"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <textarea
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  rows={2}
                  className="gemrails-input-icon resize-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Contact Person</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="gemrails-input-icon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gemrails-input-icon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="gemrails-input-icon" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "bank" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <InlineAlert
              type="warning"
              title="Bank changes require verification"
              message="Changing your bank details requires OTP verification. New details will be reviewed within 24 hours."
            />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Bank</label>
                <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} className="gemrails-select">
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="gemrails-input"
                />
              </div>
              <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Account Name</p>
                <p className="text-white font-medium">{accountName}</p>
              </div>
            </div>

            {user?.bankAccount?.isVerified && (
              <InlineAlert type="success" title="Verified Account" message="This account has been verified and is ready to receive settlements." />
            )}
            {!user?.bankAccount?.isVerified && user?.bankAccount?.accountNumber && (
              <InlineAlert
                type="warning"
                title="Verification Pending"
                message="Your bank account is currently being verified. This usually takes less than 24 hours."
              />
            )}

            <motion.button
              onClick={handleBankChange}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gemrails-button-outline w-full flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Bank Account
            </motion.button>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <p className="text-gray-400">Choose how you want to be notified about payments and updates.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive payment confirmations via email</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifyEmail(!notifyEmail)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifyEmail ? "bg-emerald-500" : "bg-gray-700"}`}
                >
                  <motion.div animate={{ x: notifyEmail ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive payment alerts via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifySms(!notifySms)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifySms ? "bg-emerald-500" : "bg-gray-700"}`}
                >
                  <motion.div animate={{ x: notifySms ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab !== "bank" && (
          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gemrails-button flex items-center gap-2"
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBankChangeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBankChangeModal(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-[#12161c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Verify Bank Change</h2>
                      <p className="text-sm text-gray-400">Enter the OTP sent to your phone</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBankChangeModal(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {!otpSent ? (
                  <>
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">
                        We'll send a 6-digit verification code to your registered phone number ending in{" "}
                        <span className="text-white font-medium">****{phone.slice(-4)}</span>
                      </p>
                    </div>
                    <motion.button
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="gemrails-button w-full flex items-center justify-center gap-2"
                    >
                      {otpSending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Send OTP
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-gray-400">
                        Enter the 6-digit code sent to <span className="text-white font-medium">****{phone.slice(-4)}</span>
                      </p>
                    </div>

                    <OTPInput
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value)
                        setOtpError(false)
                      }}
                      error={otpError}
                      disabled={verifying}
                    />

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Didn't receive the code?{" "}
                        <button onClick={handleSendOtp} className="text-emerald-400 hover:text-emerald-300 font-medium">
                          Resend OTP
                        </button>
                      </p>
                    </div>

                    <motion.button
                      onClick={handleVerifyOtp}
                      disabled={otpValue.length !== 6 || verifying}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="gemrails-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Verify & Update
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-600 text-center">Demo: Use code 123456</p>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
