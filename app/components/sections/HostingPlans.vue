<script setup lang="ts">
const billing = ref<'monthly' | 'yearly'>('yearly')

const plans = computed(() => [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'শুরু করার জন্য পারফেক্ট',
    monthlyPrice: 399,
    yearlyPrice: 3990,
    featured: false,
    badge: null,
    color: 'primary',
    features: [
      { text: '5 GB SSD Storage', ok: true },
      { text: '1 Website', ok: true },
      { text: '5 Email Accounts', ok: true },
      { text: 'Free SSL Certificate', ok: true },
      { text: 'Daily Backup', ok: true },
      { text: '10 GB Bandwidth', ok: true },
      { text: 'Free Domain (1 year)', ok: false },
      { text: 'Priority Support', ok: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Growing business এর জন্য',
    monthlyPrice: 799,
    yearlyPrice: 7990,
    featured: true,
    badge: 'Most Popular',
    color: 'orange',
    features: [
      { text: '20 GB SSD Storage', ok: true },
      { text: '5 Websites', ok: true },
      { text: 'Unlimited Email Accounts', ok: true },
      { text: 'Free SSL Certificate', ok: true },
      { text: 'Daily Backup', ok: true },
      { text: 'Unlimited Bandwidth', ok: true },
      { text: 'Free Domain (1 year)', ok: true },
      { text: 'Priority Support', ok: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Professional এর জন্য',
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    featured: false,
    badge: null,
    color: 'purple',
    features: [
      { text: '50 GB NVMe SSD', ok: true },
      { text: 'Unlimited Websites', ok: true },
      { text: 'Unlimited Email Accounts', ok: true },
      { text: 'Free SSL Certificate', ok: true },
      { text: 'Hourly Backup', ok: true },
      { text: 'Unlimited Bandwidth', ok: true },
      { text: 'Free Domain (1 year)', ok: true },
      { text: 'Priority Support 24/7', ok: true },
    ],
  },
])

function displayPrice(plan: typeof plans.value[0]) {
  return billing.value === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)
}

function totalPrice(plan: typeof plans.value[0]) {
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
          Hosting Plans
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          আপনার বাজেট অনুযায়ী <span class="text-gradient-brand">Plan</span> বেছে নিন
        </h2>
        <p class="text-brand-text-secondary text-lg">
          সব plan এ আছে Free SSL, Daily Backup এবং Verpex এর world-class infrastructure।
        </p>
      </div>

      <!-- Billing toggle -->
      <div class="flex items-center justify-center gap-4 mb-10">
        <span class="text-sm font-medium" :class="billing === 'monthly' ? 'text-brand-primary' : 'text-brand-text-muted'">Monthly</span>
        <button
          class="relative w-14 h-7 rounded-full transition-colors duration-250"
          :class="billing === 'yearly' ? 'bg-brand-primary' : 'bg-brand-border'"
          role="switch"
          :aria-checked="billing === 'yearly'"
          aria-label="Toggle billing period"
          @click="billing = billing === 'monthly' ? 'yearly' : 'monthly'"
        >
          <span
            class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-250"
            :class="billing === 'yearly' ? 'translate-x-7' : 'translate-x-0'"
          />
        </button>
        <span class="text-sm font-medium flex items-center gap-2" :class="billing === 'yearly' ? 'text-brand-primary' : 'text-brand-text-muted'">
          Yearly
          <span class="px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success text-xs font-semibold">Save 20%</span>
        </span>
      </div>

      <!-- Plan cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative rounded-2xl border p-7 flex flex-col transition-all duration-300"
          :class="plan.featured
            ? 'bg-white border-brand-orange shadow-glow-orange scale-105 z-10'
            : 'bg-white border-brand-border hover:border-brand-border-strong hover:shadow-card-hover'"
        >
          <!-- Popular badge -->
          <div
            v-if="plan.badge"
            class="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-orange text-white text-xs font-bold shadow-glow-orange whitespace-nowrap"
          >
            ⭐ {{ plan.badge }}
          </div>

          <!-- Plan name -->
          <div class="mb-1">
            <h3 class="font-display font-bold text-xl text-brand-primary">{{ plan.name }}</h3>
            <p class="text-brand-text-muted text-sm mt-0.5">{{ plan.tagline }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-end gap-1 mt-5 mb-1">
            <span class="text-brand-text-muted text-lg font-medium">৳</span>
            <span class="font-display font-extrabold text-4xl text-brand-primary leading-none">
              {{ displayPrice(plan).toLocaleString() }}
            </span>
            <span class="text-brand-text-muted text-sm mb-1">/মাস</span>
          </div>
          <p v-if="totalPrice(plan)" class="text-xs text-brand-text-muted mb-6">
            বার্ষিক ৳{{ totalPrice(plan)!.toLocaleString() }} — একসাথে payment
          </p>
          <p v-else class="text-xs text-brand-text-muted mb-6">প্রতি মাসে payment</p>

          <!-- Features -->
          <ul class="space-y-3 flex-1 mb-7">
            <li
              v-for="feat in plan.features"
              :key="feat.text"
              class="flex items-center gap-3 text-sm"
              :class="feat.ok ? 'text-brand-text-secondary' : 'text-brand-text-muted'"
            >
              <Icon
                :name="feat.ok ? 'mdi:check-circle' : 'mdi:close-circle'"
                class="w-4 h-4 flex-shrink-0"
                :class="feat.ok ? 'text-brand-success' : 'text-brand-text-muted/50'"
                aria-hidden="true"
              />
              <span :class="{ 'line-through': !feat.ok }">{{ feat.text }}</span>
            </li>
          </ul>

          <!-- CTA -->
          <NuxtLink
            :to="`/order?plan=${plan.id}&billing=${billing}`"
            class="w-full text-center py-3.5 px-6 rounded-btn font-semibold text-sm transition-all duration-250 hover:scale-105 active:scale-95"
            :class="plan.featured
              ? 'bg-gradient-orange text-white shadow-glow-orange hover:shadow-glow-orange'
              : 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'"
          >
            Order Now →
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom note -->
      <p class="text-center text-sm text-brand-text-muted mt-8">
        সব plan এ আছে ৩০ দিনের money-back guarantee ·
        <a href="#faq" class="text-brand-primary hover:underline">আরো জানুন</a>
      </p>
    </div>
  </section>
</template>
