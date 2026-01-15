"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Shield, Bell, Save, RefreshCw, Loader2, DollarSign } from "lucide-react"
import { usePlatformSettings, useUpdatePlatformSettings } from "@/lib/hooks/use-admin"

// Format number with commas as user types
const formatNumberWithCommas = (value: string | number): string => {
  const num = typeof value === "string" ? value.replace(/,/g, "") : String(value)
  if (!num || isNaN(Number(num))) return ""
  return Number(num).toLocaleString("en-NG")
}

// Parse formatted number back to raw number
const parseFormattedNumber = (value: string): number => {
  const parsed = Number(value.replace(/,/g, ""))
  return isNaN(parsed) ? 0 : parsed
}

// Currency input component with live formatting
const CurrencyInput = ({
  label,
  value,
  onChange,
  currency = "₦",
  placeholder = "0",
}: {
  label: string
  value: number
  onChange: (value: number) => void
  currency?: string
  placeholder?: string
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumberWithCommas(value))

  useEffect(() => {
    setDisplayValue(formatNumberWithCommas(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "")
    if (rawValue === "") {
      setDisplayValue("")
      onChange(0)
      return
    }
    const formatted = formatNumberWithCommas(rawValue)
    setDisplayValue(formatted)
    onChange(parseFormattedNumber(rawValue))
  }

  return (
    <div className="p-4 bg-gray-800/50 rounded-xl">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{currency}</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 text-right font-mono"
        />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: settings, isLoading } = usePlatformSettings()
  const updateMutation = useUpdatePlatformSettings()

  const [localSettings, setLocalSettings] = useState({
    autoVerification: false,
    emailNotifications: true,
    bufferAmount: 1, // Now in USD
    platformFee: 1000,
    merchantIncentive: 100,
    minimumPayment: 5000,
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        autoVerification: settings.autoVerification,
        emailNotifications: settings.emailNotifications,
        bufferAmount: settings.bufferAmount,
        platformFee: settings.platformFee,
        merchantIncentive: settings.merchantIncentive,
        minimumPayment: settings.minimumPayment,
      })
    }
  }, [settings])

  const updateField = useCallback((field: string, value: number | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = () => {
    updateMutation.mutate(localSettings, {
      onSuccess: () => {
        toast.success("Settings saved successfully")
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to save settings")
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-gray-400 mt-1">Configure system preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-all font-medium"
        >
          {updateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* System Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">System Settings</h2>
            <p className="text-sm text-gray-400">Configure verification and security options</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div>
              <p className="text-white font-medium">Auto-Verification</p>
              <p className="text-sm text-gray-400">Automatically verify merchants with complete documentation</p>
            </div>
            <button
              onClick={() => updateField("autoVerification", !localSettings.autoVerification)}
              className={`w-12 h-6 rounded-full transition-all ${localSettings.autoVerification ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${localSettings.autoVerification ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            <p className="text-sm text-gray-400">Configure admin notification preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts for new merchants and large transactions</p>
            </div>
            <button
              onClick={() => updateField("emailNotifications", !localSettings.emailNotifications)}
              className={`w-12 h-6 rounded-full transition-all ${localSettings.emailNotifications ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${localSettings.emailNotifications ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Payment Settings</h2>
            <p className="text-sm text-gray-400">Configure fees, rates, and payment limits</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Platform Fee"
            value={localSettings.platformFee}
            onChange={(value) => updateField("platformFee", value)}
            currency="₦"
          />
          <CurrencyInput
            label="Merchant Incentive"
            value={localSettings.merchantIncentive}
            onChange={(value) => updateField("merchantIncentive", value)}
            currency="₦"
          />
          <CurrencyInput
            label="Buffer Amount"
            value={localSettings.bufferAmount}
            onChange={(value) => updateField("bufferAmount", value)}
            currency="$"
          />
          <CurrencyInput
            label="Minimum Payment"
            value={localSettings.minimumPayment}
            onChange={(value) => updateField("minimumPayment", value)}
            currency="₦"
          />
        </div>
      </div>
    </motion.div>
  )
}
