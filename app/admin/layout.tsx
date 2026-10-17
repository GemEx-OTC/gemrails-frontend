"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import {
  LayoutDashboard,
  Store,
  Receipt,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronDown,
  Activity,
  Droplets,
  Users,
  Zap
} from "lucide-react"

interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
}

interface MenuGroup {
  label: string
  icon: React.ElementType
  items: MenuItem[]
}

// Grouped admin navigation
const adminMenuGroups: MenuGroup[] = [
  {
    label: "Overview",
    icon: Activity,
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/liquidity", label: "Liquidity", icon: Droplets },
      { href: "/admin/sweep", label: "Sweep Funds", icon: Zap },
      { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    ]
  },
  {
    label: "Management",
    icon: Users,
    items: [
      { href: "/admin/merchants", label: "Merchants", icon: Store },
    ]
  },
  {
    label: "Compliance",
    icon: Shield,
    items: [
      { href: "/admin/audit", label: "Audit Logs", icon: FileText },
    ]
  },
]

const adminGeneralItems: MenuItem[] = [
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function SidebarItem({ item, isActive, onClick }: { item: MenuItem; isActive: boolean; onClick?: () => void }) {
  const Icon = item.icon
  return (
    <Link href={item.href} onClick={onClick}>
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
        <span className="text-sm">{item.label}</span>
        {isActive && (
          <motion.div
            layoutId="adminActiveIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r"
          />
        )}
      </motion.div>
    </Link>
  )
}

function CollapsibleGroup({ 
  group, 
  currentPath, 
  defaultOpen = true,
  onItemClick
}: { 
  group: MenuGroup
  currentPath: string
  defaultOpen?: boolean
  onItemClick?: () => void
}) {
  const hasActiveItem = group.items.some(item => currentPath === item.href || currentPath.startsWith(item.href + "/"))
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveItem)
  const GroupIcon = group.icon

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GroupIcon className="w-4 h-4" />
          <span>{group.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  item={item} 
                  isActive={currentPath === item.href || currentPath.startsWith(item.href + "/")}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/admin/login")
      } else if (user.role !== "admin") {
        router.push("/auth/admin/login")
      }
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout("/auth/admin/login")
  }

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0d10]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0d10] print:block print:min-h-0 print:h-auto print:bg-transparent">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 print:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo/logo_icon.png" alt="GemRails" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-white">GemRails Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-2 text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/60 print:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#0a0d10] border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 print:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <img src="/logo/logo_icon.png" alt="GemRails" className="w-10 h-10 rounded-xl" />
              <div>
                <span className="font-bold text-white text-lg">GemRails</span>
                <p className="text-xs text-emerald-400">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Grouped Menu */}
            {adminMenuGroups.map((group) => (
              <CollapsibleGroup 
                key={group.label} 
                group={group} 
                currentPath={pathname}
                defaultOpen={true}
                onItemClick={() => setSidebarOpen(false)}
              />
            ))}

            {/* Separator */}
            <div className="border-t border-gray-800 my-4" />

            {/* General Items */}
            <div className="space-y-1">
              {adminGeneralItems.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 space-y-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
            <p className="text-xs text-gray-600 text-center">GemRails Admin v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen print:ml-0 print:pt-0 print:min-h-0 print:overflow-visible">
        <div className="p-4 lg:p-8 print:p-0">{children}</div>
      </main>
    </div>
  )
}
