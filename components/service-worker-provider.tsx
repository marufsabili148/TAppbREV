"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Service workers work in both production and development
    if ("serviceWorker" in navigator) {
      // Register service worker from /api/sw endpoint
      navigator.serviceWorker
        .register("/api/sw", { scope: "/" })
        .then((registration) => {
          console.log("[SW] Service Worker registered successfully:", registration)
          setSWRegistration(registration)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update().catch((err) => {
              console.log("[SW] Update check failed:", err)
            })
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error("[SW] Service Worker registration failed:", error)
        })
    } else {
      console.log("[SW] Service Worker not supported in this browser")
    }

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // Check if already installed (running as PWA)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for installation
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    // Handle online/offline events for better UX
    const handleOnline = () => {
      console.log("[App] Application is online")
      // Optionally reload to sync new data
      // window.location.reload()
    }

    const handleOffline = () => {
      console.log("[App] Application is offline - using cached data")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", () => {})
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return <>{children}</>
}
