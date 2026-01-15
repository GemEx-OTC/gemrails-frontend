// Notification types and utilities for GemRails Merchant Portal

export type NotificationType =
  | 'PaymentReceived'
  | 'PaymentConfirmed'
  | 'PayoutSuccess'
  | 'PayoutFailed'
  | 'AccountVerified'
  | 'AccountSuspended'
  | 'BankAccountAdded'
  | 'SettlementComplete'
  | 'SystemAlert'

export interface Notification {
  id: string
  merchantId: string
  type: NotificationType
  title: string
  message: string
  channels: {
    inApp: { sent: boolean; readAt?: string }
    email: { sent: boolean; sentAt?: string }
    sms: { sent: boolean; sentAt?: string }
  }
  referenceType?: string
  referenceId?: string
  createdAt: string
}

export const NOTIFICATION_CONFIG: Record<NotificationType, {
  icon: string
  color: string
  bg: string
  category: string
}> = {
  PaymentReceived: {
    icon: '💳',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    category: 'Payments',
  },
  PaymentConfirmed: {
    icon: '✅',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    category: 'Payments',
  },
  PayoutSuccess: {
    icon: '🏦',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    category: 'Payouts',
  },
  PayoutFailed: {
    icon: '⚠️',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    category: 'Payouts',
  },
  AccountVerified: {
    icon: '🛡️',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    category: 'Account',
  },
  AccountSuspended: {
    icon: '🚫',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    category: 'Account',
  },
  BankAccountAdded: {
    icon: '🏛️',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    category: 'Account',
  },
  SettlementComplete: {
    icon: '💰',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    category: 'Settlements',
  },
  SystemAlert: {
    icon: '📢',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    category: 'System',
  },
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
