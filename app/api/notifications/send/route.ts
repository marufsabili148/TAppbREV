import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, data } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: userId, title, message" },
        { status: 400 }
      )
    }

    // TODO: Implementasi pengiriman notifikasi actual
    // Misalnya menggunakan Firebase Cloud Messaging, OneSignal, dll
    // const result = await sendPushNotification(userId, { title, message, data })

    console.log(`[Notification Send API] Notification sent to user ${userId}:`, {
      title,
      message,
      data,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent successfully",
        data: {
          userId,
          title,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Notification Send API] Error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}

/**
 * POST /api/notifications/send
 * Test di Postman dengan body:
 * {
 *   "userId": "user-123",
 *   "title": "Test Notification",
 *   "message": "This is a test notification",
 *   "data": {
 *     "type": "test",
 *     "url": "/competitions/123"
 *   }
 * }
 */
