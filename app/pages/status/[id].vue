<script setup lang="ts">
const route = useRoute()
const orderId = route.params.id as string

useSeoMeta({ title: `Order Status — ${orderId}`, robots: 'noindex' })

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

const { data, error, pending } = await useFetch<OrderStatus>(`/api/status/${orderId}`)

const statusConfig = computed(() => {
  const s = data.value?.status
  return {
    pending:   { label: 'Pending Verification', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: 'mdi:clock-outline'       },
    verified:  { label: 'Payment Verified',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: 'mdi:check-decagram'      },
    active:    { label: 'Active',                color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200', icon: 'mdi:check-circle'        },
    expired:   { label: 'Expired',               color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',  icon: 'mdi:calendar-remove'     },
    cancelled: { label: 'Cancelled',             color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',   icon: 'mdi:close-circle-outline' },
  }[s ?? 'pending'] ?? { label: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: 'mdi:help-circle' }
})

function fmtDate(s: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-BD', { day: '2-digit', month: 'long', year: 'numeric' })
}

function daysLeft(s: string | null) {
  if (!s) return null
  const diff = Math.ceil((new Date(s).getTime() - Date.now()) / 86400000)
  return diff
}

const expDays = computed(() => daysLeft(data.value?.expires_at ?? null))
</script>

<template>
  <div class="min-h-screen bg-brand-surface flex flex-col items-center justify-center py-12 px-4">

    <!-- Logo -->
    <NuxtLink to="/" class="mb-8">
      <NuxtImg src="/images/logo/logo-light.png" alt="MetaGenDigital" class="h-10 w-auto" />
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="flex flex-col items-center gap-3 text-brand-text-muted">
      <svg class="w-10 h-10 animate-spin text-brand-primary" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-sm">Loading order status...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-white rounded-2xl border border-red-200 shadow-card p-8 max-w-md w-full text-center">
      <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <h1 class="font-display font-bold text-xl text-brand-primary mb-2">Order Not Found</h1>
      <p class="text-brand-text-muted text-sm">No order found for <span class="font-mono font-bold">{{ orderId }}</span></p>
      <NuxtLink to="/" class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand-primary text-white text-sm font-semibold hover:brightness-110 transition-all">
        <Icon name="mdi:home" class="w-4 h-4" />
        Back to Home
      </NuxtLink>
    </div>

    <!-- Status Card -->
    <div v-else-if="data" class="bg-white rounded-2xl border border-brand-border shadow-card max-w-md w-full overflow-hidden">

      <!-- Card Header -->
      <div class="bg-[#1D1D47] px-6 py-5">
        <p class="text-xs text-[#b4b9dc] font-semibold uppercase tracking-widest mb-1">Hosting Order Status</p>
        <p class="font-mono font-bold text-white text-xl">{{ data.order_id }}</p>
      </div>

      <!-- Status Badge -->
      <div class="px-6 pt-5 pb-2">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
          :class="[statusConfig.color, statusConfig.bg, statusConfig.border]"
        >
          <Icon :name="statusConfig.icon" class="w-4 h-4" />
          {{ statusConfig.label }}
        </div>
      </div>

      <!-- Info rows -->
      <div class="px-6 py-4 space-y-0 divide-y divide-brand-border">

        <div class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:account" class="w-4 h-4" /> Client
          </span>
          <span class="font-semibold text-brand-primary">{{ data.client_name }}</span>
        </div>

        <div v-if="data.domain" class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:web" class="w-4 h-4" /> Domain
          </span>
          <span class="font-mono font-semibold text-brand-primary">{{ data.domain }}</span>
        </div>

        <div class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:server" class="w-4 h-4" /> Plan
          </span>
          <span class="font-semibold text-brand-primary capitalize">{{ data.plan }} — {{ data.billing }}</span>
        </div>

        <div class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:calendar-plus" class="w-4 h-4" /> Purchase Date
          </span>
          <span class="font-semibold text-brand-primary">{{ fmtDate(data.ordered_at) }}</span>
        </div>

        <div class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:rocket-launch" class="w-4 h-4" /> Activated
          </span>
          <span class="font-semibold" :class="data.activated_at ? 'text-green-600' : 'text-amber-500'">
            {{ fmtDate(data.activated_at) }}
          </span>
        </div>

        <div class="flex justify-between py-3 text-sm">
          <span class="text-brand-text-muted flex items-center gap-1.5">
            <Icon name="mdi:calendar-clock" class="w-4 h-4" /> Hosting Expires
          </span>
          <div class="text-right">
            <span
              class="font-semibold"
              :class="data.expires_at
                ? (expDays !== null && expDays < 15 ? 'text-red-500' : 'text-brand-primary')
                : 'text-brand-text-muted'"
            >
              {{ fmtDate(data.expires_at) }}
            </span>
            <p v-if="expDays !== null && expDays > 0" class="text-xs text-brand-text-muted">{{ expDays }} days left</p>
            <p v-else-if="expDays !== null && expDays <= 0" class="text-xs text-red-500 font-semibold">Expired</p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="bg-brand-surface border-t border-brand-border px-6 py-4 text-center">
        <p class="text-xs text-brand-text-muted">
          Need help?
          <a href="tel:+8801970222573" class="text-brand-primary font-semibold hover:underline">01970-222573</a>
          &nbsp;|&nbsp;
          <a href="mailto:hosting@metagendigital.com" class="text-brand-primary hover:underline">hosting@metagendigital.com</a>
        </p>
      </div>
    </div>

    <p class="mt-6 text-xs text-brand-text-muted">
      <a href="https://hosting.metagendigital.com" class="hover:text-brand-primary transition-colors">hosting.metagendigital.com</a>
    </p>
  </div>
</template>
