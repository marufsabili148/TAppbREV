import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subscription } = body

    if (!userId || !subscription) {
      return NextResponse.json({ error: "Missing userId or subscription" }, { status: 400 })
    }

    // TODO: Simpan subscription ke database
    // Contoh: await saveSubscriptionToDatabase(userId, subscription)

    console.log(`[Notification API] Subscription saved for user ${userId}`)

    return NextResponse.json(
      {
        success: true,
        message: "Subscription saved successfully",
        data: { userId, subscriptionEndpoint: subscription.endpoint },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Notification API] Error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

/**
 * GET /api/notifications/subscribe
 * Untuk test di Postman, gunakan method POST dengan body:
 * {
 *   "userId": "user-123",
 *   "subscription": {
 *     "endpoint": "https://fcm.googleapis.com/fcm/send/xxx",
 *     "keys": {
 *       "p256dh": "xxx",
 *       "auth": "xxx"
 *     }
 *   }
 * }
 */
