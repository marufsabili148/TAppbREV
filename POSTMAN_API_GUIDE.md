# API Notification Testing Guide - Postman

## Overview
Panduan lengkap untuk testing Notification API di Postman

---

## 1. CHECK NOTIFICATION SUBSCRIPTION

**Endpoint:** `GET http://localhost:3000/api/notifications/check`

**Query Parameters:**
```
userId: user-123
```

**Full URL:**
```
http://localhost:3000/api/notifications/check?userId=user-123
```

**Expected Response (200):**
```json
{
  "success": true,
  "userId": "user-123",
  "isSubscribed": false,
  "message": "Notification check completed"
}
```

---

## 2. SAVE NOTIFICATION SUBSCRIPTION

**Endpoint:** `POST http://localhost:3000/api/notifications/subscribe`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user-123",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/example-token",
    "keys": {
      "p256dh": "BElmrgVYm_15zXsbXB0W8bh3Eo3J_23OW5iKn7FzD90pV3FYJb8CZiH7xRUstR12tFMrCjL-FjuoYvLxW1vHBik",
      "auth": "TvmzBRWCvXMeE_LPO-PN6Q"
    }
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Subscription saved successfully",
  "data": {
    "userId": "user-123",
    "subscriptionEndpoint": "https://fcm.googleapis.com/fcm/send/example-token"
  }
}
```

---

## 3. SEND NOTIFICATION

**Endpoint:** `POST http://localhost:3000/api/notifications/send`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user-123",
  "title": "Test Notification",
  "message": "Ini adalah notifikasi test dari Postman",
  "data": {
    "type": "test",
    "url": "/competitions/123",
    "category": "competition"
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "userId": "user-123",
    "title": "Test Notification",
    "message": "Ini adalah notifikasi test dari Postman",
    "timestamp": "2025-11-30T10:30:45.123Z"
  }
}
```

---

## Testing Scenarios

### Scenario 1: Check if User Has Notification Subscription
1. Go to tab "CHECK SUBSCRIPTION"
2. Set method: `GET`
3. URL: `http://localhost:3000/api/notifications/check?userId=user-123`
4. Click **Send**

### Scenario 2: Save New Subscription
1. Go to tab "SAVE SUBSCRIPTION"
2. Set method: `POST`
3. URL: `http://localhost:3000/api/notifications/subscribe`
4. Set Headers: `Content-Type: application/json`
5. Copy Request Body from above
6. Click **Send**

### Scenario 3: Send Notification to User
1. Go to tab "SEND NOTIFICATION"
2. Set method: `POST`
3. URL: `http://localhost:3000/api/notifications/send`
4. Set Headers: `Content-Type: application/json`
5. Copy Request Body from above
6. Click **Send**

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing parameters) |
| 500 | Server Error |

---

## Error Responses

**Missing Parameters (400):**
```json
{
  "error": "Missing userId or subscription"
}
```

**Server Error (500):**
```json
{
  "error": "Failed to subscribe"
}
```

---

## Notes
- Ganti `user-123` dengan user ID yang sebenarnya dari aplikasi Anda
- API akan menyimpan data ke database (TODO: implementasi database connection)
- Untuk push notification yang sesungguhnya, Anda perlu setup Firebase Cloud Messaging atau service sejenis lainnya
- VAPID keys diperlukan untuk production push notifications

---

## Environment Variables Setup

Jika ingin menggunakan environment variables di Postman:

```
{{baseUrl}} = http://localhost:3000
{{userId}} = user-123
```

Kemudian gunakan:
```
{{baseUrl}}/api/notifications/check?userId={{userId}}
```
