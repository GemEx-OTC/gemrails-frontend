"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User, LayoutDashboard, QrCode, History, Settings, HelpCircle, Bell } from "lucide-react"

interface SidebarProps {
  currentPath: string
}

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "QR Code", href: "/dashboard/qr-code", icon: QrCode },
  { name: "Transactions", href: "/dashboard/transactions", icon: History },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function Sidebar({ currentPath }: SidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    router.push("/auth/login")
  }

  return (
    <motion.aside
      initial={{ x: 0 }}
      className="hidden md:block w-64 bg-[#0a0d10] border-r border-gray-800 h-screen"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">GemRails</span>
              <p className="text-xs text-emerald-400">Merchant Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-4 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-3 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Demo Restaurant</p>
              <p className="text-xs text-gray-500 truncate">Verified Merchant</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>

          <div className="text-xs text-gray-600 text-center">
            <p>GemRails v1.0.0</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
