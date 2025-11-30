# 🚀 API Testing Cheat Sheet

## Copy-Paste Ready Commands for Postman

---

## Test 1: Check Subscription Status

**Endpoint Type:** GET  
**URL:**
```
http://localhost:3000/api/notifications/check?userId=user-123
```

**Expected Response:**
```json
{
  "success": true,
  "userId": "user-123",
  "isSubscribed": false,
  "message": "Notification check completed"
}
```

---

## Test 2: Send Notification

**Endpoint Type:** POST  
**URL:**
```
http://localhost:3000/api/notifications/send
```

**Headers:**
```
Content-Type: application/json
```

**Body (Copy & Paste):**
```json
{
  "userId": "user-123",
  "title": "Test Notification",
  "message": "This is a test notification from Postman!",
  "data": {
    "type": "test",
    "url": "/competitions/123",
    "category": "competition"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "userId": "user-123",
    "title": "Test Notification",
    "message": "This is a test notification from Postman!",
    "timestamp": "2025-11-30T10:30:45.123Z"
  }
}
```

---

## Test 3: Save Subscription

**Endpoint Type:** POST  
**URL:**
```
http://localhost:3000/api/notifications/subscribe
```

**Headers:**
```
Content-Type: application/json
```

**Body (Copy & Paste):**
```json
{
  "userId": "user-123",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/example-token-here",
    "keys": {
      "p256dh": "BElmrgVYm_15zXsbXB0W8bh3Eo3J_23OW5iKn7FzD90pV3FYJb8CZiH7xRUstR12tFMrCjL-FjuoYvLxW1vHBik",
      "auth": "TvmzBRWCvXMeE_LPO-PN6Q"
    }
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Subscription saved successfully",
  "data": {
    "userId": "user-123",
    "subscriptionEndpoint": "https://fcm.googleapis.com/fcm/send/example-token-here"
  }
}
```

---

## Postman Environment Variables

**Create Variable:** Click Settings ⚙️ → Environments → Create  

**Add These Variables:**
```
Variable Name: baseUrl
Value: http://localhost:3000

Variable Name: userId
Value: user-123
```

**Use in Requests:**
```
{{baseUrl}}/api/notifications/check?userId={{userId}}
```

---

## URL Patterns (Quick Reference)

| Test | Method | URL |
|------|--------|-----|
| Check | GET | `/api/notifications/check?userId=X` |
| Send | POST | `/api/notifications/send` |
| Save | POST | `/api/notifications/subscribe` |

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | All working ✅ |
| 400 | Bad Request | Missing userId or data |
| 500 | Server Error | Internal error |

---

## Common Changes to Make

### Change User ID
Find: `"user-123"`  
Replace: Your actual user ID

### Change Notification Title
Find: `"title": "Test Notification"`  
Replace: `"title": "Your Title"`

### Change Notification Message
Find: `"message": "This is a test notification from Postman!"`  
Replace: `"message": "Your message"`

### Add Custom Data
```json
"data": {
  "type": "competition",
  "competitionId": "comp-456",
  "category": "hackathon",
  "customField": "custom-value"
}
```

---

## Step-by-Step Postman Testing

### Step 1: Open Postman
- Launch Postman application
- Create new tab (Ctrl + T / Cmd + T)

### Step 2: Test Check Endpoint
1. Set Method: **GET**
2. Paste URL: `http://localhost:3000/api/notifications/check?userId=user-123`
3. Click **Send**
4. Look for response with `"success": true`

### Step 3: Test Send Endpoint
1. Create new tab (Ctrl + T)
2. Set Method: **POST**
3. Paste URL: `http://localhost:3000/api/notifications/send`
4. Go to **Headers** tab → Add `Content-Type: application/json`
5. Go to **Body** tab → Select **Raw** → **JSON**
6. Paste request body from "Test 2" section above
7. Click **Send**
8. Look for `"success": true` in response

### Step 4: Test Subscribe Endpoint
1. Create new tab (Ctrl + T)
2. Set Method: **POST**
3. Paste URL: `http://localhost:3000/api/notifications/subscribe`
4. Go to **Headers** tab → Add `Content-Type: application/json`
5. Go to **Body** tab → Select **Raw** → **JSON**
6. Paste request body from "Test 3" section above
7. Click **Send**
8. Look for `"success": true` in response

---

## Postman Collection Import

1. In Postman: Click **Import** button (top left)
2. Select **Upload Files**
3. Choose: `postman_collection.json` from your project
4. Collection imported automatically!
5. All 3 endpoints pre-configured
6. Click each endpoint → Click **Send**

---

## Troubleshooting

### "Cannot GET /api/notifications/check"
- Make sure `npm run dev` is running
- Check URL matches exactly: `http://localhost:3000/api/notifications/check?userId=...`

### No response after clicking Send
- Check network tab in Postman
- Make sure dev server is running on port 3000
- Try `http://localhost:3000` in browser first

### Response shows error
- Check request body JSON is valid (use JSON formatter)
- Ensure all required fields are present
- Check userId is not empty

### "Content-Type: application/json" not working
- Make sure you're using **POST** (not GET)
- Add header correctly in Headers tab
- Try checking "Auto" in Postman headers

---

## Quick Test Sequence

```
1. npm run dev                          ← Start server
2. Open Postman
3. GET /api/notifications/check         ← Should work
4. POST /api/notifications/send         ← Should work
5. POST /api/notifications/subscribe    ← Should work
6. All responses show "success": true   ← ✅ Success!
```

---

## File Locations

```
GET        app/api/notifications/check/route.ts
POST send  app/api/notifications/send/route.ts
POST sub   app/api/notifications/subscribe/route.ts
```

---

**You're all set! Copy commands above and test in Postman 🎉**
