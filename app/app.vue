<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

const siteUrl = computed(() => (config.public.siteUrl as string) || 'https://hosting.metagendigital.com')

// Locale-neutral path ("/order"), the basis for both the hreflang pair and the
// canonical URL. Query strings are deliberately dropped — ?plan=pro must not
// read as a separate page to a crawler.
const basePath = computed(() => route.path.replace(/^\/bn/, '') || '/')
const bnPath = computed(() => `/bn${basePath.value === '/' ? '' : basePath.value}`)

// Organization + WebSite + the hosting service itself. The Offer block is what
// lets Google show "from ৳300" against the result.
const jsonLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl.value}/#organization`,
      name: 'MetaGenDigital',
      url: 'https://metagendigital.com',
      logo: `${siteUrl.value}/images/logo/logo-dark.png`,
      email: 'hosting@metagendigital.com',
      telephone: '+8801970222573',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Uttara 10',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
      sameAs: [
        'https://www.facebook.com/metagendigital',
        'https://www.linkedin.com/company/metagendigital',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl.value}/#website`,
      url: siteUrl.value,
      name: 'MetaGen Digital Hosting',
      publisher: { '@id': `${siteUrl.value}/#organization` },
      inLanguage: locale.value === 'bn' ? 'bn-BD' : 'en-US',
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl.value}/#hosting-service`,
      name: 'Web Hosting & Domain Registration Bangladesh',
      serviceType: 'Web Hosting',
      provider: { '@id': `${siteUrl.value}/#organization` },
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      // Mirrors the plan table in pages/order.vue — keep in sync when prices move.
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: 300,
        highPrice: 750,
        offerCount: 3,
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
}))

useHead(computed(() => ({
  htmlAttrs: {
    lang: locale.value === 'bn' ? 'bn' : 'en',
  },
  script: [
    { key: 'ld-site', type: 'application/ld+json', innerHTML: jsonLd.value },
  ],
  link: [
    // Self-referencing canonical. Without it the i18n prefix strategy plus
    // ?plan=/?billing= query params let one page be indexed under many URLs.
    { rel: 'canonical', href: `${siteUrl.value}${locale.value === 'bn' ? bnPath.value : basePath.value}` },
    { rel: 'alternate', hreflang: 'en-US', href: `${siteUrl.value}${basePath.value}` },
    // bn-BD, not bare bn — the audience is Bangladesh specifically.
    { rel: 'alternate', hreflang: 'bn-BD', href: `${siteUrl.value}${bnPath.value}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl.value}${basePath.value}` },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
  ],
})))

// Site-wide OG/Twitter defaults so every page ships a card even if it forgets.
useSeoMeta({
  ogSiteName: 'MetaGen Digital Hosting',
  ogType: 'website',
  ogUrl: computed(() => `${siteUrl.value}${route.path}`),
  ogLocale: computed(() => (locale.value === 'bn' ? 'bn_BD' : 'en_US')),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
