// Advanced Service Worker for Portfolio PWA
// Version: 2.0 - Enhanced caching and offline functionality

const CACHE_NAME = 'nikesh-portfolio-v2.0';
const STATIC_CACHE = 'nikesh-static-v2.0';
const DYNAMIC_CACHE = 'nikesh-dynamic-v2.0';

// Define what to cache
const STATIC_ASSETS = [
    '/modern-portfolio.html',
    '/css/style.css',
    '/css/hero-enhancements.css',
    '/css/typing-effect.css',
    '/css/themes/variables.css',
    '/js/main.js',
    '/js/typing-effect.js',
    '/assets/images/Picture1.png',
    '/assets/resume.pdf',
    // Essential Bootstrap and external resources
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    // Critical fonts
    'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Inter:wght@400;500;600&display=swap'
];

// Pages to cache for offline functionality
const OFFLINE_PAGES = [
    '/pages/html.html',
    '/pages/css.html',
    '/pages/javascript.html',
    '/pages/bootstrap.html',
    '/pages/fullstack.html'
];

// Cache size limits
const CACHE_SIZE_LIMIT = 50;

// Install event - Cache static assets
self.addEventListener('install', event => {
    console.log('🚀 Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('📄 Service Worker: Caching portfolio pages');
                return cache.addAll(OFFLINE_PAGES);
            })
        ]).then(() => {
            console.log('✅ Service Worker: Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker: Installation failed', error);
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - Advanced caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;
    
    event.respondWith(handleFetch(request));
});

// Advanced fetch handling
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Network First for API calls and dynamic content
        if (url.pathname.includes('/api/') || url.search.includes('cache=no')) {
            return await networkFirst(request);
        }
        
        // Cache First for static assets
        if (isStaticAsset(url)) {
            return await cacheFirst(request);
        }
        
        // Stale While Revalidate for pages
        if (isPageRequest(url)) {
            return await staleWhileRevalidate(request);
        }
        
        return await networkFirstWithFallback(request);
        
    } catch (error) {
        console.error('🔥 Service Worker: Fetch error', error);
        return await getOfflineFallback(request);
    }
}

// Cache First Strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    await updateCache(STATIC_CACHE, request, networkResponse.clone());
    return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        await updateCache(DYNAMIC_CACHE, request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const networkPromise = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    }).catch(error => {
        console.warn('🌐 Service Worker: Network failed for', request.url, error);
        return null;
    });
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    return await networkPromise;
}

// Network First with Fallback
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        await updateCache(DYNAMIC_CACHE, request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return await getOfflineFallback(request);
    }
}

// Update cache with size limit
async function updateCache(cacheName, request, response) {
    if (!response || response.status !== 200) return;
    
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    
    if (cacheName === DYNAMIC_CACHE) {
        await limitCacheSize(cacheName, CACHE_SIZE_LIMIT);
    }
}

// Limit cache size
async function limitCacheSize(cacheName, size) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > size) {
        const keysToDelete = keys.slice(0, keys.length - size);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
}

// Helper functions
function isStaticAsset(url) {
    return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/i) ||
           url.hostname === 'cdn.jsdelivr.net' ||
           url.hostname === 'cdnjs.cloudflare.com' ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

function isPageRequest(url) {
    return url.pathname.endsWith('.html') || 
           url.pathname === '/' ||
           url.pathname.includes('/pages/');
}

// Offline fallback
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    if (request.destination === 'document' || isPageRequest(url)) {
        const cachedPage = await caches.match('/modern-portfolio.html');
        if (cachedPage) {
            return cachedPage;
        }
        
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - Nikesh Portfolio</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        text-align: center;
                        padding: 50px 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                    }
                    .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
                    h1 { font-size: 2rem; margin-bottom: 1rem; }
                    p { font-size: 1.1rem; opacity: 0.9; max-width: 400px; }
                    .retry-btn {
                        background: rgba(255,255,255,0.2);
                        border: 2px solid rgba(255,255,255,0.3);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 1rem;
                        margin-top: 2rem;
                        transition: all 0.3s ease;
                    }
                    .retry-btn:hover {
                        background: rgba(255,255,255,0.3);
                        transform: translateY(-2px);
                    }
                </style>
            </head>
            <body>
                <div class="offline-content">
                    <div class="offline-icon">📱</div>
                    <h1>You're Offline</h1>
                    <p>Don't worry! This portfolio works offline. Please check your connection and try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        Retry Connection
                    </button>
                </div>
                <script>
                    window.addEventListener('online', () => {
                        window.location.reload();
                    });
                </script>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    return new Response('Offline', { 
        status: 503, 
        statusText: 'Service Unavailable' 
    });
}

console.log('🎯 Service Worker: Loaded successfully!');
