<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })

const featureKeys = [
  { key: 'infra',   icon: 'mdi:server-network', color: 'text-brand-primary', bg: 'bg-brand-surface' },
  { key: 'ssl',     icon: 'mdi:shield-lock',    color: 'text-brand-success', bg: 'bg-brand-success/10' },
  { key: 'setup',   icon: 'mdi:lightning-bolt', color: 'text-brand-orange',  bg: 'bg-brand-orange/10' },
  { key: 'support', icon: 'mdi:headset',        color: 'text-brand-purple',  bg: 'bg-brand-purple/10' },
  { key: 'payment', icon: 'mdi:credit-card',    color: 'text-brand-cyan',    bg: 'bg-brand-cyan/10' },
  { key: 'backup',  icon: 'mdi:backup-restore', color: 'text-brand-primary', bg: 'bg-brand-surface' },
]

const statKeys = [
  { value: '99.9%', key: 'whyus.stats.uptime' },
  { value: '24h',   key: 'whyus.stats.setup'  },
  { value: null,    key: 'whyus.stats.from', priceKey: 'whyus.stats.price' },
  { value: '100%',  key: 'whyus.stats.secure' },
]
</script>

<template>
  <section class="section-pad bg-brand-surface">
    <div class="container-content">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
          <Icon name="mdi:thumb-up" class="w-3.5 h-3.5" aria-hidden="true" />
          {{ t('whyus.badge') }}
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          {{ t('whyus.heading') }}
        </h2>
        <p class="text-brand-text-secondary text-lg">{{ t('whyus.sub') }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <div
          v-for="stat in statKeys"
          :key="stat.key"
          class="text-center p-6 rounded-2xl bg-white border border-brand-border shadow-card"
        >
          <p class="font-display font-extrabold text-3xl text-brand-primary mb-1">{{ stat.priceKey ? t(stat.priceKey) : stat.value }}</p>
          <p class="text-brand-text-muted text-sm">{{ t(stat.key) }}</p>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feat in featureKeys"
          :key="feat.key"
          class="group p-6 rounded-2xl bg-white border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-250"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-250 group-hover:scale-110"
            :class="feat.bg"
          >
            <Icon :name="feat.icon" class="w-6 h-6" :class="feat.color" aria-hidden="true" />
          </div>
          <h3 class="font-semibold text-brand-primary mb-2">{{ t(`whyus.features.${feat.key}.title`) }}</h3>
          <p class="text-brand-text-secondary text-sm leading-relaxed">{{ t(`whyus.features.${feat.key}.desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
