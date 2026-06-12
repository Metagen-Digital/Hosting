<script setup lang="ts">
useSeoMeta({ title: 'Order — MetaGen Hosting', robots: 'noindex' })

const { user, isLoggedIn } = useAuth()
const { t, tm, rt } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const plans = {
  starter:  { name: 'Starter',  monthly: 300, yearly: 3000 },
  business: { name: 'Business', monthly: 450, yearly: 4500 },
  pro:      { name: 'Pro',      monthly: 750, yearly: 6000 },
}

const selectedPlan = ref<keyof typeof plans>((route.query.plan as keyof typeof plans) || 'business')
const billing      = ref<'monthly' | 'yearly'>((route.query.billing as 'monthly' | 'yearly') || 'yearly')

const DOMAIN_PRICE = 2000

const basePrice = computed(() =>
  billing.value === 'monthly'
    ? plans[selectedPlan.value].monthly
    : plans[selectedPlan.value].yearly
)

const hasDomain = computed(() => form.domainName.trim().length > 0)

const price = computed(() => basePrice.value + (hasDomain.value ? DOMAIN_PRICE : 0))

const includedItems = computed(() => {
  const items = tm('order.includedItems') as unknown[]
  return items.map(item => rt(item as any))
})

/* ── Form ── */
const form = reactive({
  domainName:  (route.query.domain as string) || '',
  companyName: '',
  fullName:    '',
  phone:       '',
  email:       '',
  address:     '',
  payMethod:   '' as 'bkash' | 'nagad' | 'rocket' | 'upay' | '',
  txId:        '',
  sendFrom:    '',
})

const payMethods = [
  { id: 'bkash',  label: 'bKash',  color: '#E2136E', logo: '/images/payment/bkash.png'  },
  { id: 'nagad',  label: 'Nagad',  color: '#F7941D', logo: '/images/payment/nagad.png'  },
  { id: 'rocket', label: 'Rocket', color: '#8B008B', logo: '/images/payment/rocket.png' },
  { id: 'upay',   label: 'Upay',   color: '#00A859', logo: '/images/payment/upay.png'   },
]

const adminPhone = '01915557363'

// Auto-fill from logged-in user — still editable
watch(user, (u) => {
  if (!u) return
  if (!form.fullName) form.fullName = u.name
  if (!form.email)    form.email    = u.email
  if (!form.phone)    form.phone    = u.phone || ''
}, { immediate: true })

/* ── Validation ── */
const errors = reactive<Record<string, string>>({})

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.fullName.trim())             errors.fullName  = t('order.errors.name')
  if (!form.phone.match(/^01\d{9}$/))    errors.phone     = t('order.errors.phone')
  if (!form.email.includes('@'))          errors.email     = t('order.errors.email')
  if (!form.address.trim())              errors.address   = t('order.errors.address')
  if (!form.payMethod)                   errors.payMethod = t('order.errors.payMethod')
  if (!form.txId.trim())                 errors.txId      = t('order.errors.txId')
  if (!form.sendFrom.match(/^01\d{9}$/)) errors.sendFrom  = t('order.errors.sendFrom')
  return Object.keys(errors).length === 0
}

/* ── Submit ── */
const loading = ref(false)
const orderStore = useOrderStore()

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    const result = await $fetch<{ success: boolean; orderId: string }>('/api/order', {
      method: 'POST',
      body: {
        ...form,
        plan: plans[selectedPlan.value].name,
        billing: billing.value,
        price: price.value,
      },
    })
    const orderedAt = new Date().toISOString()
    orderStore.value = {
      orderId:     result.orderId,
      fullName:    form.fullName,
      email:       form.email,
      phone:       form.phone,
      companyName: form.companyName,
      address:     form.address,
      domainName:  form.domainName,
      plan:        plans[selectedPlan.value].name,
      billing:     billing.value,
      price:       price.value,
      payMethod:   form.payMethod,
      txId:        form.txId,
      sendFrom:    form.sendFrom,
      orderedAt,
    }
    // Save to localStorage so dashboard can show order history
    try {
      const existing = JSON.parse(localStorage.getItem('mgd_orders') || '[]')
      existing.unshift({
        orderId:   result.orderId,
        plan:      plans[selectedPlan.value].name,
        domain:    form.domainName,
        price:     price.value,
        payMethod: form.payMethod,
        orderedAt,
      })
      localStorage.setItem('mgd_orders', JSON.stringify(existing))
    } catch {}
    router.push(localePath('/thank-you'))
  } catch (err: any) {
    errors.submit = err?.data?.message || err?.message || t('order.errorGeneral')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-surface py-10">
    <div class="container-content max-w-5xl">
      <!-- Back -->
      <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-1.5 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors mb-8">
        <Icon name="mdi:arrow-left" class="w-4 h-4" aria-hidden="true" />
        {{ t('order.back') }}
      </NuxtLink>

      <div class="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <!-- ── Form ── -->
        <div class="bg-white rounded-2xl border border-brand-border shadow-card p-7 md:p-10">
          <h1 class="font-display font-extrabold text-2xl md:text-3xl text-brand-primary mb-1">{{ t('order.title') }}</h1>
          <p class="text-brand-text-muted text-sm mb-8">{{ t('order.sub') }}</p>

          <!-- Plan select -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-brand-primary mb-3">{{ t('order.choosePlan') }}</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="(p, key) in plans"
                :key="key"
                type="button"
                class="py-3 px-2 rounded-xl border-2 text-center transition-all duration-150"
                :class="selectedPlan === key
                  ? 'border-brand-primary bg-brand-surface text-brand-primary'
                  : 'border-brand-border text-brand-text-muted hover:border-brand-border-strong'"
                @click="selectedPlan = key as keyof typeof plans"
              >
                <p class="font-semibold text-sm">{{ t(`plans.${key}.name`) }}</p>
                <p class="text-xs mt-0.5">৳{{ (billing === 'monthly' ? p.monthly : p.yearly).toLocaleString() }}</p>
              </button>
            </div>
            <div class="flex items-center gap-3 mt-3">
              <span class="text-xs text-brand-text-muted">{{ t('order.billing') }}</span>
              <button
                v-for="b in ['monthly', 'yearly'] as const"
                :key="b"
                type="button"
                class="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                :class="billing === b ? 'bg-brand-primary text-white border-brand-primary' : 'border-brand-border text-brand-text-muted'"
                @click="billing = b"
              >
                {{ b === 'monthly' ? t('order.monthly') : t('order.yearlySave') }}
              </button>
            </div>
          </div>

          <div class="w-full h-px bg-brand-border mb-6" />

          <!-- Personal details -->
          <h2 class="font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:account" class="w-4 h-4 text-brand-text-muted" aria-hidden="true" />
            {{ t('order.details') }}
          </h2>
          <div v-if="isLoggedIn" class="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700">
            <Icon name="mdi:account-check" class="w-4 h-4 shrink-0" />
            Filled from your account — you can still edit any field below.
          </div>
          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.domain') }}</label>
              <input v-model="form.domainName" type="text" :placeholder="t('order.domainPlaceholder')" class="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-primary placeholder-brand-text-muted text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.company') }}</label>
              <input v-model="form.companyName" type="text" :placeholder="t('order.companyPlaceholder')" class="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-primary placeholder-brand-text-muted text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.name') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.fullName" type="text" :placeholder="t('order.namePlaceholder')" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.fullName ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.fullName" class="text-brand-error text-xs mt-1">{{ errors.fullName }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.phone') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.phone" type="tel" :placeholder="t('order.phonePlaceholder')" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.phone ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.phone" class="text-brand-error text-xs mt-1">{{ errors.phone }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.email') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.email" type="email" placeholder="you@example.com" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.email ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.email" class="text-brand-error text-xs mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.address') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.address" type="text" :placeholder="t('order.addressPlaceholder')" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.address ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.address" class="text-brand-error text-xs mt-1">{{ errors.address }}</p>
            </div>
          </div>

          <div class="w-full h-px bg-brand-border mb-6" />

          <!-- Payment -->
          <h2 class="font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:cellphone-nfc" class="w-4 h-4 text-brand-text-muted" aria-hidden="true" />
            {{ t('order.payment') }}
          </h2>

          <!-- Method buttons -->
          <div class="grid grid-cols-4 gap-3 mb-4">
            <button
              v-for="m in payMethods"
              :key="m.id"
              type="button"
              class="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all duration-150"
              :class="form.payMethod === m.id
                ? 'border-current shadow-card'
                : 'border-brand-border text-brand-text-muted hover:border-brand-border-strong'"
              :style="form.payMethod === m.id ? `color: ${m.color}; background: ${m.color}15;` : ''"
              @click="form.payMethod = m.id as typeof form.payMethod"
            >
              <img :src="m.logo" :alt="m.label" class="h-7 w-auto object-contain" />
              {{ m.label }}
            </button>
          </div>
          <p v-if="errors.payMethod" class="text-brand-error text-xs mb-3">{{ errors.payMethod }}</p>

          <!-- Payment info card -->
          <Transition
            enter-active-class="transition-all duration-300 ease-spring"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
          >
            <div v-if="form.payMethod" class="mb-5 p-5 rounded-xl bg-brand-surface border border-brand-border">
              <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">
                {{ t('order.payTo') }}
              </p>
              <div class="flex items-start gap-5">
                <!-- QR -->
                <div class="w-28 h-28 rounded-xl bg-white border border-brand-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                  <img
                    :src="`/images/qr/${form.payMethod}-qr.png`"
                    :alt="`${form.payMethod} QR`"
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="flex-1">
                  <p class="font-mono font-bold text-xl text-brand-primary mb-1 select-all">{{ adminPhone }}</p>
                  <p class="text-xs text-brand-text-muted mb-3">{{ t('order.personal') }}</p>
                  <div class="flex items-center gap-2 p-3 rounded-lg bg-brand-warning/10 border border-brand-warning/30">
                    <Icon name="mdi:information" class="w-4 h-4 text-brand-warning flex-shrink-0" aria-hidden="true" />
                    <div class="text-xs text-brand-text-secondary space-y-0.5">
                      <p>{{ t('order.amount') }} <strong class="text-brand-primary text-sm">৳{{ price.toLocaleString() }}</strong></p>
                      <p v-if="hasDomain" class="text-brand-text-muted">
                        Hosting ৳{{ basePrice.toLocaleString() }} + Domain ৳{{ DOMAIN_PRICE.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Tx + send from -->
          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.txId') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.txId" type="text" :placeholder="t('order.txPlaceholder')" class="w-full px-4 py-3 rounded-lg border font-mono text-sm outline-none transition-colors" :class="errors.txId ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.txId" class="text-brand-error text-xs mt-1">{{ errors.txId }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">{{ t('order.sendFrom') }} <span class="text-brand-error">*</span></label>
              <input v-model="form.sendFrom" type="tel" :placeholder="t('order.phonePlaceholder')" class="w-full px-4 py-3 rounded-lg border font-mono text-sm outline-none transition-colors" :class="errors.sendFrom ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.sendFrom" class="text-brand-error text-xs mt-1">{{ errors.sendFrom }}</p>
            </div>
          </div>

          <!-- Error banner -->
          <div v-if="errors.submit" class="mb-4 p-4 rounded-xl bg-brand-error/10 border border-brand-error/30 text-brand-error text-sm flex items-center gap-2">
            <Icon name="mdi:alert-circle" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {{ errors.submit }}
          </div>

          <!-- Submit -->
          <button
            type="button"
            :disabled="loading"
            class="w-full py-4 px-6 rounded-btn bg-gradient-brand text-white font-bold text-base flex items-center justify-center gap-2 hover:shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            @click="submit"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <Icon v-else name="mdi:send" class="w-5 h-5" aria-hidden="true" />
            {{ loading ? t('order.submitting') : t('order.submit') }}
          </button>

          <p class="text-center text-xs text-brand-text-muted mt-4">
            {{ t('order.terms') }}
            <NuxtLink :to="localePath('/terms')" target="_blank" rel="noopener noreferrer" class="text-brand-primary hover:underline font-medium">{{ t('order.termsLink') }}</NuxtLink>
          </p>
        </div>

        <!-- ── Sticky Summary ── -->
        <div class="lg:sticky lg:top-24 space-y-4">
          <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <h3 class="font-semibold text-brand-primary mb-4">{{ t('order.summary') }}</h3>

            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between">
                <span class="text-brand-text-muted">{{ t('order.plan') }}</span>
                <span class="font-semibold text-brand-primary">{{ t(`plans.${selectedPlan}.name`) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-text-muted">{{ t('order.billingLabel') }}</span>
                <span class="font-semibold text-brand-primary capitalize">{{ billing }}</span>
              </div>
              <!-- Hosting base price -->
              <div class="flex justify-between">
                <span class="text-brand-text-muted">Hosting</span>
                <span class="font-semibold text-brand-primary">৳{{ basePrice.toLocaleString() }}</span>
              </div>
              <!-- Domain line — only when domain is entered -->
              <div v-if="hasDomain" class="flex justify-between">
                <div>
                  <span class="text-brand-text-muted">Domain Registration</span>
                  <p class="text-xs text-brand-text-muted font-mono truncate max-w-[120px]">{{ form.domainName }}</p>
                </div>
                <span class="font-semibold text-brand-orange">+৳{{ DOMAIN_PRICE.toLocaleString() }}</span>
              </div>
              <div v-else class="flex justify-between">
                <span class="text-xs text-brand-text-muted italic">Domain (optional)</span>
                <span class="text-xs text-brand-text-muted">+৳2,000</span>
              </div>
              <div class="w-full h-px bg-brand-border" />
              <div class="flex justify-between items-end">
                <span class="text-brand-text-muted font-semibold">{{ t('order.total') }}</span>
                <div class="text-right">
                  <span class="font-display font-extrabold text-2xl text-brand-primary">৳{{ price.toLocaleString() }}</span>
                  <p class="text-xs text-brand-text-muted">{{ billing === 'monthly' ? t('order.perMonth') : t('order.perYear') }}</p>
                </div>
              </div>
            </div>

            <!-- Included -->
            <div class="pt-4 border-t border-brand-border space-y-2">
              <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">{{ t('order.included') }}</p>
              <p v-for="item in includedItems" :key="item" class="flex items-center gap-2 text-xs text-brand-text-secondary">
                <Icon name="mdi:check-circle" class="w-3.5 h-3.5 text-brand-success flex-shrink-0" aria-hidden="true" />
                {{ item }}
              </p>
            </div>
          </div>

          <!-- Help box -->
          <div class="bg-brand-surface rounded-2xl border border-brand-border p-5 text-center">
            <Icon name="mdi:headset" class="w-8 h-8 text-brand-primary mx-auto mb-2" aria-hidden="true" />
            <p class="text-sm font-medium text-brand-primary mb-1">{{ t('order.help') }}</p>
            <a href="tel:+8801970222573" class="text-lg font-bold text-brand-primary hover:underline">01970-222573</a>
            <p class="text-xs text-brand-text-muted mt-1">{{ t('order.helpSub') }}</p>
            <div class="mt-4 pt-4 border-t border-brand-border">
              <Icon name="mdi:qrcode-scan" class="w-6 h-6 text-brand-purple mx-auto mb-1.5" aria-hidden="true" />
              <p class="text-xs text-brand-text-muted leading-relaxed">{{ t('order.statusNote') }}</p>
              <NuxtLink :to="localePath('/status')" class="inline-block mt-2 text-xs font-semibold text-brand-primary hover:underline">
                {{ t('order.statusLink') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
