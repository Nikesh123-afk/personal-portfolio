// Service Worker for Portfolio - Development-friendly with auto-update
const CACHE_NAME = 'nikesh-portfolio-v13'; // Increment version to force cache update
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './assets/images/Picture11.png',
    './assets/resume.pdf',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network-first strategy for development
self.addEventListener('fetch', event => {
    // Skip cache for HTML files during development
    if (event.request.destination === 'document' || 
        event.request.url.includes('.html') ||
        event.request.url.includes('.css') ||
        event.request.url.includes('.js')) {
        
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone and cache the fresh response
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request);
                })
        );
    } else {
        // Use cache-first for static assets (images, fonts, etc.)
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});
