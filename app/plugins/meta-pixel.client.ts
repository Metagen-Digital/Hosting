// Meta (Facebook) Pixel — loads only in production and only when a Pixel ID is
// configured, so a missing NUXT_PUBLIC_FB_PIXEL_ID simply means "no pixel"
// rather than a broken script. The ID is not a secret (it ships in the browser
// anyway); it lives in env so staging/preview builds can stay untracked.
//
// Note: connect.facebook.net must be allowed in the CSP script-src — see the
// routeRules block in nuxt.config.ts.
export default defineNuxtPlugin(() => {
  const pixelId = useRuntimeConfig().public.fbPixelId as string
  if (!pixelId || !import.meta.client) return

  // Meta's base snippet, rewritten as TS. Creates the fbq() command queue so
  // calls made before fbevents.js finishes downloading are replayed after.
  const w = window as unknown as { fbq?: FbqFn, _fbq?: FbqFn }
  if (w.fbq) return

  const fbq = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args)
  } as FbqFn

  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  w.fbq = fbq
  w._fbq ||= fbq

  // Meta's copy-paste snippet also ships a <noscript> tracking pixel. It is
  // deliberately omitted: this plugin is client-only, so the tag would itself
  // be injected by JavaScript and could never fire for a JS-disabled visitor.
  useHead({
    script: [{ src: 'https://connect.facebook.net/en_US/fbevents.js', async: true }],
  })

  fbq('init', pixelId)
  fbq('track', 'PageView')

  // Nuxt navigates client-side, so fbevents.js never sees a second page load —
  // PageView has to be fired manually. Guard on path so the initial route
  // (which afterEach may replay during hydration) isn't counted twice.
  const router = useRouter()
  let lastPath = router.currentRoute.value.path
  router.afterEach((to) => {
    if (to.path === lastPath) return
    lastPath = to.path
    fbq('track', 'PageView')
  })
})
