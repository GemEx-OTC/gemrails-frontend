"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  QrCode, 
  History, 
  Settings, 
  HelpCircle, 
  Bell,
  ChevronDown,
  Store,
  Zap,
  Building2,
  Landmark,
  MonitorDot,
  Users,
  ShieldCheck
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useNotification } from "@/context/notification-context"

interface SidebarProps {
  currentPath: string
}

interface MenuItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

interface MenuGroup {
  label: string
  icon: React.ElementType
  items: MenuItem[]
}

// Grouped menu structure for merchants
const menuGroups: MenuGroup[] = [
  {
    label: "Business",
    icon: Store,
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "QR Code", href: "/dashboard/qr-code", icon: QrCode },
      { name: "Transactions", href: "/dashboard/transactions", icon: History },
      { name: "Referrals", href: "/dashboard/referrals", icon: Users },
    ]
  },
]

const generalItems: MenuItem[] = [
  { name: "Verifications", href: "/dashboard/verification", icon: ShieldCheck },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

function SidebarItem({ item, isActive, badge }: { item: MenuItem; isActive: boolean; badge?: number }) {
  const Icon = item.icon
  return (
    <Link href={item.href}>
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
        <span className="flex-1 text-sm">{item.name}</span>
        {badge !== undefined && badge > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-emerald-500 rounded-full">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
        {isActive && (
          <motion.div
            layoutId="merchantActiveIndicator"
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
  defaultOpen = true 
}: { 
  group: MenuGroup
  currentPath: string
  defaultOpen?: boolean 
}) {
  const hasActiveItem = group.items.some(item => 
    item.href === "/dashboard" 
      ? currentPath === "/dashboard"
      : currentPath === item.href || currentPath.startsWith(item.href + "/")
  )
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
              {group.items.map((item) => {
                const isActive = item.href === "/dashboard"
                  ? currentPath === "/dashboard"
                  : currentPath === item.href || currentPath.startsWith(item.href + "/")
                return (
                  <SidebarItem 
                    key={item.href} 
                    item={item} 
                    isActive={isActive}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({ currentPath }: SidebarProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { unreadCount } = useNotification()

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    router.push("/auth/login")
  }

  return (
    <motion.aside
      initial={{ x: 0 }}
      className="hidden md:flex md:flex-col w-64 lg:w-72 bg-[#0a0d10] border-r border-gray-800 h-screen"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logo/logo_icon.png" alt="GemRails" className="w-10 h-10 rounded-xl" />
            <div>
              <span className="text-lg lg:text-xl font-bold text-white">GemRails</span>
              <p className="text-xs text-emerald-400">
                {user?.role === 'admin' ? 'Admin Portal' : 
                 user?.role === 'branch_mod' ? 'Moderator' : 
                 user?.accountType === 'enterprise' ? 'Enterprise Portal' : 'Merchant Portal'}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-4 overflow-y-auto">
          {/* Business Group (For merchants/enterprise admins, maybe hide/adjust for mods) */}
          {user?.role !== 'branch_mod' && menuGroups.map((group) => (
            <CollapsibleGroup 
              key={group.label} 
              group={group} 
              currentPath={currentPath}
              defaultOpen={true}
            />
          ))}

          {/* Enterprise/Branch Menu Group (Conditionally rendered) */}
          {(user?.accountType === 'enterprise' || user?.role === 'branch_mod') && (
            <CollapsibleGroup 
              group={{
                label: user?.role === 'branch_mod' ? "Branch" : "Enterprise",
                icon: user?.role === 'branch_mod' ? Landmark : Building2,
                items: user?.role === 'branch_mod' 
                  ? [
                      { name: "Transactions", href: "/dashboard/transactions", icon: History },
                      { name: "Terminals", href: "/dashboard/enterprise/terminals", icon: MonitorDot },
                      { name: "Branch Info", href: "/dashboard/enterprise/branches", icon: Landmark },
                    ]
                  : [
                      { name: "Branches", href: "/dashboard/enterprise/branches", icon: Landmark },
                      { name: "Terminals", href: "/dashboard/enterprise/terminals", icon: MonitorDot },
                      { name: "Moderators", href: "/dashboard/enterprise/moderators", icon: Users },
                    ]
              }}
              currentPath={currentPath}
              defaultOpen={true}
            />
          )}

          {/* Separator */}
          <div className="border-t border-gray-800 my-4" />

          {/* General Items */}
          <div className="space-y-1">
            {generalItems.map((item) => {
              const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/")
              return (
                <SidebarItem 
                  key={item.href} 
                  item={item} 
                  isActive={isActive}
                  badge={item.name === "Notifications" ? unreadCount : undefined}
                />
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-800 space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.businessName || user?.email}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.merchantId ? `#${user?.merchantId}` : user?.role === 'branch_mod' ? 'Moderator' : user?.accountType}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>

          {/* Version */}
          <div className="text-xs text-gray-600 text-center">
            <p>GemRails v1.0.0</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
