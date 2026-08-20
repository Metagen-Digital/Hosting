export default defineNuxtConfig({
  // Shared auth/API layer. For local co-development against a checkout, swap to
  // extends: ['../MetagenShared'] — but keep the Git URL committed (Vercel repos
  // don't have the sibling folder). See MetagenShared/README.md.
  extends: ['github:Metagen-Digital/Shared#main'],

  compatibilityDate: '2025-07-15',
  // hosting.metagendigital.com — deployed on Vercel (Metagen-Digital org).
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // Absolute site URL for sitemap / canonical.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://hosting.metagendigital.com',
    name: 'MetaGen Digital Hosting',
  },

  sitemap: {
    // Keep private / per-user pages out of the sitemap.
    exclude: [
      '/dashboard', '/bn/dashboard',
      '/auth/**', '/bn/auth/**',
      '/status/**', '/bn/status/**',
      '/thank-you', '/bn/thank-you',
    ],
  },

  // Google Analytics 4 for hosting.metagendigital.com. The Measurement ID is
  // not a secret, so the site's own ID is the default; NUXT_PUBLIC_GTAG_ID can
  // still override it. Loads in production only.
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-RSVH9CX65Y',
    enabled: process.env.NODE_ENV === 'production',
  },

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  // Weights audited against actual `font-*` utility usage in app/ (2026-08-21):
  //   Inter (`body { @apply font-sans }`, default body font) — 400 kept even
  //     though no element uses `font-normal` explicitly: it's the CSS default
  //     weight for any unstyled text, so dropping it would leave plain text
  //     with no matching @font-face and force a browser-synthesized fallback.
  //     500/600/700 confirmed via font-medium/semibold/bold (26/121/24 uses);
  //     300/800/900 dropped — zero uses of font-light/extrabold/black.
  //   Plus Jakarta Sans (`.font-display`) — only ever paired with
  //     font-bold/font-extrabold (10/15 uses); the declared 600 was dead.
  //   Space Grotesk (`.font-mono`) — only font-semibold/font-bold appear
  //     (3/8 uses); 400/500 were declared but never requested.
  //   Hind Siliguri — this family used to load a SECOND time via a raw
  //     `@import url(fonts.googleapis.com/...)` in main.css that bypassed this
  //     module's self-hosting entirely — removed. It was also never applied:
  //     `font-bangla` existed in tailwind.config.js but no element used it, so
  //     Bangla rendered in whatever the OS substituted. It is now appended to
  //     the `sans` and `display` stacks instead, which reaches Bengali glyphs
  //     by per-glyph fallback without touching Latin text — same fix as
  //     MetagenFrontend, see there.
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Plus Jakarta Sans': [700, 800],
      'Space Grotesk': [600, 700],
      'Hind Siliguri': [300, 400, 500, 600, 700],
    },
    display: 'swap',
    // Self-host: without this, every page pays a separate DNS + TLS
    // handshake to fonts.googleapis.com/fonts.gstatic.com before the fonts
    // can even start downloading — pure latency on the LCP-critical path.
    download: true,
    preload: true,
    subsets: ['latin', 'bengali'],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' },
        // Google Search Console verification (HTML-tag method). This is a
        // SEPARATE property from the main site — use its own token here.
        ...(process.env.NUXT_PUBLIC_GSC_VERIFICATION
          ? [{ name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GSC_VERIFICATION }]
          : []),
        // Bing Webmaster Tools — its index also backs DuckDuckGo and ChatGPT
        // search. Separate property from the main site, so its own token.
        ...(process.env.NUXT_PUBLIC_BING_VERIFICATION
          ? [{ name: 'msvalidate.01', content: process.env.NUXT_PUBLIC_BING_VERIFICATION }]
          : []),
        // Meta domain verification — required for iOS 14+ Aggregated Event
        // Measurement, without which Purchase optimisation is degraded.
        ...(process.env.NUXT_PUBLIC_FB_DOMAIN_VERIFICATION
          ? [{ name: 'facebook-domain-verification', content: process.env.NUXT_PUBLIC_FB_DOMAIN_VERIFICATION }]
          : []),
      ],
      title: 'Domain & Hosting Bangladesh | MetaGenDigital',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  image: {
    format: ['webp'],
    quality: 85,
  },

  runtimeConfig: {
    smtpHost:   process.env.SMTP_HOST || '',
    smtpPort:   process.env.SMTP_PORT || '587',
    smtpUser:   process.env.SMTP_USER || '',
    smtpPass:   process.env.SMTP_PASS || '',
    adminEmail: process.env.ADMIN_EMAIL || 'hello@metagendigital.com',
    whoisApiKey: process.env.WHOIS_API_KEY || '',
    backendUrl: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://hosting.metagendigital.com',
      backendUrl: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
      apiBase: (process.env.BACKEND_URL || 'http://127.0.0.1:8000') + '/api',
      cookieDomain: process.env.COOKIE_DOMAIN || '',
      // Meta (Facebook) Pixel ID from Events Manager. Not a secret — it ships
      // in the browser. Empty means the pixel plugin stays inert, so previews
      // and local dev never pollute ad reporting. Sharing the main site's pixel
      // pools both audiences, which is what you want until traffic is large
      // enough to fund two separate learning phases.
      fbPixelId: process.env.NUXT_PUBLIC_FB_PIXEL_ID || '',
      // Sentry DSN — not a secret (it ships in the browser). Empty means the
      // error-monitoring plugin stays inert. See app/plugins/sentry.client.ts
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'bn', language: 'bn-BD', name: 'বাংলা',   dir: 'ltr', file: 'bn.json' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
    vueI18n: './i18n.config.ts',
  },

  // 'local' bundles @iconify-json/mdi + @iconify-json/heroicons (installed as
  // devDependencies — both collections are actually used in app/) into the
  // server build. Nothing else on this site draws icons from a free-text DB
  // field the way MetagenFrontend's Service.icon does, but `fallbackToApi`
  // (left on its default) still covers any icon name outside those two
  // collections, so nothing can silently break from switching off 'remote'.
  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
    },
  },

  routeRules: {
    // Global security headers on every route
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Content-Security-Policy': [
          "default-src 'self'",
          // connect.facebook.net serves fbevents.js (Meta Pixel); the tracking
          // beacons themselves go to www.facebook.com/tr, covered by img-src.
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          // *.ingest.*.sentry.io covers Sentry's regional ingest hosts (us/de/
          // default) — only used once NUXT_PUBLIC_SENTRY_DSN is actually set.
          "connect-src 'self' https://api.metagendigital.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://connect.facebook.net https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join('; '),
      },
    },
    // Private dashboard — client-only, never indexed
    '/dashboard':    { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/bn/dashboard': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    // Order status lookup pages — keep out of the index
    '/status/**':    { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/bn/status/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },

    // ── ISR ──────────────────────────────────────────────────────────
    // Only the two routes below have zero per-visitor server-rendered state,
    // verified by checking every component they use for `useAuth()` calls
    // that aren't wrapped in <ClientOnly>: the shared UserMenu.vue IS wrapped
    // (safe — its personalization happens client-side after hydration), but
    // /order renders `v-if="isLoggedIn"` directly in its template with no
    // such wrapper, so caching that page would bake one visitor's login
    // state into the HTML everyone else gets served.
    //
    // ⚠️ Do NOT add isr to any other route here without re-checking this:
    //   /order        — renders isLoggedIn server-side (see order.vue) —
    //                    caching it leaks one visitor's auth state to others.
    //   /status/**    — per-customer order data (domain, plan, price),
    //                   looked up by the id+email in the request.
    //   /thank-you    — reads useOrderStore(), a per-request useState that
    //                   only ever holds real data via the client-side
    //                   navigation from /order (a fresh SSR hit always sees
    //                   it null). That LIKELY makes ISR safe here too — a
    //                   cached response would just be the same empty-state
    //                   HTML real orders never actually render from — but
    //                   proving that with certainty means reasoning about
    //                   how Nitro/Vercel's ISR interacts with per-request
    //                   useState, which is exactly the kind of interaction
    //                   worth NOT gambling on for a low-traffic (one visit
    //                   per completed order), noindex page. Left as regular
    //                   SSR rather than take that risk for negligible gain.
    //   /dashboard    — already ssr:false, private.
    //   /auth/**      — login/register forms; excluded on principle even
    //                   though they hold no per-visitor data today.
    '/':         { isr: 600 },
    '/bn':       { isr: 600 },
    '/terms':    { isr: 86400 },
    '/bn/terms': { isr: 86400 },
  },
})
