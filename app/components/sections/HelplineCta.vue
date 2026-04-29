<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section id="contact" class="section-pad bg-gradient-to-br from-brand-primary to-brand-purple relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl" />
    </div>
    <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 32px 32px;" aria-hidden="true" />

    <div class="container-content relative z-10 text-center">
      <h2 class="font-display font-extrabold text-3xl md:text-4xl text-white mb-4">
        {{ t('cta.heading') }}
      </h2>
      <p class="text-white/70 text-lg max-w-xl mx-auto mb-10">
        {{ t('cta.sub') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <NuxtLink
          :to="localePath('/order')"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-btn bg-white text-brand-primary font-bold text-base hover:bg-brand-surface hover:scale-105 active:scale-95 transition-all duration-250 shadow-lg"
        >
          <Icon name="mdi:rocket-launch" class="w-5 h-5" aria-hidden="true" />
          {{ t('cta.orderNow') }}
        </NuxtLink>
        <a
          href="https://wa.me/8801915557363"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-btn border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-250"
        >
          <Icon name="mdi:whatsapp" class="w-5 h-5" aria-hidden="true" />
          {{ t('cta.whatsapp') }}
        </a>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <a href="tel:+8801915557363" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Icon name="mdi:phone" class="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span class="text-white font-semibold">01915557363</span>
        </a>
        <div class="w-px h-8 bg-white/20 hidden sm:block" aria-hidden="true" />
        <a href="mailto:bytestacklab@gmail.com" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Icon name="mdi:email" class="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span class="text-white font-semibold">bytestacklab@gmail.com</span>
        </a>
        <div class="w-px h-8 bg-white/20 hidden sm:block" aria-hidden="true" />
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Icon name="mdi:clock-outline" class="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span class="text-white/80 text-sm">{{ t('cta.responseTime') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
