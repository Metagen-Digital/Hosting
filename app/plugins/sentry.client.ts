// Sentry error monitoring — loads only when a DSN is configured, so a missing
// NUXT_PUBLIC_SENTRY_DSN simply means "no monitoring" rather than a broken
// app. The DSN is not a secret (it ships in the browser anyway); it lives in
// env so previews/local dev stay unmonitored (or can point at a separate
// Sentry project).
//
// Dynamic import keeps @sentry/browser out of the main bundle entirely when
// no DSN is set. Client-only and intentionally minimal: no tracing, no
// session replay — just uncaught exceptions and unhandled promise rejections.
//
// Note: Sentry's ingest endpoint must be allowed in the CSP connect-src — see
// the routeRules block in nuxt.config.ts.
export default defineNuxtPlugin(async () => {
  const dsn = useRuntimeConfig().public.sentryDsn as string
  if (!dsn || !import.meta.client) return

  const Sentry = await import('@sentry/browser')
  Sentry.init({
    dsn,
    environment: import.meta.dev ? 'development' : 'production',
  })
})
