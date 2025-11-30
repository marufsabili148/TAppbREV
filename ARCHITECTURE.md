# Notification System Architecture

## Before (❌ Error)
```
layout.tsx (Server Component)
  └─ NotificationManager (Client Component)
     └─ useAuth() [async]
        └─ Direct render-time async call
           ❌ ERROR: "async Client Component"
```

## After (✅ Fixed)
```
layout.tsx (Server Component)
  └─ NotificationManager (Client Component)
     ├─ useAuth() [hook]
     └─ useEffect() [proper async handling]
        ├─ checkNotificationSubscription()
        ├─ requestNotificationPermission()
        └─ saveNotificationSubscription()
           ✅ All async operations in effects
```

---

## API Architecture

```
┌─────────────────────────────────────────────┐
│         Notification Manager                │
│      (Client Component - React)             │
└────────┬────────────────────────────────────┘
         │
         │ fetch()
         ▼
┌─────────────────────────────────────────────┐
│      Notification Utilities                 │
│    (lib/notification-utils.ts)              │
│  - checkNotificationSubscription()          │
│  - saveNotificationSubscription()           │
│  - sendNotification()                       │
│  - requestNotificationPermission()          │
└────────┬────────────────────────────────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────────────────────────────────┐
│       API Routes (Next.js)                  │
├─────────────────────────────────────────────┤
│ GET  /api/notifications/check               │
│ POST /api/notifications/subscribe           │
│ POST /api/notifications/send                │
└────────┬────────────────────────────────────┘
         │
         │ Future: Database & External Services
         ▼
┌─────────────────────────────────────────────┐
│   Database & Push Services                  │
│  - Supabase (for subscriptions)             │
│  - Firebase FCM (for push)                  │
│  - OneSignal (alternative)                  │
└─────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Flow 1: Check Subscription
```
Frontend                  Backend
   │                        │
   │  GET /check?userId=123 │
   ├──────────────────────→ │
   │                        │ Query database
   │                        │
   │  { isSubscribed: false}│
   │ ←──────────────────────┤
   │                        │
```

### Flow 2: Send Notification
```
Frontend                  Backend               External
   │                        │                    │
   │ POST /send             │                    │
   │ {userId, title, msg}   │                    │
   ├──────────────────────→ │                    │
   │                        │  (TODO: Forward to │
   │                        │  FCM/OneSignal)    │
   │                        │───────────────────→│
   │                        │                    │
   │  { success: true }     │                    │
   │ ←──────────────────────┤                    │
   │                        │                    │
```

### Flow 3: Save Subscription
```
Frontend                  Backend
   │                        │
   │ POST /subscribe        │
   │ {userId, subscription} │
   ├──────────────────────→ │
   │                        │ Save to database
   │                        │
   │  { success: true }     │
   │ ←──────────────────────┤
   │                        │
```

---

## Component Communication

```
useAuth() hook
    ↓
    ├─ User authenticated?
    ├─ Get userId from context
    │
    ↓
NotificationManager useEffect
    ├─ Browser supports notifications?
    ├─ Call checkNotificationSubscription(userId)
    │    ↓
    │    └─ GET /api/notifications/check?userId=X
    │
    ├─ Permission granted?
    ├─ If not, requestNotificationPermission()
    │
    └─ Save subscription
         ↓
         └─ POST /api/notifications/subscribe
```

---

## Data Models

### Subscription Object
```typescript
interface NotificationSubscription {
  endpoint: string        // Push service endpoint
  keys: {
    p256dh: string       // Encryption key
    auth: string         // Authentication secret
  }
}
```

### Send Notification Payload
```typescript
{
  userId: string                    // Target user
  title: string                     // Notification title
  message: string                   // Notification message
  data?: Record<string, string>     // Additional data
}
```

### API Response
```typescript
{
  success: boolean        // Operation success
  message: string        // Status message
  data?: any            // Response data
  error?: string        // Error message if failed
}
```

---

## Error Handling

```
User Action
    ↓
    ├─ Browser support check → No? Return error
    ├─ Permission check → Denied? Return error
    ├─ API call → Network error? Return error with retry
    ├─ API response → Error status? Return parsed error
    └─ Success → Update UI state
```

---

## Environment Setup

### Development
- Server: `http://localhost:3000`
- Service Worker: Supported
- Notifications: Browser API available

### Production
- VAPID Keys: Required
- Database: Supabase or alternative
- Push Service: FCM, OneSignal, Pusher, etc.

---

## Testing Strategy

### Unit Test Examples
```typescript
// Test notification utils
test('checkNotificationSubscription returns false for missing userId')
test('saveNotificationSubscription formats request correctly')
test('sendNotification includes all required fields')

// Test API routes
test('GET /check with userId returns subscription status')
test('POST /subscribe validates userId and subscription')
test('POST /send validates all required fields')
```

### Integration Test Examples
```typescript
// Test end-to-end flow
test('User can check, save, and send notifications')
test('API properly handles missing parameters')
test('Frontend receives correct API responses')
```

---

## File Structure

```
app/
├── api/
│   └── notifications/
│       ├── check/route.ts          ✅ NEW
│       ├── send/route.ts           ✅ NEW
│       └── subscribe/route.ts      ✅ NEW
└── layout.tsx                       ✅ FIXED

components/
└── notification-manager.tsx         ✅ FIXED

lib/
└── notification-utils.ts           ✅ NEW

Root:
├── postman_collection.json         ✅ NEW
├── POSTMAN_API_GUIDE.md            ✅ NEW
├── QUICK_START.md                  ✅ NEW
└── FIX_SUMMARY.md                  ✅ NEW
```

---

## Future Enhancements

```
Phase 1 (Current) ✅
└── API structure complete
    API routes created
    Utilities implemented

Phase 2 (TODO)
└── Database integration
    Subscription persistence
    User history tracking

Phase 3 (TODO)
└── FCM/OneSignal integration
    Real push notifications
    Notification templates

Phase 4 (TODO)
└── Analytics
    Delivery tracking
    User preferences
    Performance metrics
```
