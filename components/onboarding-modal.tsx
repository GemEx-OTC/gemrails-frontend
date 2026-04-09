"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Phone, User, Briefcase, MapPin, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { useUpdateProfile } from "@/lib/hooks/use-auth"

export function OnboardingModal() {
  const { user } = useAuth()
  const updateProfileMutation = useUpdateProfile()
  const [isOpen, setIsOpen] = useState(false)
  
  // States for additional information
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [rcNumber, setRcNumber] = useState("")

  useEffect(() => {
    // Show modal if user is logged in but missing essential profile info
    // Exempt admins and branch moderators from this flow
    if (user && user.role !== 'admin' && user.role !== 'branch_mod' && (!user.contactName || !user.phone)) {
      setIsOpen(true)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactName || !phone) {
      toast.error("Please fill in all required fields to proceed")
      return
    }

    updateProfileMutation.mutate(
      {
        contactName,
        phone
      },
      {
        onSuccess: () => {
          toast.success("Profile updated! Welcome to Gemrails.")
          setIsOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update profile")
        }
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-emerald-500/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0d1116] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative p-8 md:p-10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Building2 className="w-32 h-32 text-emerald-500" />
          </div>

          <div className="relative space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Account Created</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-outfit">Complete your profile</h2>
              <p className="text-gray-400 leading-relaxed">
                Welcome to Gemrails! Please provide a few more details to fully activate your {user?.accountType || 'business'} account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Contact Person</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>
              </div>


              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group transition-all"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
