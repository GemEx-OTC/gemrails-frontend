"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useUnreadCount } from "@/lib/hooks/use-notifications"

interface NotificationContextType {
  unreadCount: number
  fetchUnreadCount: () => void
  setUnreadCount: (count: number) => void
  decrementUnreadCount: (amount?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCountState] = useState(0)
  const { user } = useAuth()
  const { data, refetch } = useUnreadCount()

  useEffect(() => {
    if (data && typeof data.unreadCount === "number") {
      setUnreadCountState(data.unreadCount)
    }
  }, [data])

  const fetchUnreadCount = () => {
    if (user) {
      refetch()
    }
  }

  const setUnreadCount = (count: number) => {
    setUnreadCountState(Math.max(0, count))
  }

  const decrementUnreadCount = (amount = 1) => {
    setUnreadCountState((prev) => Math.max(0, prev - amount))
  }

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchUnreadCount, setUnreadCount, decrementUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
