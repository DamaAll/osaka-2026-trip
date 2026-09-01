/*
 * 這是模板：CACHE_VERSION 與 PRECACHE 會在 vite build 時由 precache-service-worker
 * plugin 換成實際的 hash 檔名。不要手動填。
 *
 * 為什麼要 precache：首次載入時 JS/CSS 是在 service worker 接管「之前」抓的，
 * 只靠 fetch handler 永遠不會把它們寫進快取，離線重載就會拿到 HTML 但白畫面。
 */
const CACHE = '__CACHE_VERSION__'
const PRECACHE = __PRECACHE_ASSETS__
const FALLBACK = './'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // hash 過的 asset 是不可變的，直接走快取；在日本的行動網路下也比較快。
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()))
        return response
      }))
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()))
        return response
      })
      .catch(async () => {
        const cached = await caches.match(event.request)
        if (cached) return cached
        if (event.request.mode === 'navigate') {
          // 網址上會帶 ?view=... ，比對時要忽略 query 才找得到 app shell。
          const shell = await caches.match(FALLBACK, { ignoreSearch: true })
          if (shell) return shell
        }
        return Response.error()
      })
  )
})
