const CACHE_NAME = 'coskun-yayci-v1';
const STATIC_CACHE = 'static-v1';
const IMAGE_CACHE = 'images-v1';
const API_CACHE = 'api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/base.css',
  '/css/styles.css',
  '/js/app.js',
  '/js/products.js',
  '/js/cart.js',
  '/js/search.js',
  '/js/filters.js',
  '/js/favorites.js',
  '/js/analytics.js',
  '/img/dp.png',
  '/img/pattern.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('Static cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('coskun-yayci-') || 
                   (name.startsWith('static-') && name !== STATIC_CACHE) ||
                   (name.startsWith('images-') && name !== IMAGE_CACHE);
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Strategy for HTML pages - Network First, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy for CSS/JS - Cache First, update in background
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy for Images - Cache First with stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(imageStrategy(request));
    return;
  }

  // Default - Network First
  event.respondWith(networkFirst(request));
});

// Network First strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Cache First strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, response);
        });
      }
    });
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Image strategy - Cache First with background update
async function imageStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Background sync for cart updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  // Sync cart data when back online
  const cartData = await getCartFromIndexedDB();
  if (cartData && cartData.items.length > 0) {
    // Analytics or background sync logic here
    console.log('Cart synced:', cartData);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/img/dp.png',
        badge: '/img/dp.png',
        tag: data.tag || 'default',
        requireInteraction: false,
        actions: data.actions || []
      })
    );
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper function placeholder
function getCartFromIndexedDB() {
  return Promise.resolve({ items: [] });
}
