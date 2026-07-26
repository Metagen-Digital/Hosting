<script setup lang="ts">
const { locale } = useI18n()
const siteUrl = (useRuntimeConfig().public.siteUrl as string) || 'https://hosting.metagendigital.com'

// Locale-aware: the /bn page previously served an English title and
// description, which competes for the wrong queries and reads as a mismatch
// to a Bengali searcher.
const title = computed(() => locale.value === 'bn'
  ? 'ডোমেইন ও হোস্টিং বাংলাদেশ | MetaGenDigital'
  : 'Domain & Hosting Bangladesh | MetaGenDigital')

const description = computed(() => locale.value === 'bn'
  ? 'বাংলাদেশের জন্য প্রফেশনাল ডোমেইন রেজিস্ট্রেশন ও ওয়েব হোস্টিং — মাসিক ৳৩০০ থেকে শুরু। বিকাশ, নগদ, রকেট, উপায় পেমেন্ট গ্রহণযোগ্য। ২৪ ঘণ্টায় সেটআপ গ্যারান্টি।'
  : 'Professional domain registration & web hosting for Bangladesh — starting from ৳300/month. bKash, Nagad, Rocket, Upay payment accepted. 24h setup guarantee.')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  // Absolute — Facebook/LinkedIn crawlers do not resolve relative OG paths.
  // NOTE: public/og-hosting.png does not exist yet; add a 1200×630 image there.
  ogImage: `${siteUrl}/og-hosting.png`,
  twitterImage: `${siteUrl}/og-hosting.png`,
})
</script>

<template>
  <div>
    <HeroSearch />
    <DomainPriceStrip />
    <HostingPlans />
    <WhyUsSection />
    <HowItWorks />
    <FaqSection />
    <HelplineCta />
  </div>
</template>
