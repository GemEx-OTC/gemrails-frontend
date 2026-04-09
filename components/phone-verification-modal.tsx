"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X, Check, Loader2, RotateCcw } from "lucide-react"
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

const RESEND_COOLDOWN = 120 // 2 minutes in seconds

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
  const [countdown, setCountdown] = useState(0)

  const sendPhoneOtpMutation = useSendPhoneOtp()
  const verifyPhoneOtpMutation = useVerifyPhoneOtp()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendOtp = async () => {
    if (countdown > 0) return
    
    setOtpSending(true)
    try {
      // Normalize phone: if it already starts with + or 234, don't double-prepend
      let targetPhone = phone.trim();
      if (!targetPhone.startsWith('+')) {
        if (targetPhone.startsWith('234')) {
          targetPhone = `+${targetPhone}`;
        } else {
          targetPhone = `+234${targetPhone.replace(/^0/, "")}`;
        }
      }
      
      await sendPhoneOtpMutation.mutateAsync(targetPhone)
      setOtpSent(true)
      setCountdown(RESEND_COOLDOWN) // Start 2-minute countdown
      toast.success("Verification code sent! 📱")
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'TOO_MANY_REQUESTS') {
        setCountdown(RESEND_COOLDOWN) // Safety sync
      }
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to send verification code")
    } finally {
      setOtpSending(false)
    }
  }

  const handleVerifyOtp = async () => {
    setVerifying(true)
    try {
      let targetPhone = phone.trim();
      if (!targetPhone.startsWith('+')) {
        if (targetPhone.startsWith('234')) {
          targetPhone = `+${targetPhone}`;
        } else {
          targetPhone = `+234${targetPhone.replace(/^0/, "")}`;
        }
      }
      
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
    const cleaned = p.replace(/^(\+?234|0)/, "")
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
                        value={phone.replace(/^(\+?234|0)/, "")}
                        onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))}
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

                  <div className="flex items-center justify-between pt-2 w-full">
                    <button 
                      onClick={handleSendOtp}
                      disabled={otpSending || countdown > 0}
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${otpSending ? 'animate-spin' : ''}`} />
                      {countdown > 0 ? `Resend Code in ${formatCountdown(countdown)}` : 'Resend Code'}
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
