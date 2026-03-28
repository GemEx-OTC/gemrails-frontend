"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X, Check, Loader2 } from "lucide-react"
import { OTPInput } from "@/components/otp-input"
import { useSendPhoneOtp, useVerifyPhoneOtp } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

interface PhoneVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  initialPhone?: string
  userHasPhone: boolean
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
  initialPhone = "",
  userHasPhone,
}: PhoneVerificationModalProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpSending, setOtpSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const sendPhoneOtpMutation = useSendPhoneOtp()
  const verifyPhoneOtpMutation = useVerifyPhoneOtp()

  const handleSendOtp = async () => {
    setOtpSending(true)
    try {
      const targetPhone = phone.startsWith("+") ? phone : `+234${phone.replace(/^0/, "")}`
      await sendPhoneOtpMutation.mutateAsync(targetPhone)
      setOtpSent(true)
      toast.success("Verification code sent! 📱")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send verification code")
    } finally {
      setOtpSending(false)
    }
  }

  const handleVerifyOtp = async () => {
    setVerifying(true)
    try {
      const targetPhone = phone.startsWith("+") ? phone : `+234${phone.replace(/^0/, "")}`
      await verifyPhoneOtpMutation.mutateAsync({ phone: targetPhone, otp: otpValue })
      toast.success("Phone number verified! ✓")
      onVerified()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid verification code")
    } finally {
      setVerifying(false)
    }
  }

  const maskPhone = (p: string) => {
    if (!p) return ""
    const cleaned = p.replace(/^\+234/, "")
    if (cleaned.length < 7) return p
    return `+234 ${cleaned.slice(0, 3)}***${cleaned.slice(-4)}`
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
          className="relative w-full max-w-md bg-[#12161c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Verify Phone Number</h2>
                  <p className="text-sm text-gray-400">Tier 1 Verification</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {!otpSent ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    {userHasPhone 
                      ? `We'll send a verification code to your registered phone number ${maskPhone(phone)}`
                      : "Please enter your phone number to receive a verification code."
                    }
                  </p>
                </div>
                
                {!userHasPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+234</span>
                      <input
                        type="tel"
                        value={phone.replace(/^\+234/, "")}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="8012345678"
                        className="gemrails-input pl-14 w-full"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={handleSendOtp}
                  disabled={otpSending || (!userHasPhone && !phone)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gemrails-button w-full flex items-center justify-center gap-2"
                >
                  {otpSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Send Verification Code
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400">
                    Enter the 6-digit code sent to <span className="text-white font-medium">
                      {maskPhone(phone)}
                    </span>
                  </p>
                </div>

                <OTPInput
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={verifying}
                />

                <div className="flex items-center justify-between pt-2">
                   <button 
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>

                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={verifying || otpValue.length !== 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gemrails-button w-full flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Verify & Continue
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
