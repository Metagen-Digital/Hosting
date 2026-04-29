<script setup lang="ts">
useSeoMeta({ title: 'Order — MetaGen Hosting', robots: 'noindex' })

const route = useRoute()
const router = useRouter()

const plans = {
  starter:    { name: 'Starter',    monthly: 399,  yearly: 3990  },
  business:   { name: 'Business',   monthly: 799,  yearly: 7990  },
  enterprise: { name: 'Enterprise', monthly: 1499, yearly: 14990 },
}

const selectedPlan = ref<keyof typeof plans>((route.query.plan as keyof typeof plans) || 'business')
const billing      = ref<'monthly' | 'yearly'>((route.query.billing as 'monthly' | 'yearly') || 'yearly')

const price = computed(() =>
  billing.value === 'monthly'
    ? plans[selectedPlan.value].monthly
    : plans[selectedPlan.value].yearly
)

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
  { id: 'bkash',  label: 'bKash',  color: '#E2136E', icon: 'mdi:cellphone' },
  { id: 'nagad',  label: 'Nagad',  color: '#F7941D', icon: 'mdi:cellphone' },
  { id: 'rocket', label: 'Rocket', color: '#8B008B', icon: 'mdi:cellphone' },
  { id: 'upay',   label: 'Upay',   color: '#00A859', icon: 'mdi:cellphone' },
]

const adminPhone = '01915557363'

/* ── Validation ── */
const errors = reactive<Record<string, string>>({})

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.fullName.trim())    errors.fullName   = 'নাম দিন'
  if (!form.phone.match(/^01\d{9}$/)) errors.phone = 'সঠিক mobile number দিন'
  if (!form.email.includes('@'))  errors.email    = 'সঠিক email দিন'
  if (!form.address.trim())     errors.address    = 'Address দিন'
  if (!form.payMethod)          errors.payMethod  = 'Payment method select করুন'
  if (!form.txId.trim())        errors.txId       = 'Transaction ID দিন'
  if (!form.sendFrom.match(/^01\d{9}$/)) errors.sendFrom = 'আপনার নম্বর দিন'
  return Object.keys(errors).length === 0
}

/* ── Submit ── */
const loading = ref(false)

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    await $fetch('/api/order', {
      method: 'POST',
      body: {
        ...form,
        plan: plans[selectedPlan.value].name,
        billing: billing.value,
        price: price.value,
      },
    })
    router.push('/thank-you')
  } catch {
    errors.submit = 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন বা call করুন।'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-surface py-10">
    <div class="container-content max-w-5xl">
      <!-- Back -->
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors mb-8">
        <Icon name="mdi:arrow-left" class="w-4 h-4" aria-hidden="true" />
        হোমে ফিরুন
      </NuxtLink>

      <div class="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <!-- ── Form ── -->
        <div class="bg-white rounded-2xl border border-brand-border shadow-card p-7 md:p-10">
          <h1 class="font-display font-extrabold text-2xl md:text-3xl text-brand-primary mb-1">Order করুন</h1>
          <p class="text-brand-text-muted text-sm mb-8">সব তথ্য সঠিকভাবে পূরণ করুন — payment confirm হলে ২৪ ঘণ্টায় setup হবে।</p>

          <!-- Plan select -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-brand-primary mb-3">Plan বেছে নিন</label>
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
                <p class="font-semibold text-sm">{{ p.name }}</p>
                <p class="text-xs mt-0.5">৳{{ (billing === 'monthly' ? p.monthly : p.yearly).toLocaleString() }}</p>
              </button>
            </div>
            <div class="flex items-center gap-3 mt-3">
              <span class="text-xs text-brand-text-muted">Billing:</span>
              <button
                v-for="b in ['monthly', 'yearly'] as const"
                :key="b"
                type="button"
                class="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                :class="billing === b ? 'bg-brand-primary text-white border-brand-primary' : 'border-brand-border text-brand-text-muted'"
                @click="billing = b"
              >
                {{ b === 'monthly' ? 'Monthly' : 'Yearly (Save 20%)' }}
              </button>
            </div>
          </div>

          <div class="w-full h-px bg-brand-border mb-6" />

          <!-- Personal details -->
          <h2 class="font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:account" class="w-4 h-4 text-brand-text-muted" aria-hidden="true" />
            আপনার তথ্য
          </h2>
          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Domain Name</label>
              <input v-model="form.domainName" type="text" placeholder="yourdomain.com" class="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-primary placeholder-brand-text-muted text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Company Name (optional)</label>
              <input v-model="form.companyName" type="text" placeholder="ABC Company" class="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-primary placeholder-brand-text-muted text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">আপনার নাম <span class="text-brand-error">*</span></label>
              <input v-model="form.fullName" type="text" placeholder="মোহাম্মদ তানভীর" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.fullName ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.fullName" class="text-brand-error text-xs mt-1">{{ errors.fullName }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Mobile Number <span class="text-brand-error">*</span></label>
              <input v-model="form.phone" type="tel" placeholder="01XXXXXXXXX" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.phone ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.phone" class="text-brand-error text-xs mt-1">{{ errors.phone }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Email <span class="text-brand-error">*</span></label>
              <input v-model="form.email" type="email" placeholder="you@example.com" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.email ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.email" class="text-brand-error text-xs mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Address <span class="text-brand-error">*</span></label>
              <input v-model="form.address" type="text" placeholder="Dhaka, Bangladesh" class="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors" :class="errors.address ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.address" class="text-brand-error text-xs mt-1">{{ errors.address }}</p>
            </div>
          </div>

          <div class="w-full h-px bg-brand-border mb-6" />

          <!-- Payment -->
          <h2 class="font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:cellphone-nfc" class="w-4 h-4 text-brand-text-muted" aria-hidden="true" />
            Payment করুন
          </h2>

          <!-- Method buttons -->
          <div class="grid grid-cols-4 gap-3 mb-4">
            <button
              v-for="m in payMethods"
              :key="m.id"
              type="button"
              class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all duration-150"
              :class="form.payMethod === m.id
                ? 'border-current shadow-card'
                : 'border-brand-border text-brand-text-muted hover:border-brand-border-strong'"
              :style="form.payMethod === m.id ? `color: ${m.color}; background: ${m.color}15;` : ''"
              @click="form.payMethod = m.id as typeof form.payMethod"
            >
              <Icon :name="m.icon" class="w-5 h-5" aria-hidden="true" />
              {{ m.label }}
            </button>
          </div>
          <p v-if="errors.payMethod" class="text-brand-error text-xs mb-3">{{ errors.payMethod }}</p>

          <!-- Payment info card (shows when method selected) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-spring"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
          >
            <div v-if="form.payMethod" class="mb-5 p-5 rounded-xl bg-brand-surface border border-brand-border">
              <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">
                {{ payMethods.find(m => m.id === form.payMethod)?.label }} এ পাঠান
              </p>
              <div class="flex items-start gap-5">
                <!-- QR placeholder -->
                <div class="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-brand-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    v-if="form.payMethod"
                    :src="`/images/qr/${form.payMethod}.png`"
                    :alt="`${form.payMethod} QR`"
                    class="w-full h-full object-cover"
                    @error="($event.target as HTMLImageElement).style.display='none'"
                  />
                  <Icon name="mdi:qrcode" class="w-10 h-10 text-brand-text-muted" aria-hidden="true" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-brand-text-muted">Number (Send Money To):</span>
                  </div>
                  <p class="font-mono font-bold text-xl text-brand-primary mb-1 select-all">{{ adminPhone }}</p>
                  <p class="text-xs text-brand-text-muted mb-3">(Personal)</p>
                  <div class="flex items-center gap-2 p-3 rounded-lg bg-brand-warning/10 border border-brand-warning/30">
                    <Icon name="mdi:information" class="w-4 h-4 text-brand-warning flex-shrink-0" aria-hidden="true" />
                    <p class="text-xs text-brand-text-secondary">
                      Amount: <strong class="text-brand-primary">৳{{ price.toLocaleString() }}</strong> পাঠান — তারপর Transaction ID নিচে দিন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Tx + send from -->
          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">Transaction ID <span class="text-brand-error">*</span></label>
              <input v-model="form.txId" type="text" placeholder="TXN123456789" class="w-full px-4 py-3 rounded-lg border font-mono text-sm outline-none transition-colors" :class="errors.txId ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
              <p v-if="errors.txId" class="text-brand-error text-xs mt-1">{{ errors.txId }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-text-secondary mb-1.5">আপনার নম্বর (Send From) <span class="text-brand-error">*</span></label>
              <input v-model="form.sendFrom" type="tel" placeholder="01XXXXXXXXX" class="w-full px-4 py-3 rounded-lg border font-mono text-sm outline-none transition-colors" :class="errors.sendFrom ? 'border-brand-error bg-red-50' : 'border-brand-border bg-brand-surface focus:border-brand-primary'" />
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
            {{ loading ? 'পাঠানো হচ্ছে...' : 'Order Submit করুন →' }}
          </button>

          <p class="text-center text-xs text-brand-text-muted mt-4">
            Order submit করলে আমাদের
            <a href="/#faq" class="text-brand-primary hover:underline">Terms</a> এ সম্মত হচ্ছেন।
          </p>
        </div>

        <!-- ── Sticky Summary ── -->
        <div class="lg:sticky lg:top-24 space-y-4">
          <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6">
            <h3 class="font-semibold text-brand-primary mb-4">Order Summary</h3>

            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between">
                <span class="text-brand-text-muted">Plan</span>
                <span class="font-semibold text-brand-primary">{{ plans[selectedPlan].name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-text-muted">Billing</span>
                <span class="font-semibold text-brand-primary capitalize">{{ billing }}</span>
              </div>
              <div v-if="form.domainName" class="flex justify-between">
                <span class="text-brand-text-muted">Domain</span>
                <span class="font-semibold text-brand-primary truncate max-w-[140px]">{{ form.domainName }}</span>
              </div>
              <div class="w-full h-px bg-brand-border" />
              <div class="flex justify-between items-end">
                <span class="text-brand-text-muted">Total</span>
                <div class="text-right">
                  <span class="font-display font-extrabold text-2xl text-brand-primary">৳{{ price.toLocaleString() }}</span>
                  <p class="text-xs text-brand-text-muted">{{ billing === 'monthly' ? '/মাস' : '/বছর' }}</p>
                </div>
              </div>
            </div>

            <!-- What's included -->
            <div class="pt-4 border-t border-brand-border space-y-2">
              <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">Included</p>
              <p v-for="item in ['Free SSL Certificate', 'Daily Backup', 'cPanel Access', '২৪ঘণ্টায় Setup', 'Helpline Support']" :key="item" class="flex items-center gap-2 text-xs text-brand-text-secondary">
                <Icon name="mdi:check-circle" class="w-3.5 h-3.5 text-brand-success flex-shrink-0" aria-hidden="true" />
                {{ item }}
              </p>
            </div>
          </div>

          <!-- Help box -->
          <div class="bg-brand-surface rounded-2xl border border-brand-border p-5 text-center">
            <Icon name="mdi:headset" class="w-8 h-8 text-brand-primary mx-auto mb-2" aria-hidden="true" />
            <p class="text-sm font-medium text-brand-primary mb-1">সাহায্য দরকার?</p>
            <a href="tel:+8801915557363" class="text-lg font-bold text-brand-primary hover:underline">01915557363</a>
            <p class="text-xs text-brand-text-muted mt-1">যেকোনো প্রশ্নে call করুন</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
