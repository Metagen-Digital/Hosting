<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const { user, userInitials, logout, loading, updateProfile, changePassword } = useAuth()
const { apiFetch } = useApiClient()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBase as string) || `${config.public.backendUrl}/api`

const activeTab = ref('account')

// Profile edit
const profileForm = reactive({ name: '', phone: '' })
const profileErrors = ref<Record<string, string[]>>({})
const profileSuccess = ref(false)

// Password change
const passwordForm = reactive({ current_password: '', password: '', password_confirmation: '' })
const passwordErrors = ref<Record<string, string[]>>({})
const passwordSuccess = ref(false)
const showCurrentPw = ref(false)
const showNewPw = ref(false)

watch(user, (u) => {
  if (u) {
    profileForm.name = u.name
    profileForm.phone = u.phone || ''
  }
}, { immediate: true })

async function saveProfile() {
  profileErrors.value = {}
  profileSuccess.value = false
  const result = await updateProfile(profileForm.name, profileForm.phone)
  if (result.success) {
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } else {
    profileErrors.value = result.errors
  }
}

async function savePassword() {
  passwordErrors.value = {}
  passwordSuccess.value = false
  const result = await changePassword(
    passwordForm.current_password,
    passwordForm.password,
    passwordForm.password_confirmation,
  )
  if (result.success) {
    passwordSuccess.value = true
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    setTimeout(() => { passwordSuccess.value = false }, 3000)
  } else {
    passwordErrors.value = result.errors
  }
}

const tabs = computed(() => [
  { id: 'account', label: t('dashboard.tabs.account'), icon: 'mdi:account-circle-outline' },
  { id: 'orders',  label: t('dashboard.tabs.orders'),  icon: 'mdi:package-variant-closed'  },
  { id: 'track',   label: t('dashboard.tabs.track'),   icon: 'mdi:map-marker-path'         },
])

interface SavedOrder {
  orderId: string
  plan: string
  domain: string
  price: number
  payMethod: string
  orderedAt: string
  status?: string
}
const savedOrders = ref<SavedOrder[]>([])
const apiOrders = ref<SavedOrder[]>([])

const displayOrders = computed(() => {
  const apiIds = new Set(apiOrders.value.map(o => o.orderId))
  const localOnly = savedOrders.value.filter(o => !apiIds.has(o.orderId))
  return [...apiOrders.value, ...localOnly]
})

async function fetchHostingOrders() {
  if (!user.value) return
  try {
    const data = await apiFetch<any>('/auth/hosting-orders')
    apiOrders.value = data.data || []
  } catch {
    apiOrders.value = []
  }
}

interface Invoice {
  invoice_number: string
  client_name: string
  services: Array<{ name: string; price: number; description?: string }>
  total_amount: number
  pay_method: string
  pay_label: string
  status: string
  issued_at: string | null
  notes: string | null
}
const invoices = ref<Invoice[]>([])
const invoicesLoading = ref(false)
const invoiceDownloading = ref<string | null>(null)

async function fetchInvoices() {
  if (!user.value) return
  invoicesLoading.value = true
  try {
    const data = await apiFetch<any>('/auth/invoices')
    invoices.value = data.data || []
  } catch {
    invoices.value = []
  } finally {
    invoicesLoading.value = false
  }
}

async function downloadInvoice(invoiceNumber: string) {
  if (!user.value) return
  invoiceDownloading.value = invoiceNumber
  try {
    // Native fetch for the binary PDF; GET needs no CSRF, just the session cookie.
    const res = await fetch(`${apiBase}/auth/invoices/${invoiceNumber}/download`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Download failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MetaGen-Invoice-${invoiceNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    alert(t('dashboard.orders.downloadFailed'))
  } finally {
    invoiceDownloading.value = null
  }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem('mgd_orders')
    if (raw) savedOrders.value = JSON.parse(raw)
  } catch {}
  fetchInvoices()
  fetchHostingOrders()
})

// Order tracker
const trackId = ref('')
const trackResult = ref<any>(null)
const trackError = ref('')
const trackLoading = ref(false)

async function checkOrderStatus() {
  if (!trackId.value.trim()) return
  trackError.value = ''
  trackResult.value = null
  trackLoading.value = true
  try {
    // POST with the account email, not a bare GET: the backend route now
    // requires order_id + email together (a leaked/guessed order id alone
    // used to be enough to see someone else's order). Since this page is
    // already behind the `auth` middleware, the signed-in user's own email
    // is the correct value to send — no separate prompt needed here, unlike
    // the public /status lookup page.
    const data = await $fetch<any>(
      `${apiBase}/hosting-orders/${trackId.value.trim()}/status`,
      {
        method: 'POST',
        body: { email: user.value?.email },
        headers: { Accept: 'application/json' },
      },
    )
    trackResult.value = data as any
  } catch (e: any) {
    const status = e?.response?.status || e?.status
    trackError.value = status === 429
      ? t('dashboard.track.tooManyRequests')
      : t('dashboard.track.notFound')
  } finally {
    trackLoading.value = false
  }
}

const statusStyle: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100   text-blue-700   border-blue-200',
  active:    'bg-green-100  text-green-700  border-green-200',
  cancelled: 'bg-red-100    text-red-700    border-red-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-surface via-white to-[#eef0ff] py-8 px-4">
    <div class="max-w-5xl mx-auto">

      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-bold text-brand-text-primary font-display">{{ t('dashboard.title') }}</h1>
        <button
          :disabled="loading"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
          @click="logout"
        >
          <Icon name="mdi:logout" class="w-3.5 h-3.5" />
          {{ t('dashboard.signOut') }}
        </button>
      </div>

      <div class="flex flex-col md:flex-row gap-5">

        <!-- Sidebar -->
        <aside class="md:w-56 shrink-0">
          <div class="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <div class="bg-gradient-brand p-4 text-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                  {{ userInitials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold truncate">{{ user?.name }}</p>
                  <p class="text-xs text-white/60 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>

            <nav class="p-2 space-y-0.5">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                :class="activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-primary'"
                @click="activeTab = tab.id"
              >
                <Icon :name="tab.icon" class="w-4 h-4 shrink-0" />
                {{ tab.label }}
              </button>
            </nav>

            <div class="p-2 border-t border-brand-border">
              <button
                :disabled="loading"
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                @click="logout"
              >
                <Icon name="mdi:logout" class="w-4 h-4 shrink-0" />
                {{ t('dashboard.signOut') }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 min-w-0">

          <!-- My Account -->
          <div v-if="activeTab === 'account'" class="space-y-5">

            <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-4">
              <h2 class="text-base font-bold text-brand-text-primary flex items-center gap-2">
                <Icon name="mdi:account-edit-outline" class="w-5 h-5 text-brand-primary" />
                {{ t('dashboard.account.editProfile') }}
              </h2>

              <div v-if="profileSuccess" class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-xs font-semibold text-green-700">
                <Icon name="mdi:check-circle" class="w-4 h-4 shrink-0" />
                {{ t('dashboard.account.profileUpdated') }}
              </div>

              <form class="space-y-4" @submit.prevent="saveProfile">
                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.fullName') }}</label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    required
                    :placeholder="t('dashboard.account.fullNamePlaceholder')"
                    class="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                    :class="profileErrors.name ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-primary'"
                  />
                  <p v-if="profileErrors.name" class="mt-1 text-xs text-red-500">{{ profileErrors.name[0] }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.emailAddress') }}</label>
                  <input
                    :value="user?.email"
                    type="email"
                    disabled
                    class="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-brand-surface text-sm text-brand-text-muted cursor-not-allowed"
                  />
                  <p class="mt-1 text-xs text-brand-text-muted">{{ t('dashboard.account.emailCannotChange') }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.phoneNumber') }}</label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    :placeholder="t('dashboard.account.phonePlaceholder')"
                    class="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                    :class="profileErrors.phone ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-primary'"
                  />
                  <p v-if="profileErrors.phone" class="mt-1 text-xs text-red-500">{{ profileErrors.phone[0] }}</p>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon v-if="loading" name="mdi:loading" class="w-4 h-4 animate-spin" />
                  <span>{{ loading ? t('dashboard.account.saving') : t('dashboard.account.saveChanges') }}</span>
                </button>
              </form>
            </div>

            <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-4">
              <h2 class="text-base font-bold text-brand-text-primary flex items-center gap-2">
                <Icon name="mdi:lock-outline" class="w-5 h-5 text-brand-primary" />
                {{ t('dashboard.account.changePassword') }}
              </h2>

              <div v-if="passwordSuccess" class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-xs font-semibold text-green-700">
                <Icon name="mdi:check-circle" class="w-4 h-4 shrink-0" />
                {{ t('dashboard.account.passwordChanged') }}
              </div>

              <form class="space-y-4" @submit.prevent="savePassword">
                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.currentPassword') }}</label>
                  <div class="relative">
                    <input
                      v-model="passwordForm.current_password"
                      :type="showCurrentPw ? 'text' : 'password'"
                      required
                      placeholder="••••••••"
                      class="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors pr-10"
                      :class="passwordErrors.current_password ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-primary'"
                    />
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary" @click="showCurrentPw = !showCurrentPw">
                      <Icon :name="showCurrentPw ? 'mdi:eye-off' : 'mdi:eye'" class="w-4 h-4" />
                    </button>
                  </div>
                  <p v-if="passwordErrors.current_password" class="mt-1 text-xs text-red-500">{{ passwordErrors.current_password[0] }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.newPassword') }}</label>
                  <div class="relative">
                    <input
                      v-model="passwordForm.password"
                      :type="showNewPw ? 'text' : 'password'"
                      required
                      minlength="8"
                      :placeholder="t('dashboard.account.newPasswordPlaceholder')"
                      class="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors pr-10"
                      :class="passwordErrors.password ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-primary'"
                    />
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary" @click="showNewPw = !showNewPw">
                      <Icon :name="showNewPw ? 'mdi:eye-off' : 'mdi:eye'" class="w-4 h-4" />
                    </button>
                  </div>
                  <p v-if="passwordErrors.password" class="mt-1 text-xs text-red-500">{{ passwordErrors.password[0] }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">{{ t('dashboard.account.confirmNewPassword') }}</label>
                  <input
                    v-model="passwordForm.password_confirmation"
                    type="password"
                    required
                    :placeholder="t('dashboard.account.confirmNewPasswordPlaceholder')"
                    class="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                    :class="passwordErrors.password_confirmation ? 'border-red-400 bg-red-50' : 'border-brand-border focus:border-brand-primary'"
                  />
                  <p v-if="passwordErrors.password_confirmation" class="mt-1 text-xs text-red-500">{{ passwordErrors.password_confirmation[0] }}</p>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon v-if="loading" name="mdi:loading" class="w-4 h-4 animate-spin" />
                  <span>{{ loading ? t('dashboard.account.updating') : t('dashboard.account.updatePassword') }}</span>
                </button>
              </form>
            </div>

          </div>

          <!-- My Orders -->
          <div v-if="activeTab === 'orders'" class="space-y-5">

            <!-- Hosting Orders -->
            <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-4">
              <h2 class="text-base font-bold text-brand-text-primary flex items-center gap-2">
                <Icon name="mdi:server-network" class="w-5 h-5 text-brand-primary" />
                {{ t('dashboard.orders.hostingOrders') }}
              </h2>
              <div v-if="!displayOrders.length" class="py-8 text-center">
                <Icon name="mdi:inbox-outline" class="w-10 h-10 text-brand-text-muted mx-auto mb-2" />
                <p class="text-sm font-semibold text-brand-text-secondary">{{ t('dashboard.orders.noOrders') }}</p>
                <p class="text-xs text-brand-text-muted mt-1">{{ t('dashboard.orders.noOrdersHint') }}</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="order in displayOrders"
                  :key="order.orderId"
                  class="p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-brand-text-primary">{{ order.orderId }}</p>
                      <p class="text-xs text-brand-text-secondary mt-0.5">{{ order.domain }} · {{ order.plan }}</p>
                      <p class="text-xs text-brand-text-muted mt-0.5">
                        {{ new Date(order.orderedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                      </p>
                    </div>
                    <div class="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <p class="text-sm font-bold text-brand-primary">৳{{ order.price.toLocaleString() }}</p>
                      <p class="text-xs text-brand-text-muted capitalize">{{ order.payMethod }}</p>
                      <span
                        v-if="order.status"
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border"
                        :class="{
                          'bg-yellow-50 text-yellow-700 border-yellow-200': order.status === 'pending',
                          'bg-blue-50 text-blue-700 border-blue-200': order.status === 'verified',
                          'bg-green-50 text-green-700 border-green-200': order.status === 'active',
                          'bg-gray-50 text-gray-500 border-gray-200': order.status === 'expired',
                          'bg-red-50 text-red-600 border-red-200': order.status === 'cancelled',
                        }"
                      >{{ order.status }}</span>
                    </div>
                  </div>
                  <button
                    class="mt-3 text-xs font-semibold text-brand-primary hover:underline"
                    @click="trackId = order.orderId; activeTab = 'track'; checkOrderStatus()"
                  >
                    {{ t('dashboard.orders.trackThisOrder') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Invoices from admin -->
            <div class="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-4">
              <h2 class="text-base font-bold text-brand-text-primary flex items-center gap-2">
                <Icon name="mdi:file-document-outline" class="w-5 h-5 text-brand-primary" />
                {{ t('dashboard.orders.invoices') }}
              </h2>

              <div v-if="invoicesLoading" class="py-8 flex items-center justify-center gap-2 text-brand-text-muted text-sm">
                <Icon name="mdi:loading" class="w-5 h-5 animate-spin" />
                {{ t('dashboard.orders.loadingInvoices') }}
              </div>

              <div v-else-if="!invoices.length" class="py-8 text-center">
                <Icon name="mdi:file-outline" class="w-10 h-10 text-brand-text-muted mx-auto mb-2" />
                <p class="text-sm font-semibold text-brand-text-secondary">{{ t('dashboard.orders.noInvoices') }}</p>
                <p class="text-xs text-brand-text-muted mt-1">{{ t('dashboard.orders.noInvoicesHint') }}</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="inv in invoices"
                  :key="inv.invoice_number"
                  class="p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-xs font-mono font-bold text-brand-text-primary">{{ inv.invoice_number }}</p>
                      <p class="text-xs text-brand-text-secondary mt-0.5">
                        {{ inv.services?.map((s: any) => s.name).join(', ') }}
                      </p>
                      <p class="text-xs text-brand-text-muted mt-0.5">
                        {{ inv.issued_at ? new Date(inv.issued_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '' }}
                        · {{ inv.pay_label }}
                      </p>
                    </div>
                    <div class="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <p class="text-sm font-bold text-brand-primary">৳{{ inv.total_amount.toLocaleString() }}</p>
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border"
                        :class="{
                          'bg-green-50 text-green-700 border-green-200': inv.status === 'paid',
                          'bg-yellow-50 text-yellow-700 border-yellow-200': inv.status === 'pending',
                          'bg-blue-50 text-blue-700 border-blue-200': inv.status === 'partial',
                        }"
                      >{{ inv.status }}</span>
                    </div>
                  </div>
                  <button
                    :disabled="invoiceDownloading === inv.invoice_number"
                    class="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="downloadInvoice(inv.invoice_number)"
                  >
                    <Icon
                      :name="invoiceDownloading === inv.invoice_number ? 'mdi:loading' : 'mdi:download'"
                      class="w-3.5 h-3.5"
                      :class="invoiceDownloading === inv.invoice_number ? 'animate-spin' : ''"
                    />
                    {{ invoiceDownloading === inv.invoice_number ? t('dashboard.orders.downloading') : t('dashboard.orders.downloadPdf') }}
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Track Order -->
          <div v-if="activeTab === 'track'" class="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-5">
            <h2 class="text-base font-bold text-brand-text-primary flex items-center gap-2">
              <Icon name="mdi:map-marker-path" class="w-5 h-5 text-brand-primary" />
              {{ t('dashboard.track.heading') }}
            </h2>

            <div class="flex gap-2">
              <input
                v-model="trackId"
                type="text"
                :placeholder="t('dashboard.track.placeholder')"
                class="flex-1 px-4 py-2.5 rounded-lg border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                @keyup.enter="checkOrderStatus"
              />
              <button
                :disabled="trackLoading || !trackId.trim()"
                class="px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                @click="checkOrderStatus"
              >
                <Icon v-if="trackLoading" name="mdi:loading" class="w-4 h-4 animate-spin" />
                <span v-else>{{ t('dashboard.track.check') }}</span>
              </button>
            </div>

            <p v-if="trackError" class="text-xs text-red-500 flex items-center gap-1.5">
              <Icon name="mdi:alert-circle-outline" class="w-3.5 h-3.5 shrink-0" />
              {{ trackError }}
            </p>

            <div v-if="trackResult" class="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.orderId') }}</span>
                <span class="text-sm font-bold text-brand-text-primary">{{ trackResult.order_id || trackResult.id }}</span>
              </div>
              <div v-if="trackResult.plan" class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.plan') }}</span>
                <span class="text-sm font-semibold text-brand-text-primary capitalize">{{ trackResult.plan }}</span>
              </div>
              <div v-if="trackResult.domain" class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.domain') }}</span>
                <span class="text-sm font-semibold text-brand-text-primary">{{ trackResult.domain }}</span>
              </div>
              <div v-if="trackResult.billing" class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.billing') }}</span>
                <span class="text-sm font-semibold text-brand-text-primary capitalize">{{ trackResult.billing }}</span>
              </div>
              <div v-if="trackResult.price" class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.price') }}</span>
                <span class="text-sm font-bold text-brand-primary">৳{{ trackResult.price }}</span>
              </div>
              <div v-if="trackResult.status" class="flex items-center justify-between">
                <span class="text-xs font-semibold text-brand-text-muted">{{ t('dashboard.track.status') }}</span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize"
                  :class="statusStyle[trackResult.status] || 'bg-gray-100 text-gray-700 border-gray-200'"
                >
                  {{ trackResult.status }}
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>
