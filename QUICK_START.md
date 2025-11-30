# Quick Start Guide - Testing Notification API

## What Was Fixed

Your app had an error: **"An unknown Component is an async Client Component"** in `NotificationManager`.

**Solution:** I've refactored the notification system to use:
1. ✅ Proper async/await patterns in useEffect hooks
2. ✅ RESTful API endpoints for notification management
3. ✅ Full Postman testing support

---

## 🚀 Quick Test (5 minutes)

### Step 1: Start Your Dev Server
```powershell
npm run dev
# or
pnpm dev
```

Server should be running at `http://localhost:3000`

### Step 2: Open Postman

### Step 3: Test Endpoint #1 - Check Subscription
```
GET http://localhost:3000/api/notifications/check?userId=user-123
```

Click **Send** → You should get:
```json
{
  "success": true,
  "userId": "user-123",
  "isSubscribed": false,
  "message": "Notification check completed"
}
```

### Step 4: Test Endpoint #2 - Send Notification
```
POST http://localhost:3000/api/notifications/send
```

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "userId": "user-123",
  "title": "Hello World",
  "message": "Test notification from Postman!",
  "data": {
    "type": "test"
  }
}
```

Click **Send** → You should get:
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "userId": "user-123",
    "title": "Hello World",
    "message": "Test notification from Postman!",
    "timestamp": "2025-11-30T10:30:45.123Z"
  }
}
```

### Step 5: Test Endpoint #3 - Save Subscription
```
POST http://localhost:3000/api/notifications/subscribe
```

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "userId": "user-123",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/example",
    "keys": {
      "p256dh": "BElmrgVYm_15zXsbXB0W8bh3Eo3J_23OW5iKn7FzD90pV3FYJb8CZiH7xRUstR12tFMrCjL-FjuoYvLxW1vHBik",
      "auth": "TvmzBRWCvXMeE_LPO-PN6Q"
    }
  }
}
```

Click **Send** → Success response

---

## 📦 Import Full Collection to Postman

1. In Postman, click **Import**
2. Select **Upload Files**
3. Choose: `postman_collection.json` (from your project root)
4. All 3 endpoints pre-configured and ready!

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `app/api/notifications/check/route.ts` | Check subscription status |
| `app/api/notifications/send/route.ts` | Send notification |
| `app/api/notifications/subscribe/route.ts` | Save subscription |
| `lib/notification-utils.ts` | Reusable API utilities |
| `postman_collection.json` | Postman collection (import this!) |
| `POSTMAN_API_GUIDE.md` | Detailed documentation |

---

## 🔧 API Endpoints Summary

### 1. Check Notification Subscription
- **Method:** GET
- **URL:** `/api/notifications/check?userId=USER_ID`
- **Response:** `{ success, userId, isSubscribed, message }`

### 2. Send Notification
- **Method:** POST
- **URL:** `/api/notifications/send`
- **Body:** `{ userId, title, message, data? }`
- **Response:** `{ success, message, data }`

### 3. Save Subscription
- **Method:** POST
- **URL:** `/api/notifications/subscribe`
- **Body:** `{ userId, subscription }`
- **Response:** `{ success, message, data }`

---

## ✅ Verification Checklist

- [x] App builds without errors
- [x] No more "async Client Component" error
- [x] API endpoints functional
- [x] Can test all 3 endpoints in Postman
- [x] Proper error handling
- [x] Type-safe utilities created

---

## 🎯 Next Steps (Optional)

To make notifications fully functional:

1. **Connect Database** - Store subscriptions in your DB
   ```ts
   // In app/api/notifications/subscribe/route.ts
   await saveToDatabase(userId, subscription)
   ```

2. **Setup Firebase Cloud Messaging (FCM)**
   - Get API key from Firebase Console
   - Use it to send real push notifications

3. **Add VAPID Keys for Production**
   - Generate VAPID keys
   - Configure in environment variables

4. **Create Notification Service**
   - Handle notification delivery
   - Track delivery status

---

## 🐛 Troubleshooting

**Q: Error when calling API?**
A: Make sure `npm run dev` is running and server is on `http://localhost:3000`

**Q: Postman showing 404?**
A: Check the URL - should start with `http://localhost:3000/api/notifications/...`

**Q: Still seeing async error?**
A: Try `npm run build` to verify - should see ✅ Compiled successfully

**Q: Need to change userId?**
A: In Postman, update the `{{userId}}` variable in collection settings

---

## 📞 Support

- 📖 See `POSTMAN_API_GUIDE.md` for detailed documentation
- 📋 See `FIX_SUMMARY.md` for technical details
- 🔍 Check browser console for debug logs

Happy testing! 🎉
