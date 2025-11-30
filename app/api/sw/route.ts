export async function GET() {
  const swCode = `
    const CACHE_VERSION = 'v3';
    const CACHE_NAMES = {
      static: 'lombasku-static-' + CACHE_VERSION,
      dynamic: 'lombasku-dynamic-' + CACHE_VERSION,
      images: 'lombasku-images-' + CACHE_VERSION,
      api: 'lombasku-api-' + CACHE_VERSION,
    };

    // Critical assets to cache on install
    const CRITICAL_ASSETS = [
      '/',
      '/offline.html',
      '/manifest.json',
    ];

    // Offline fallback page
    const OFFLINE_PAGE = '/offline.html';

    // Install event - cache critical assets
    self.addEventListener('install', (event) => {
      console.log('[SW v3] Installing service worker...');
      event.waitUntil(
        caches.open(CACHE_NAMES.static).then((cache) => {
          console.log('[SW] Caching critical assets...');
          return cache.addAll(CRITICAL_ASSETS).catch((err) => {
            console.log('[SW] Critical asset caching attempted:', err);
            // Continue even if some assets fail
            return Promise.resolve();
          });
        })
      );
      self.skipWaiting();
    });

    // Activate event - clean up old caches
    self.addEventListener('activate', (event) => {
      console.log('[SW] Activating service worker...');
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (!Object.values(CACHE_NAMES).includes(cacheName)) {
                console.log('[SW] Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
      self.clients.claim();
    });

    // Fetch event - intelligent caching strategy with offline fallback
    self.addEventListener('fetch', (event) => {
      const { request } = event;
      const url = new URL(request.url);

      // Only handle GET requests
      if (request.method !== 'GET') {
        return;
      }

      // Handle HTML document requests
      if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
          fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAMES.static).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // Return cached version or offline page
              return caches.match(request).then((response) => {
                if (response) {
                  return response;
                }
                // Return offline page if available
                return caches.match(OFFLINE_PAGE).then((offlineResponse) => {
                  return offlineResponse || new Response(
                    'Offline - Page not available',
                    { status: 503, statusText: 'Service Unavailable' }
                  );
                });
              });
            })
        );
        return;
      }

      // Handle API calls - Network first with long cache fallback
      if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase') || url.hostname.includes('googleapis')) {
        event.respondWith(
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                const cacheName = url.pathname.startsWith('/api/') ? CACHE_NAMES.api : CACHE_NAMES.dynamic;
                caches.open(cacheName).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // Return cached API response or error
              return caches.match(request).then((response) => {
                if (response) {
                  console.log('[SW] Returning cached API response for:', request.url);
                  return response;
                }
                return new Response(
                  JSON.stringify({ 
                    error: 'Offline - API not available',
                    cached: false,
                    offline: true
                  }),
                  { 
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                  }
                );
              });
            })
        );
        return;
      }

      // Handle images - Cache first, with network fallback
      if (request.destination === 'image' || url.pathname.match(/\\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
        event.respondWith(
          caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            return fetch(request)
              .then((response) => {
                if (response && response.status === 200 && response.type !== 'error') {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAMES.images).then((cache) => {
                    cache.put(request, responseClone);
                  });
                }
                return response;
              })
              .catch(() => {
                // Return placeholder or cached image
                return caches.match(request).then((cachedResponse) => {
                  return cachedResponse || new Response(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#e5e7eb" width="100" height="100"/></svg>',
                    { 
                      headers: { 'Content-Type': 'image/svg+xml' }
                    }
                  );
                });
              });
          })
        );
        return;
      }

      // Handle stylesheets and scripts - Stale while revalidate
      if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(
          caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request).then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAMES.static).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            });

            // Return cached version immediately, update in background
            return cachedResponse || fetchPromise.catch(() => {
              return new Response(
                request.destination === 'style' ? '' : '',
                { 
                  headers: { 
                    'Content-Type': request.destination === 'style' ? 'text/css' : 'application/javascript'
                  }
                }
              );
            });
          })
        );
        return;
      }

      // Default - Network first with fallback
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAMES.dynamic).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Try to return cached version
            return caches.match(request).then((response) => {
              if (response) {
                console.log('[SW] Returning cached response for:', request.url);
                return response;
              }
              // Last resort - offline page
              return caches.match(OFFLINE_PAGE);
            });
          })
      );
    });

    // Handle messages from client
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Received SKIP_WAITING message');
        self.skipWaiting();
      }
      if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('[SW] Clearing all caches...');
        caches.keys().then((cacheNames) => {
          return Promise.all(cacheNames.map((name) => caches.delete(name)));
        });
      }
    });

    // Background sync for offline submissions
    self.addEventListener('sync', (event) => {
      console.log('[SW] Background sync triggered:', event.tag);
      if (event.tag === 'sync-data') {
        event.waitUntil(
          Promise.resolve()
        );
      }
    });

    console.log('[SW v3] Service worker loaded and ready for offline support');
  `;

  return new Response(swCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      // Allow the service worker script to control the whole origin
      // so registering '/api/sw' with scope '/' is permitted.
      "Service-Worker-Allowed": "/",
    },
  })
}
