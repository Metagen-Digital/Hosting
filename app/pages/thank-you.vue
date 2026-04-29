<script setup lang="ts">
useSeoMeta({ title: 'Order Received — MetaGen Hosting', robots: 'noindex' })

const nextSteps = [
  'আমরা আপনার payment টি verify করব (সাধারণত কয়েক ঘণ্টার মধ্যে)।',
  'Payment confirm হলে আপনার hosting সম্পূর্ণ setup করা হবে।',
  'Setup complete হলে আমাদের helpline থেকে আপনার দেওয়া নম্বরে call করা হবে।',
  'cPanel login credentials আপনার email এ পাঠানো হবে।',
]

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
let id = 'MGD-'
for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
const orderId = id
</script>

<template>
  <div class="min-h-screen bg-brand-surface flex items-center justify-center py-16 px-4">
    <div class="max-w-lg w-full text-center">
      <!-- Animated checkmark -->
      <div class="relative w-28 h-28 mx-auto mb-8">
        <div class="absolute inset-0 rounded-full bg-brand-success/10 animate-pulse-glow" />
        <div class="relative w-28 h-28 rounded-full bg-white border-4 border-brand-success flex items-center justify-center shadow-card">
          <Icon name="mdi:check-bold" class="w-14 h-14 text-brand-success" aria-hidden="true" />
        </div>
      </div>

      <!-- Text -->
      <div class="bg-white rounded-2xl border border-brand-border shadow-card p-8 mb-6">
        <p class="inline-block px-3 py-1 rounded-full bg-brand-success/10 text-brand-success text-xs font-bold uppercase tracking-wider mb-4">
          Order Received
        </p>
        <h1 class="font-display font-extrabold text-3xl text-brand-primary mb-3">
          ধন্যবাদ! 🎉
        </h1>
        <p class="text-brand-text-secondary text-base leading-relaxed mb-6">
          আপনার Order সফলভাবে পাঠানো হয়েছে।
          আমরা payment verify করব এবং
          <strong class="text-brand-primary">২৪ ঘণ্টার মধ্যে</strong>
          আপনার domain ও hosting setup করে দেব।
        </p>

        <!-- Order ID -->
        <div class="p-4 rounded-xl bg-brand-surface border border-brand-border mb-6">
          <p class="text-xs text-brand-text-muted mb-1">Order Reference</p>
          <p class="font-mono font-bold text-xl text-brand-primary">{{ orderId }}</p>
          <p class="text-xs text-brand-text-muted mt-1">এই ID টি সংরক্ষণ করুন</p>
        </div>

        <!-- What happens next -->
        <div class="text-left space-y-3">
          <p class="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-3">পরবর্তী পদক্ষেপ</p>
          <div v-for="(step, i) in nextSteps" :key="i" class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{{ i + 1 }}</span>
            <p class="text-sm text-brand-text-secondary">{{ step }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn border-2 border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition-all duration-250"
        >
          <Icon name="mdi:home" class="w-4 h-4" aria-hidden="true" />
          Home এ ফিরুন
        </NuxtLink>
        <a
          href="tel:+8801970222573"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn bg-gradient-brand text-white font-semibold hover:shadow-glow-primary hover:scale-105 transition-all duration-250"
        >
          <Icon name="mdi:phone" class="w-4 h-4" aria-hidden="true" />
          01970-222573
        </a>
      </div>

      <p class="text-xs text-brand-text-muted mt-6">
        কোনো সমস্যা হলে email করুন:
        <a href="mailto:hello@metagendigital.com" class="text-brand-primary hover:underline">hello@metagendigital.com</a>
      </p>
    </div>
  </div>
</template>
