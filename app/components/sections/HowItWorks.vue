<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const stepKeys = [
  { key: 'search', icon: 'mdi:magnify',          color: 'text-brand-primary', border: 'border-brand-primary/20', accent: 'bg-brand-primary' },
  { key: 'plan',   icon: 'mdi:package-variant',  color: 'text-brand-orange',  border: 'border-brand-orange/20',  accent: 'bg-brand-orange' },
  { key: 'pay',    icon: 'mdi:cellphone-nfc',     color: 'text-brand-success', border: 'border-brand-success/20', accent: 'bg-brand-success' },
  { key: 'live',   icon: 'mdi:rocket-launch',     color: 'text-brand-purple',  border: 'border-brand-purple/20',  accent: 'bg-brand-purple' },
]
</script>

<template>
  <section id="how" class="section-pad bg-white">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
          <Icon name="mdi:list-status" class="w-3.5 h-3.5" aria-hidden="true" />
          {{ t('how.badge') }}
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          {{ t('how.heading1') }} <span class="text-gradient-orange">{{ t('how.heading2') }}</span>
        </h2>
        <p class="text-brand-text-secondary text-lg">{{ t('how.sub') }}</p>
      </div>

      <div class="relative">
        <div class="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-primary/20 via-brand-orange/30 to-brand-purple/20" aria-hidden="true" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          <div
            v-for="(step, i) in stepKeys"
            :key="step.key"
            class="flex flex-col items-center text-center group"
          >
            <div
              class="relative w-16 h-16 rounded-full border-2 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-card bg-white z-10"
              :class="step.border"
            >
              <Icon :name="step.icon" class="w-7 h-7" :class="step.color" aria-hidden="true" />
              <span
                class="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                :class="step.accent"
              >
                {{ i + 1 }}
              </span>
            </div>
            <h3 class="font-semibold text-brand-primary mb-2">{{ t(`how.steps.${step.key}.title`) }}</h3>
            <p class="text-brand-text-secondary text-sm leading-relaxed max-w-[200px]">{{ t(`how.steps.${step.key}.desc`) }}</p>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <NuxtLink
          :to="localePath('/order')"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-btn bg-gradient-brand text-white font-semibold text-base hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250"
        >
          <Icon name="mdi:rocket-launch" class="w-5 h-5" aria-hidden="true" />
          {{ t('how.cta') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
