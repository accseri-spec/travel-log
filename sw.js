/* 여행 로그 오프라인 지원 (Service Worker)
   - 앱 화면(여행 로그 + 운동 로그)의 정적 파일을 설치할 때 미리 받아 둡니다.
   - 평소에는 네트워크 우선(Network-First): 온라인일 때 항상 최신 data.js 를 받아 캐시를 갱신합니다.
   - 오프라인·비행기모드에서는 캐시에 든 마지막 버전을 바로 돌려줍니다.
   - 새 버전을 배포할 때 CACHE_NAME 만 올리면 이전 캐시는 지워집니다.
   - ?v=14 처럼 query string 이 붙은 요청도 ignoreSearch 로 같은 파일에 매칭합니다.
   - 체크리스트·메모·예약코드(#codes=)는 브라우저 localStorage 에 있으므로 오프라인에서도 그대로 동작합니다. */

const CACHE_NAME = 'travel-log-v1-2026-11-19b';
const OFFLINE_URL = './index.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './world.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './workout/',
  './workout/index.html',
  './workout/styles.css',
  './workout/app.js',
  './workout/data.js',
  './workout/manifest.webmanifest',
  './workout/icon-192.png',
  './workout/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // 하나가 실패해도 설치가 통째로 막히지 않도록 개별로 받아 둡니다.
    await Promise.all(PRECACHE_URLS.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res && (res.ok || res.type === 'opaque')) await cache.put(url, res.clone());
      } catch (err) {
        /* 오프라인 설치 등으로 한 파일을 못 받아도 나머지는 캐시합니다. */
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // 다른 사이트 요청은 건드리지 않습니다.

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const cache = await caches.open(CACHE_NAME);
        // query string 이 붙은 요청은 파일 경로 기준으로 저장해 캐시가 늘어나지 않게 합니다.
        if (url.search) cache.put(url.origin + url.pathname, res.clone());
        else cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const cache = await caches.open(CACHE_NAME);
      const hit = (await cache.match(req, { ignoreSearch: true })) ||
                  (url.search ? await cache.match(url.origin + url.pathname) : undefined);
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const shell = await cache.match(OFFLINE_URL, { ignoreSearch: true });
        if (shell) return shell;
      }
      return new Response('오프라인 상태이고 이 파일은 저장되어 있지 않습니다. 인터넷이 연결되면 다시 열어 주세요.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
