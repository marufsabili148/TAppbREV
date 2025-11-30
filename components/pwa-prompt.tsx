"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem("pwa-prompt-dismissed")) {
      setIsDismissed(true)
      return
    }

    // Detect Android
    const isAndroidDevice = /Android/.test(navigator.userAgent)
    setIsAndroid(isAndroidDevice)

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Auto-show prompt for Android users on mobile
      if (isAndroidDevice && isMobile) {
        // Delay to avoid interrupting page load
        setTimeout(() => {
          setIsDismissed(false)
        }, 3000)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Handle app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [isMobile])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstalled(true)
        setDeferredPrompt(null)
        sessionStorage.removeItem("pwa-prompt-dismissed")
      } else {
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error("Error during install prompt:", error)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Show prompt only on Android mobile if not dismissed and not installed
  if (isInstalled || isDismissed || !deferredPrompt || !isAndroid || !isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:bottom-6 md:right-6 md:left-auto md:max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <Card className="bg-gradient-to-br from-primary/95 to-primary border-primary shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Smartphone className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
              <div>
                <CardTitle className="text-base text-primary-foreground">
                  Instal LombaKu
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-xs">
                  Akses lebih cepat tanpa buka browser
                </CardDescription>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-xs text-primary-foreground/90 mb-4">
            Instal aplikasi untuk pengalaman yang lebih baik dan akses offline
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="flex-1 bg-white text-primary hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Instal
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-white/10"
            >
              Nanti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
