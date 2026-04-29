<script setup lang="ts">
const prices = [
  { tld: '.com',    price: '৳২,০০০' },
  { tld: '.net',    price: '৳২,৫০০' },
  { tld: '.org',    price: '৳২,২০০' },
  { tld: '.info',   price: '৳১,৮০০' },
  { tld: '.xyz',    price: '৳১,২০০' },
  { tld: '.store',  price: '৳২,৮০০' },
  { tld: '.shop',   price: '৳৩,০০০' },
  { tld: '.online', price: '৳১,৫০০' },
  { tld: '.site',   price: '৳২,২০০' },
  { tld: '.tech',   price: '৳৩,৫০০' },
]
const doubled = [...prices, ...prices]
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
        <span class="text-white/80 text-sm">{{ item.price }}/yr</span>
        <span class="w-1 h-1 rounded-full bg-white/30 ml-4" />
      </div>
    </div>
  </div>
</template>
