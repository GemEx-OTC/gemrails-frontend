"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Shield, 
  Bell, 
  Save, 
  RefreshCw, 
  Loader2, 
  DollarSign, 
  Globe, 
  Wallet, 
  Settings2,
  TrendingUp,
  Zap
} from "lucide-react"
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
  description,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  currency?: string
  placeholder?: string
  description?: string
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumberWithCommas(value))

  useEffect(() => {
    setDisplayValue(formatNumberWithCommas(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "")
    if (rawValue === "") {
      setDisplayValue("")
      onChange(0)
      return
    }
    
    // Handle decimals for rates
    if (rawValue.includes(".")) {
      setDisplayValue(rawValue)
      onChange(Number(rawValue))
      return
    }

    const formatted = formatNumberWithCommas(rawValue)
    setDisplayValue(formatted)
    onChange(parseFormattedNumber(rawValue))
  }

  return (
    <div className="p-5 bg-gray-800/30 border border-gray-800 bg-emerald-500/ rounded-2xl hover:border-emerald-500/30 transition-all group">
      <div className="flex justify-between items-start mb-2">
        <label className="block text-sm font-semibold text-gray-300 group-hover:text-emerald-400 transition-colors">{label}</label>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-emerald-500 transition-colors">{currency}</span>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-right font-mono text-lg transition-all"
        />
      </div>
      {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
    </div>
  )
}

const TabButton = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  description 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: any, 
  label: string,
  description: string
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
      active 
        ? "bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
        : "hover:bg-gray-800/50 border border-transparent"
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
      active ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400 group-hover:text-gray-200"
    }`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <p className={`font-bold transition-colors ${active ? "text-emerald-400" : "text-gray-400 group-hover:text-gray-200"}`}>
        {label}
      </p>
      <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
    </div>
  </button>
)

export default function SettingsPage() {
  const { data: settings, isLoading } = usePlatformSettings()
  const updateMutation = useUpdatePlatformSettings()
  const [activeTab, setActiveTab] = useState<"general" | "economics" | "network">("general")

  const [localSettings, setLocalSettings] = useState({
    autoVerification: false,
    emailNotifications: true,
    bufferAmount: 1,
    platformFee: 1000,
    merchantIncentive: 100,
    minimumPayment: 5000,
    usdtNgnRate: 1560,
    usdcNgnRate: 1560,
    revenueWalletAddress: "",
    revenueWalletAddressTron: "",
    badFundsWalletAddressBsc: "",
    badFundsWalletAddressTron: "",
    overflowWalletAddressBsc: "",
    overflowWalletAddressTron: "",
    sweepThresholdUsd: 20,
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
        usdtNgnRate: settings.usdtNgnRate || 1560,
        usdcNgnRate: settings.usdcNgnRate || 1560,
        revenueWalletAddress: settings.revenueWalletAddress || "",
        revenueWalletAddressTron: settings.revenueWalletAddressTron || "",
        badFundsWalletAddressBsc: settings.badFundsWalletAddressBsc || "",
        badFundsWalletAddressTron: settings.badFundsWalletAddressTron || "",
        overflowWalletAddressBsc: settings.overflowWalletAddressBsc || "",
        overflowWalletAddressTron: settings.overflowWalletAddressTron || "",
        sweepThresholdUsd: settings.sweepThresholdUsd || 20,
      })
    }
  }, [settings])

  const updateField = useCallback((field: string, value: number | boolean | string) => {
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
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500/50" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Configuration</h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-emerald-500" />
            Global system preferences and economic parameters
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:bg-emerald-500/50 text-white rounded-2xl transition-all font-bold shadow-lg shadow-emerald-500/20"
        >
          {updateMutation.isPending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {updateMutation.isPending ? "Syncing..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3 bg-gray-900/20 p-3 rounded-3xl border border-gray-800/50">
          <TabButton 
            active={activeTab === "general"} 
            onClick={() => setActiveTab("general")} 
            icon={Shield} 
            label="General" 
            description="Verification and system alerts"
          />
          <TabButton 
            active={activeTab === "economics"} 
            onClick={() => setActiveTab("economics")} 
            icon={TrendingUp} 
            label="Economics" 
            description="Fee structures and exchange rates"
          />
          <TabButton 
            active={activeTab === "network"} 
            onClick={() => setActiveTab("network")} 
            icon={Globe} 
            label="Network & Wallets" 
            description="Blockchain targets and sweep rules"
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* System Settings */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">System Controls</h2>
                      <p className="text-sm text-gray-400">Manage automated system behaviors</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-800/30 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
                      <div>
                        <p className="text-white font-bold text-lg">Auto-Verification</p>
                        <p className="text-sm text-gray-400 max-w-sm">Automatically approve merchants who provide valid documentation during onboarding.</p>
                      </div>
                      <button
                        onClick={() => updateField("autoVerification", !localSettings.autoVerification)}
                        className={`w-14 h-8 rounded-full transition-all relative ${localSettings.autoVerification ? "bg-emerald-500" : "bg-gray-700"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform absolute top-1 ${localSettings.autoVerification ? "left-7" : "left-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Bell className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Alert Preferences</h2>
                      <p className="text-sm text-gray-400">Configure where admin notifications are sent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-800/30 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
                      <div>
                        <p className="text-white font-bold text-lg">Email Dispatch</p>
                        <p className="text-sm text-gray-400 max-w-sm">Send real-time alerts for system events and high-volume transactions.</p>
                      </div>
                      <button
                        onClick={() => updateField("emailNotifications", !localSettings.emailNotifications)}
                        className={`w-14 h-8 rounded-full transition-all relative ${localSettings.emailNotifications ? "bg-emerald-500" : "bg-gray-700"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform absolute top-1 ${localSettings.emailNotifications ? "left-7" : "left-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "economics" && (
              <motion.div
                key="economics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Platform Rates */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <RefreshCw className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Exchange Rates</h2>
                      <p className="text-sm text-gray-400">Platform conversion rates (₦ per 1 Token)</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CurrencyInput
                      label="USDT / NGN Rate"
                      value={localSettings.usdtNgnRate}
                      onChange={(value) => updateField("usdtNgnRate", value)}
                      currency="₦"
                      description="Used for USDT (BSC & Tron) settlements"
                    />
                    <CurrencyInput
                      label="USDC / NGN Rate"
                      value={localSettings.usdcNgnRate}
                      onChange={(value) => updateField("usdcNgnRate", value)}
                      currency="₦"
                      description="Used for USDC (BSC) settlements"
                    />
                  </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <DollarSign className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Fee Structure & Limits</h2>
                      <p className="text-sm text-gray-400">Operational costs and transaction boundaries</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CurrencyInput
                      label="Platform Service Fee"
                      value={localSettings.platformFee}
                      onChange={(value) => updateField("platformFee", value)}
                      currency="₦"
                    />
                    <CurrencyInput
                      label="Merchant Cashback"
                      value={localSettings.merchantIncentive}
                      onChange={(value) => updateField("merchantIncentive", value)}
                      currency="₦"
                    />
                    <CurrencyInput
                      label="Volatility Buffer"
                      value={localSettings.bufferAmount}
                      onChange={(value) => updateField("bufferAmount", value)}
                      currency="$"
                      description="Safety margin added to crypto requests"
                    />
                    <CurrencyInput
                      label="Minimum Settlement"
                      value={localSettings.minimumPayment}
                      onChange={(value) => updateField("minimumPayment", value)}
                      currency="₦"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "network" && (
              <motion.div
                key="network"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Sweep Configuration */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <RefreshCw className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Liquidity Sweep</h2>
                      <p className="text-sm text-gray-400">Rules for pulling funds from transient wallets</p>
                    </div>
                  </div>
                  
                  <div className="max-w-md">
                    <CurrencyInput
                      label="Sweep Threshold"
                      value={localSettings.sweepThresholdUsd}
                      onChange={(value) => updateField("sweepThresholdUsd", value)}
                      currency="$"
                      description="Minimum balance in USD before trigger"
                    />
                  </div>
                </div>

                {/* Wallets */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                      <Wallet className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Wallet Infrastructure</h2>
                      <p className="text-sm text-gray-400">On-chain target addresses for all flows</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* BSC */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">BNB Smart Chain (BEP20)</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Revenue Hub (BSC)</label>
                          <input
                            type="text"
                            value={localSettings.revenueWalletAddress}
                            onChange={(e) => updateField("revenueWalletAddress", e.target.value)}
                            placeholder="0x..."
                            className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Bad Funds (BSC)</label>
                            <input
                              type="text"
                              value={localSettings.badFundsWalletAddressBsc}
                              onChange={(e) => updateField("badFundsWalletAddressBsc", e.target.value)}
                              placeholder="0x..."
                              className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                            />
                          </div>
                          <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Overflow (BSC)</label>
                            <input
                              type="text"
                              value={localSettings.overflowWalletAddressBsc}
                              onChange={(e) => updateField("overflowWalletAddressBsc", e.target.value)}
                              placeholder="0x..."
                              className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tron */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Tron Network (TRC20)</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Revenue Hub (Tron)</label>
                          <input
                            type="text"
                            value={localSettings.revenueWalletAddressTron}
                            onChange={(e) => updateField("revenueWalletAddressTron", e.target.value)}
                            placeholder="T..."
                            className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Bad Funds (Tron)</label>
                            <input
                              type="text"
                              value={localSettings.badFundsWalletAddressTron}
                              onChange={(e) => updateField("badFundsWalletAddressTron", e.target.value)}
                              placeholder="T..."
                              className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                            />
                          </div>
                          <div className="p-5 bg-gray-800/30 border border-gray-800 rounded-2xl space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Overflow (Tron)</label>
                            <input
                              type="text"
                              value={localSettings.overflowWalletAddressTron}
                              onChange={(e) => updateField("overflowWalletAddressTron", e.target.value)}
                              placeholder="T..."
                              className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
