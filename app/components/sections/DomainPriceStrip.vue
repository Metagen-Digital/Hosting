<script setup lang="ts">
const FALLBACK = [
  { tld: '.com',    price: 2400 },
  { tld: '.net',    price: 2500 },
  { tld: '.org',    price: 2400 },
  { tld: '.info',   price: 3300 },
  { tld: '.xyz',    price: 2200 },
  { tld: '.store',  price: 6000 },
  { tld: '.shop',   price: 3900 },
  { tld: '.online', price: 3200 },
  { tld: '.site',   price: 3800 },
  { tld: '.tech',   price: 5000 },
]

const config = useRuntimeConfig()
const { data } = useAsyncData('domain-prices', () =>
  $fetch<Record<string, number>>(`${config.public.backendUrl}/api/domain-prices`).catch(() => null)
)

const prices = computed(() => {
  if (!data.value || !Object.keys(data.value).length) return FALLBACK
  return Object.entries(data.value).map(([tld, price]) => ({ tld, price }))
})

const doubled = computed(() => [...prices.value, ...prices.value])
</script>

<template>
  <div class="bg-brand-primary border-y border-brand-primary/20 py-3 overflow-hidden select-none">
    <div class="flex animate-marquee w-max" aria-hidden="true">
      <div
        v-for="(item, i) in doubled"
        :key="i"
        class="flex items-center gap-2 px-6 whitespace-nowrap"
      >
        <span class="font-mono font-bold text-white text-sm">{{ item.tld }}</span>
        <span class="text-white/50 text-xs">—</span>
        <span class="text-white/80 text-sm">৳{{ item.price.toLocaleString('en-IN') }}/yr</span>
        <span class="w-1 h-1 rounded-full bg-white/30 ml-4" />
      </div>
    </div>
  </div>
</template>
