<script setup lang="ts">
useSeoMeta({ title: 'Order Received — MetaGen Hosting', robots: 'noindex' })

const { t, tm, rt } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()
const orderStore = useOrderStore()

const order = computed(() => orderStore.value)

const nextSteps = computed(() => {
  const steps = tm('thankyou.steps') as unknown[]
  return steps.map(s => rt(s as any))
})

const payLabel: Record<string, string> = {
  bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', upay: 'Upay',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-BD', { day: '2-digit', month: 'long', year: 'numeric' })
  const time = d.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })
  return { date, time }
}

async function downloadInvoice() {
  if (!order.value) return
  const { jsPDF }   = await import('jspdf')
  const QRCode      = await import('qrcode')

  // A4: 210 x 297 mm
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const o    = order.value
  const PW   = 210
  const PH   = 297
  const ML   = 14
  const MR   = 196

  // ── Colors ───────────────────────────────────────────
  const navy   = [29, 29, 71]    as [number, number, number]
  const dark   = [20, 20, 50]    as [number, number, number]
  const gray   = [100, 116, 139] as [number, number, number]
  const silver = [180, 185, 220] as [number, number, number]
  const light  = [240, 242, 255] as [number, number, number]
  const accent = [48, 60, 142]   as [number, number, number]
  const white  = [255, 255, 255] as [number, number, number]

  // ── Helpers ──────────────────────────────────────────
  const fmt = (n: number) => n.toLocaleString('en-US') + ' /-'

  // ── Load logo ─────────────────────────────────────────
  let logoDataUrl: string | null = null
  try {
    const res  = await fetch('/images/logo/logo60x16mm.png')
    const blob = await res.blob()
    logoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch { /* fallback to text */ }

  // ── Generate QR code — dynamic base URL (works on localhost too) ──
  const baseUrl   = typeof window !== 'undefined' ? window.location.origin : 'https://hosting.metagendigital.com'
  const statusUrl = `${baseUrl}/status/${o.orderId}`
  let qrDataUrl: string | null = null
  try {
    qrDataUrl = await QRCode.default.toDataURL(statusUrl, {
      width: 200, margin: 1,
      color: { dark: '#1D1D47', light: '#ffffff' },
    })
  } catch { /* skip QR if failed */ }

  // ════════════════════════════════════════════════════
  // HEADER  (0 → 56 mm)
  // ════════════════════════════════════════════════════
  doc.setFillColor(...navy)
  doc.rect(0, 0, PW, 56, 'F')

  // Logo top-left
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', ML, 7, 56, 14)
  } else {
    doc.setTextColor(...white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(17)
    doc.text('MetaGenDigital', ML, 18)
  }

  // Contact info — label: value format, indented 2mm
  doc.setFontSize(7.8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...silver)
  const cx = ML + 2
  const lx = cx + 12   // value starts after label

  // Phone:
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(210, 215, 240)
  doc.text('Phone:', cx, 28)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...silver)
  doc.text('+88 01970-222573', lx, 28)

  // Email:
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(210, 215, 240)
  doc.text('Email:', cx, 35)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...silver)
  doc.text('hosting@metagendigital.com', lx, 35)

  // Web:
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(210, 215, 240)
  doc.text('Web:', cx, 42)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...silver)
  doc.text('metagendigital.com', lx, 42)

  // INVOICE — right side
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(...white)
  doc.text('INVOICE', MR, 18, { align: 'right' })

  const { date, time } = formatDateTime(o.orderedAt)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...silver)
  doc.text(`Order :  ${o.orderId}`, MR, 28, { align: 'right' })
  doc.text(`Date  :  ${date}`,      MR, 35, { align: 'right' })
  doc.text(`Time  :  ${time}`,      MR, 42, { align: 'right' })

  // ════════════════════════════════════════════════════
  // BILLED TO + QR  (60 → 115 mm)
  // ════════════════════════════════════════════════════
  const billedY = 64
  // Left: customer info
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...silver)
  doc.text('BILLED TO', ML, billedY)
  doc.setDrawColor(...accent)
  doc.setLineWidth(0.4)
  doc.line(ML, billedY + 1, ML + 26, billedY + 1)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...dark)
  doc.text(o.fullName, ML, billedY + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  const customerLines = [o.companyName, o.phone, o.email, o.address].filter(Boolean) as string[]
  let cy2 = billedY + 16
  customerLines.forEach(line => { doc.text(line, ML, cy2); cy2 += 5.5 })

  // Right: QR code + label
  const QR_X = 145
  const QR_Y = billedY - 2
  const QR_S = 38

  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', QR_X, QR_Y, QR_S, QR_S)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...accent)
    doc.text('Scan to check hosting status', QR_X + QR_S / 2, QR_Y + QR_S + 4, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...gray)
    doc.text(o.orderId, QR_X + QR_S / 2, QR_Y + QR_S + 8.5, { align: 'center' })
  }

  // ════════════════════════════════════════════════════
  // ITEMS TABLE  (y = 116)
  // ════════════════════════════════════════════════════
  let y = 116
  const AMT_X = MR - 4   // amount column x — slightly left of margin

  // Table header
  doc.setFillColor(...navy)
  doc.rect(ML, y, PW - ML * 2, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...white)
  doc.text('Description',  ML + 3,   y + 6)
  doc.text('Details',      ML + 88,  y + 6)
  doc.text('Amount (BDT)', AMT_X,    y + 6, { align: 'right' })
  y += 9

  // Pricing rows
  const DOMAIN_FEE   = o.domainName ? 2000 : 0
  const hostingPrice = o.price - DOMAIN_FEE

  type ItemRow = { desc: string; detail: string; amount: number | null; shade: boolean }
  const itemRows: ItemRow[] = [
    { desc: `Hosting — ${o.plan}`, detail: o.billing === 'yearly' ? 'Yearly Plan' : 'Monthly Plan', amount: hostingPrice, shade: false },
  ]
  if (o.domainName) {
    itemRows.push({ desc: 'Domain Registration', detail: o.domainName, amount: DOMAIN_FEE, shade: true })
  }

  doc.setFontSize(9)
  itemRows.forEach(row => {
    if (row.shade) { doc.setFillColor(...light); doc.rect(ML, y, PW - ML * 2, 10, 'F') }
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    doc.text(row.desc,   ML + 3,  y + 7)
    doc.setTextColor(...gray)
    doc.text(row.detail, ML + 88, y + 7)
    if (row.amount !== null) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...accent)
      doc.text(fmt(row.amount), AMT_X, y + 7, { align: 'right' })
    }
    y += 10
  })

  // Divider
  doc.setDrawColor(220, 224, 245)
  doc.setLineWidth(0.3)
  doc.line(ML, y, MR, y)
  y += 2

  // TOTAL row
  doc.setFillColor(...navy)
  doc.rect(ML, y, PW - ML * 2, 12, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...white)
  doc.text('TOTAL PAID', ML + 3, y + 8)
  doc.text(`BDT  ${fmt(o.price)}`, AMT_X, y + 8, { align: 'right' })
  y += 12

  // ════════════════════════════════════════════════════
  // PAYMENT INFO
  // ════════════════════════════════════════════════════
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...silver)
  doc.text('PAYMENT INFORMATION', ML, y)
  doc.setDrawColor(...accent)
  doc.setLineWidth(0.4)
  doc.line(ML, y + 1, ML + 52, y + 1)
  y += 8

  doc.setFillColor(...light)
  doc.rect(ML, y, PW - ML * 2, 36, 'F')

  const pRows: [string, string][] = [
    ['Payment Method', payLabel[o.payMethod] || o.payMethod],
    ['Transaction ID', o.txId],
    ['Paid From',      o.sendFrom],
    ['Status',         'Pending Verification'],
  ]
  let py = y + 8
  doc.setFontSize(9)
  pRows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...dark)
    doc.text(label + ' :', ML + 3, py)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...gray)
    doc.text(val, ML + 48, py)
    py += 7
  })

  // ════════════════════════════════════════════════════
  // FOOTER — pinned at bottom of A4
  // ════════════════════════════════════════════════════
  const FY = PH - 26
  doc.setFillColor(...navy)
  doc.rect(0, FY, PW, PH - FY, 'F')
  doc.setDrawColor(...accent)
  doc.setLineWidth(0.8)
  doc.line(0, FY, PW, FY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...white)
  doc.text('Thank you for choosing MetaGenDigital Hosting!', PW / 2, FY + 8, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...silver)
  doc.text('Payment will be verified and hosting activated within 24 hours.', PW / 2, FY + 15, { align: 'center' })

  // Bottom copyright line
  const currentYear = new Date().getFullYear()
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(160, 165, 210)
  doc.text(
    `\u00A9 ${currentYear} hosting.metagendigital.com  |  hosting@metagendigital.com  |  +88 01970-222573`,
    PW / 2, FY + 22, { align: 'center' }
  )

  doc.save(`MetaGen-Invoice-${o.orderId}.pdf`)
}
</script>

<template>
  <div class="min-h-screen bg-brand-surface flex items-center justify-center py-16 px-4">
    <div class="max-w-xl w-full text-center">
      <!-- Animated checkmark -->
      <div class="relative w-28 h-28 mx-auto mb-8">
        <div class="absolute inset-0 rounded-full bg-brand-success/10 animate-pulse-glow" />
        <div class="relative w-28 h-28 rounded-full bg-white border-4 border-brand-success flex items-center justify-center shadow-card">
          <Icon name="mdi:check-bold" class="w-14 h-14 text-brand-success" aria-hidden="true" />
        </div>
      </div>

      <!-- Main card -->
      <div class="bg-white rounded-2xl border border-brand-border shadow-card p-8 mb-6 text-left">
        <div class="text-center mb-6">
          <p class="inline-block px-3 py-1 rounded-full bg-brand-success/10 text-brand-success text-xs font-bold uppercase tracking-wider mb-3">
            {{ t('thankyou.badge') }}
          </p>
          <h1 class="font-display font-extrabold text-3xl text-brand-primary mb-2">
            {{ t('thankyou.heading') }}
          </h1>
          <p class="text-brand-text-secondary text-sm leading-relaxed">
            {{ t('thankyou.body', { hours: t('thankyou.hours') }) }}
          </p>
        </div>

        <!-- Order ID -->
        <div class="p-4 rounded-xl bg-brand-surface border border-brand-border mb-5 text-center">
          <p class="text-xs text-brand-text-muted mb-1">{{ t('thankyou.orderId') }}</p>
          <p class="font-mono font-bold text-2xl text-brand-primary">{{ order?.orderId ?? '—' }}</p>
          <p class="text-xs text-brand-text-muted mt-1">{{ t('thankyou.saveId') }}</p>
        </div>

        <!-- Order Summary (if data available) -->
        <template v-if="order">
          <div class="rounded-xl border border-brand-border overflow-hidden mb-5">
            <div class="bg-brand-primary px-4 py-2">
              <p class="text-xs font-bold text-white uppercase tracking-wider">Order Summary</p>
            </div>
            <div class="divide-y divide-brand-border text-sm">
              <div class="flex justify-between px-4 py-2.5">
                <span class="text-brand-text-muted">Customer</span>
                <span class="font-semibold text-brand-primary">{{ order.fullName }}</span>
              </div>
              <div v-if="order.domainName" class="flex justify-between px-4 py-2.5">
                <span class="text-brand-text-muted">Domain</span>
                <span class="font-mono text-brand-primary">{{ order.domainName }}</span>
              </div>
              <div class="flex justify-between px-4 py-2.5">
                <span class="text-brand-text-muted">Plan</span>
                <span class="font-semibold text-brand-primary">{{ order.plan }} — {{ order.billing === 'yearly' ? 'Yearly' : 'Monthly' }}</span>
              </div>
              <div class="flex justify-between px-4 py-2.5">
                <span class="text-brand-text-muted">Payment</span>
                <span class="font-semibold text-brand-primary capitalize">{{ order.payMethod }} · TxID: {{ order.txId }}</span>
              </div>
              <div class="flex justify-between px-4 py-2.5 bg-brand-surface">
                <span class="text-brand-text-muted font-semibold">Total Paid</span>
                <span class="font-display font-extrabold text-lg text-brand-primary">৳{{ order.price.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- What happens next -->
        <div class="space-y-3">
          <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">{{ t('thankyou.next') }}</p>
          <div v-for="(step, i) in nextSteps" :key="i" class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{{ i + 1 }}</span>
            <p class="text-sm text-brand-text-secondary">{{ step }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-row gap-2 justify-center flex-wrap">
        <NuxtLink
          :to="localePath('/')"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn border-2 border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all duration-250 whitespace-nowrap"
        >
          <Icon name="mdi:home" class="w-4 h-4" aria-hidden="true" />
          {{ t('thankyou.home') }}
        </NuxtLink>

        <!-- PDF Download -->
        <button
          v-if="order"
          type="button"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn bg-brand-success text-white text-sm font-semibold hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-250 whitespace-nowrap"
          @click="downloadInvoice"
        >
          <Icon name="mdi:file-pdf-box" class="w-4 h-4" aria-hidden="true" />
          Invoice PDF
        </button>

        <!-- Track Status -->
        <NuxtLink
          :to="localePath('/status')"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn bg-brand-purple text-white text-sm font-semibold hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-250 whitespace-nowrap"
        >
          <Icon name="mdi:qrcode-scan" class="w-4 h-4" aria-hidden="true" />
          {{ t('thankyou.trackStatus') }}
        </NuxtLink>

        <a
          href="tel:+8801915557363"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn bg-gradient-brand text-white text-sm font-semibold hover:shadow-glow-primary hover:scale-105 transition-all duration-250 whitespace-nowrap"
        >
          <Icon name="mdi:phone" class="w-4 h-4" aria-hidden="true" />
          01915557363
        </a>
      </div>

      <p class="text-xs text-brand-text-muted mt-6">
        {{ t('thankyou.emailNote') }}
        <a href="mailto:hosting@metagendigital.com" class="text-brand-primary hover:underline">hosting@metagendigital.com</a>
      </p>
    </div>
  </div>
</template>
