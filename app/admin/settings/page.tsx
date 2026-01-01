"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Bell, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    autoVerification: false,
    emailNotifications: true,
    slackNotifications: false,
  })

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
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
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-all font-medium"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Changes"}
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
              onClick={() => setSettings({ ...settings, autoVerification: !settings.autoVerification })}
              className={`w-12 h-6 rounded-full transition-all ${settings.autoVerification ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoVerification ? "translate-x-6" : "translate-x-0.5"}`} />
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
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`w-12 h-6 rounded-full transition-all ${settings.emailNotifications ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.emailNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div>
              <p className="text-white font-medium">Slack Notifications</p>
              <p className="text-sm text-gray-400">Send alerts to Slack channel</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, slackNotifications: !settings.slackNotifications })}
              className={`w-12 h-6 rounded-full transition-all ${settings.slackNotifications ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.slackNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
