/**
 * Notification API Utilities
 * Functions to interact with notification endpoints
 */

export interface NotificationSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export async function checkNotificationSubscription(userId: string | null) {
  if (!userId) return false

  try {
    const response = await fetch(`/api/notifications/check?userId=${encodeURIComponent(userId)}`)
    const data = await response.json()
    return data.isSubscribed ?? false
  } catch (error) {
    console.error("[Notification Utils] Check subscription error:", error)
    return false
  }
}

export async function saveNotificationSubscription(userId: string, subscription: NotificationSubscription) {
  try {
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || "Failed to save subscription")
    }

    return { success: true, data }
  } catch (error) {
    console.error("[Notification Utils] Save subscription error:", error)
    return { success: false, error }
  }
}

export async function sendNotification(
  userId: string,
  title: string,
  message: string,
  data?: Record<string, string>
) {
  try {
    const response = await fetch("/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, message, data }),
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || "Failed to send notification")
    }

    return { success: true, data: responseData }
  } catch (error) {
    console.error("[Notification Utils] Send notification error:", error)
    return { success: false, error }
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return { success: false, error: "Browser tidak mendukung notifikasi" }
  }

  if (Notification.permission === "granted") {
    return { success: true, message: "Notifikasi sudah diaktifkan" }
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        return { success: true, message: "Notifikasi berhasil diaktifkan" }
      } else {
        return { success: false, error: "Permisi notifikasi ditolak" }
      }
    } catch (error) {
      console.error("[Notification Utils] Permission request error:", error)
      return { success: false, error: "Gagal meminta izin notifikasi" }
    }
  }

  return { success: false, error: "Notifikasi sudah ditolak sebelumnya" }
}
