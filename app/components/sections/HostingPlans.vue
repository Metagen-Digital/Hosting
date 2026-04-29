<script setup lang="ts">
const { t } = useI18n()
const billing = ref<'monthly' | 'yearly'>('yearly')

interface PlanConfig {
  id: string
  nameKey: string
  taglineKey: string
  monthlyPrice: number
  yearlyPrice: number
  featured: boolean
  badgeKey: string | null
  features: { key: string; ok: boolean }[]
}

const planConfigs: PlanConfig[] = [
  {
    id: 'starter', nameKey: 'plans.starter.name', taglineKey: 'plans.starter.tagline',
    monthlyPrice: 399, yearlyPrice: 3990, featured: false, badgeKey: null,
    features: [
      { key: 'plans.features.ssd5',    ok: true  },
      { key: 'plans.features.site1',   ok: true  },
      { key: 'plans.features.email5',  ok: true  },
      { key: 'plans.features.ssl',     ok: true  },
      { key: 'plans.features.backupDaily', ok: true },
      { key: 'plans.features.bw10',    ok: true  },
      { key: 'plans.features.freeDomain', ok: false },
      { key: 'plans.features.priority',ok: false },
    ],
  },
  {
    id: 'business', nameKey: 'plans.business.name', taglineKey: 'plans.business.tagline',
    monthlyPrice: 799, yearlyPrice: 7990, featured: true, badgeKey: 'plans.business.badge',
    features: [
      { key: 'plans.features.ssd20',   ok: true  },
      { key: 'plans.features.site5',   ok: true  },
      { key: 'plans.features.emailUnlimited', ok: true },
      { key: 'plans.features.ssl',     ok: true  },
      { key: 'plans.features.backupDaily', ok: true },
      { key: 'plans.features.bwUnlimited', ok: true },
      { key: 'plans.features.freeDomain', ok: true },
      { key: 'plans.features.priority', ok: false },
    ],
  },
  {
    id: 'enterprise', nameKey: 'plans.enterprise.name', taglineKey: 'plans.enterprise.tagline',
    monthlyPrice: 1499, yearlyPrice: 14990, featured: false, badgeKey: null,
    features: [
      { key: 'plans.features.ssd50',   ok: true },
      { key: 'plans.features.siteUnlimited', ok: true },
      { key: 'plans.features.emailUnlimited', ok: true },
      { key: 'plans.features.ssl',     ok: true },
      { key: 'plans.features.backupHourly', ok: true },
      { key: 'plans.features.bwUnlimited', ok: true },
      { key: 'plans.features.freeDomain', ok: true },
      { key: 'plans.features.priority', ok: true },
    ],
  },
]

function displayPrice(plan: PlanConfig) {
  return billing.value === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)
}

function totalYear(plan: PlanConfig) {
  return billing.value === 'yearly' ? plan.yearlyPrice : null
}
</script>

<template>
  <section id="hosting" class="section-pad bg-white">
    <div class="container-content">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
          <Icon name="mdi:server" class="w-3.5 h-3.5" aria-hidden="true" />
          {{ t('plans.badge') }}
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          {{ t('plans.heading1') }} <span class="text-gradient-brand">{{ t('plans.heading2') }}</span>
        </h2>
        <p class="text-brand-text-secondary text-lg">{{ t('plans.sub') }}</p>
      </div>

      <!-- Billing toggle -->
      <div class="flex items-center justify-center gap-4 mb-10">
        <span class="text-sm font-medium" :class="billing === 'monthly' ? 'text-brand-primary' : 'text-brand-text-muted'">
          {{ t('plans.monthly') }}
        </span>
        <button
          class="relative w-14 h-7 rounded-full transition-colors duration-250"
          :class="billing === 'yearly' ? 'bg-brand-primary' : 'bg-brand-border'"
          role="switch"
          :aria-checked="billing === 'yearly'"
          :aria-label="t('plans.yearly')"
          @click="billing = billing === 'monthly' ? 'yearly' : 'monthly'"
        >
          <span
            class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-250"
            :class="billing === 'yearly' ? 'translate-x-7' : 'translate-x-0'"
          />
        </button>
        <span class="text-sm font-medium flex items-center gap-2" :class="billing === 'yearly' ? 'text-brand-primary' : 'text-brand-text-muted'">
          {{ t('plans.yearly') }}
          <span class="px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success text-xs font-semibold">
            {{ t('plans.save') }}
          </span>
        </span>
      </div>

      <!-- Plan cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div
          v-for="plan in planConfigs"
          :key="plan.id"
          class="relative rounded-2xl border p-7 flex flex-col transition-all duration-300"
          :class="plan.featured
            ? 'bg-white border-brand-orange shadow-glow-orange scale-105 z-10'
            : 'bg-white border-brand-border hover:border-brand-border-strong hover:shadow-card-hover'"
        >
          <div v-if="plan.badgeKey" class="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-orange text-white text-xs font-bold shadow-glow-orange whitespace-nowrap">
            ⭐ {{ t(plan.badgeKey) }}
          </div>

          <div class="mb-1">
            <h3 class="font-display font-bold text-xl text-brand-primary">{{ t(plan.nameKey) }}</h3>
            <p class="text-brand-text-muted text-sm mt-0.5">{{ t(plan.taglineKey) }}</p>
          </div>

          <div class="flex items-end gap-1 mt-5 mb-1">
            <span class="text-brand-text-muted text-lg font-medium">৳</span>
            <span class="font-display font-extrabold text-4xl text-brand-primary leading-none">
              {{ displayPrice(plan).toLocaleString() }}
            </span>
            <span class="text-brand-text-muted text-sm mb-1">{{ t('plans.perMonth') }}</span>
          </div>
          <p v-if="totalYear(plan)" class="text-xs text-brand-text-muted mb-6">
            {{ t('plans.yearlyBill', { price: totalYear(plan)!.toLocaleString() }) }}
          </p>
          <p v-else class="text-xs text-brand-text-muted mb-6">{{ t('plans.monthlyBill') }}</p>

          <ul class="space-y-3 flex-1 mb-7">
            <li
              v-for="feat in plan.features"
              :key="feat.key"
              class="flex items-center gap-3 text-sm"
              :class="feat.ok ? 'text-brand-text-secondary' : 'text-brand-text-muted'"
            >
              <Icon
                :name="feat.ok ? 'mdi:check-circle' : 'mdi:close-circle'"
                class="w-4 h-4 flex-shrink-0"
                :class="feat.ok ? 'text-brand-success' : 'text-brand-text-muted/50'"
                aria-hidden="true"
              />
              <span :class="{ 'line-through': !feat.ok }">{{ t(feat.key) }}</span>
            </li>
          </ul>

          <NuxtLink
            :to="`/order?plan=${plan.id}&billing=${billing}`"
            class="w-full text-center py-3.5 px-6 rounded-btn font-semibold text-sm transition-all duration-250 hover:scale-105 active:scale-95"
            :class="plan.featured
              ? 'bg-gradient-orange text-white shadow-glow-orange'
              : 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'"
          >
            {{ t('plans.orderNow') }}
          </NuxtLink>
        </div>
      </div>

      <p class="text-center text-sm text-brand-text-muted mt-8">
        {{ t('plans.note') }}
        <a href="#faq" class="text-brand-primary hover:underline">{{ t('plans.learnMore') }}</a>
      </p>
    </div>
  </section>
</template>
