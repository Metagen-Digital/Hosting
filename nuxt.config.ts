export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      'Plus Jakarta Sans': [600, 700, 800],
      'Space Grotesk': [400, 500],
      'Hind Siliguri': [300, 400, 500, 600, 700],
    },
    display: 'swap',
    preload: true,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' },
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

  icon: {
    serverBundle: 'remote',
  },
})
