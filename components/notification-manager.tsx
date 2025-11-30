"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { checkNotificationSubscription, requestNotificationPermission, saveNotificationSubscription } from "@/lib/notification-utils"

export function NotificationManager() {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)

  useEffect(() => {
    if (!user) return

    // Check notification permission and subscription
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("[NotificationManager] Service Worker or PushManager not supported")
      return
    }

    const initializeNotifications = async () => {
      try {
        const isSubscribed = await checkNotificationSubscription(user.id)
        setIsSubscribed(isSubscribed)

        // If not subscribed and permission granted, request to subscribe
        if (!isSubscribed && Notification.permission === "granted") {
          const result = await requestNotificationPermission()
          if (result.success) {
            setIsCheckingPermission(true)
          }
        }
      } catch (error) {
        console.error("[NotificationManager] Initialization error:", error)
      }
    }

    initializeNotifications()
  }, [user])

  const handleRequestPermission = async () => {
    if (!user) {
      console.warn("[NotificationManager] User not authenticated")
      return
    }

    try {
      setIsCheckingPermission(true)
      const result = await requestNotificationPermission()

      if (result.success) {
        // Try to subscribe via API
        if ("serviceWorker" in navigator && "PushManager" in window) {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.getSubscription()

          if (subscription) {
            const subscriptionData = subscription.toJSON() as {
              endpoint: string
              keys: { p256dh: string; auth: string }
            }
            const saveResult = await saveNotificationSubscription(user.id, subscriptionData)

            if (saveResult.success) {
              setIsSubscribed(true)
            }
          }
        }
      }
    } catch (error) {
      console.error("[NotificationManager] Permission request error:", error)
    } finally {
      setIsCheckingPermission(false)
    }
  }

  // Automatically request permission on mount if user exists
  useEffect(() => {
    if (user && !isSubscribed && !isCheckingPermission && Notification.permission === "default") {
      handleRequestPermission()
    }
  }, [user, isSubscribed, isCheckingPermission])

  return (
    <div className="hidden">
      {/* Notification manager runs in background - no UI needed */}
    </div>
  )
}
