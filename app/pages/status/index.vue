<script setup lang="ts">
useSeoMeta({ title: 'Check Hosting Status — MetaGenDigital', robots: 'noindex' })

const router    = useRouter()
const inputId   = ref('')
const searching = ref(false)
const error     = ref('')

interface OrderStatus {
  order_id: string
  client_name: string
  domain: string | null
  plan: string
  billing: string
  status: 'pending' | 'verified' | 'active' | 'expired' | 'cancelled'
  ordered_at: string | null
  activated_at: string | null
  expires_at: string | null
}

const result = ref<OrderStatus | null>(null)

const statusConfig = computed(() => {
  const s = result.value?.status
  const map = {
    pending:   { label: 'Pending Verification', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: 'mdi:clock-outline'        },
    verified:  { label: 'Payment Verified',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: 'mdi:check-decagram'       },
    active:    { label: 'Active',                color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200', icon: 'mdi:check-circle'         },
    expired:   { label: 'Expired',               color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',  icon: 'mdi:calendar-remove'      },
    cancelled: { label: 'Cancelled',             color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',   icon: 'mdi:close-circle-outline' },
  }
  return map[s ?? 'pending']
})

function fmtDate(s: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-BD', { day: '2-digit', month: 'long', year: 'numeric' })
}

function daysLeft(s: string | null) {
  if (!s) return null
  return Math.ceil((new Date(s).getTime() - Date.now()) / 86400000)
}

const expDays = computed(() => daysLeft(result.value?.expires_at ?? null))

async function search() {
  const id = inputId.value.trim().toUpperCase()
  if (!id) { error.value = 'Please enter an Order ID'; return }

  error.value  = ''
  result.value = null
  searching.value = true

  try {
    const data = await $fetch<OrderStatus>(`/api/status/${id}`)
    result.value = data
  } catch {
    error.value = `No order found for "${id}". Please check the Order ID and try again.`
  } finally {
    searching.value = false
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter') search()
}
</script>

<template>
  <div class="min-h-screen bg-brand-surface flex flex-col items-center justify-start py-12 px-4">

    <!-- Logo -->
    <NuxtLink to="/" class="mb-8">
      <NuxtImg src="/images/logo/logo-light.png" alt="MetaGenDigital" class="h-10 w-auto" />
    </NuxtLink>

    <!-- Search Card -->
    <div class="bg-white rounded-2xl border border-brand-border shadow-card w-full max-w-md overflow-hidden mb-6">
      <!-- Header -->
      <div class="bg-[#1D1D47] px-6 py-5 text-center">
        <Icon name="mdi:magnify" class="w-8 h-8 text-[#b4b9dc] mx-auto mb-2" aria-hidden="true" />
        <h1 class="font-display font-bold text-white text-xl">Check Hosting Status</h1>
        <p class="text-[#b4b9dc] text-xs mt-1">Enter your Order ID to view status</p>
      </div>

      <!-- Search input -->
      <div class="px-6 py-6">
        <label class="block text-xs font-semibold text-brand-text-secondary mb-2">Order ID</label>
        <div class="flex gap-2">
          <input
            v-model="inputId"
            type="text"
            placeholder="e.g. MGD-AB1234"
            class="flex-1 px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-primary font-mono text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-colors uppercase placeholder:normal-case placeholder:text-brand-text-muted"
            @keydown="onKey"
          />
          <button
            type="button"
            :disabled="searching"
            class="px-5 py-3 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:brightness-110 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            @click="search"
          >
            <svg v-if="searching" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <Icon v-else name="mdi:magnify" class="w-4 h-4" aria-hidden="true" />
            Search
          </button>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
          <Icon name="mdi:alert-circle" class="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          {{ error }}
        </div>

        <p class="text-xs text-brand-text-muted mt-3 text-center">
          Your Order ID is on your invoice (e.g. <span class="font-mono font-semibold">MGD-AB1234</span>)
        </p>
      </div>
    </div>

    <!-- Result Card -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="result" class="bg-white rounded-2xl border border-brand-border shadow-card w-full max-w-md overflow-hidden">

        <!-- Status badge -->
        <div class="px-6 pt-5 pb-2 flex items-center justify-between">
          <p class="font-mono font-bold text-brand-primary text-lg">{{ result.order_id }}</p>
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold"
            :class="[statusConfig.color, statusConfig.bg, statusConfig.border]"
          >
            <Icon :name="statusConfig.icon" class="w-3.5 h-3.5" />
            {{ statusConfig.label }}
          </div>
        </div>

        <!-- Info rows -->
        <div class="px-6 py-2 divide-y divide-brand-border">
          <div class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:account" class="w-4 h-4" /> Client</span>
            <span class="font-semibold text-brand-primary">{{ result.client_name }}</span>
          </div>
          <div v-if="result.domain" class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:web" class="w-4 h-4" /> Domain</span>
            <span class="font-mono font-semibold text-brand-primary">{{ result.domain }}</span>
          </div>
          <div class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:server" class="w-4 h-4" /> Plan</span>
            <span class="font-semibold text-brand-primary capitalize">{{ result.plan }} — {{ result.billing }}</span>
          </div>
          <div class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:calendar-plus" class="w-4 h-4" /> Purchase Date</span>
            <span class="font-semibold text-brand-primary">{{ fmtDate(result.ordered_at) }}</span>
          </div>
          <div class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:rocket-launch" class="w-4 h-4" /> Activated</span>
            <span class="font-semibold" :class="result.activated_at ? 'text-green-600' : 'text-amber-500'">{{ fmtDate(result.activated_at) }}</span>
          </div>
          <div class="flex justify-between py-2.5 text-sm">
            <span class="text-brand-text-muted flex items-center gap-1.5"><Icon name="mdi:calendar-clock" class="w-4 h-4" /> Hosting Expires</span>
            <div class="text-right">
              <span class="font-semibold" :class="result.expires_at ? (expDays !== null && expDays < 15 ? 'text-red-500' : 'text-brand-primary') : 'text-brand-text-muted'">
                {{ fmtDate(result.expires_at) }}
              </span>
              <p v-if="expDays !== null && expDays > 0" class="text-xs text-brand-text-muted">{{ expDays }} days left</p>
              <p v-else-if="expDays !== null && expDays <= 0" class="text-xs text-red-500 font-semibold">Expired</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-brand-surface border-t border-brand-border px-6 py-3 text-center">
          <p class="text-xs text-brand-text-muted">
            Need help?
            <a href="tel:+8801970222573" class="text-brand-primary font-semibold hover:underline">01970-222573</a>
            &nbsp;|&nbsp;
            <a href="mailto:hosting@metagendigital.com" class="text-brand-primary hover:underline">hosting@metagendigital.com</a>
          </p>
        </div>
      </div>
    </Transition>

    <p class="mt-8 text-xs text-brand-text-muted">
      <a href="/" class="hover:text-brand-primary transition-colors">hosting.metagendigital.com</a>
    </p>
  </div>
</template>
