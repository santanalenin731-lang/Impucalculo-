const CACHE_NAME = 'impucalculo-v1';
const DYNAMIC_CACHE_NAME = 'impucalculo-dynamic-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/calculadora.html',
    '/prestaciones.html',
    '/divisas.html',
    '/manifest.json',
    '/logo_new.png',
    '/icon-192.png',
    '/icon-512.png'
];

// Install Event: Precache static resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Precaching files');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event: Network First for HTML, Cache First for Images
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip cross-origin requests unless they are specific APIs if necessary
    // Here we let everything pass but apply strategy depending on the file type

    // 1. HTML Pages & API Calls -> Network First, fallback to Cache
    if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || event.request.url.includes('script.google.com')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        // Only cache successful GET requests
                        if (event.request.method === 'GET' && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                })
                .catch(() => {
                    console.log('[Service Worker] Network failed, serving from cache:', event.request.url);
                    return caches.match(event.request);
                })
        );
    } 
    // 2. Static Assets (Images, Fonts, etc) -> Cache First, fallback to Network
    else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request).then((networkResponse) => {
                    // Cache the fetched asset dynamically
                    if (event.request.method === 'GET' && networkResponse.status === 200) {
                        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                });
            })
        );
    }
});
