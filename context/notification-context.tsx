"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"

interface NotificationContextType {
    unreadCount: number
    fetchUnreadCount: () => Promise<void>
    setUnreadCount: (count: number) => void
    decrementUnreadCount: (amount?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCountState] = useState(0)
    const { user } = useAuth()

    const fetchUnreadCount = async () => {
        if (!user) return
        try {
            const { data } = await apiClient.getUnreadNotificationCount()
            if (data && typeof data.unreadCount === "number") {
                setUnreadCountState(data.unreadCount)
            }
        } catch (error) {
            console.error("Failed to fetch unread notifications", error)
        }
    }

    const setUnreadCount = (count: number) => {
        setUnreadCountState(Math.max(0, count))
    }

    const decrementUnreadCount = (amount = 1) => {
        setUnreadCountState((prev) => Math.max(0, prev - amount))
    }

    useEffect(() => {
        if (user) {
            fetchUnreadCount()
            const interval = setInterval(fetchUnreadCount, 15000)
            return () => clearInterval(interval)
        }
    }, [user])

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
