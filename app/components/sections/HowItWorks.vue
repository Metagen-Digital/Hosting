<script setup lang="ts">
const steps = [
  {
    num: '01',
    icon: 'mdi:magnify',
    title: 'Domain Search করুন',
    desc: 'উপরের search box এ আপনার পছন্দের domain name লিখুন এবং availability check করুন।',
    color: 'text-brand-primary',
    bg: 'bg-brand-surface',
    border: 'border-brand-primary/20',
  },
  {
    num: '02',
    icon: 'mdi:package-variant',
    title: 'Plan বেছে নিন',
    desc: 'আপনার budget ও প্রয়োজন অনুযায়ী Starter, Business বা Enterprise plan select করুন।',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10',
    border: 'border-brand-orange/20',
  },
  {
    num: '03',
    icon: 'mdi:cellphone-nfc',
    title: 'Payment করুন',
    desc: 'bKash, Nagad, Rocket বা Upay তে payment করুন এবং Transaction ID জমা দিন।',
    color: 'text-brand-success',
    bg: 'bg-brand-success/10',
    border: 'border-brand-success/20',
  },
  {
    num: '04',
    icon: 'mdi:rocket-launch',
    title: 'Site Live করুন',
    desc: '২৪ ঘণ্টার মধ্যে আপনার hosting setup হবে — আমরা helpline থেকে call করব।',
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    border: 'border-brand-purple/20',
  },
]
</script>

<template>
  <section id="how" class="section-pad bg-white">
    <div class="container-content">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
          <Icon name="mdi:list-status" class="w-3.5 h-3.5" aria-hidden="true" />
          How It Works
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          মাত্র <span class="text-gradient-orange">৪ টি Step</span> এ শুরু করুন
        </h2>
        <p class="text-brand-text-secondary text-lg">
          কোনো technical জ্ঞান ছাড়াই — আমরা সব কিছু setup করে দেব।
        </p>
      </div>

      <!-- Steps -->
      <div class="relative">
        <!-- Connector line (desktop) -->
        <div class="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-primary/20 via-brand-orange/30 to-brand-purple/20" aria-hidden="true" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          <div
            v-for="(step, i) in steps"
            :key="step.num"
            class="flex flex-col items-center text-center group"
          >
            <!-- Step circle -->
            <div
              class="relative w-16 h-16 rounded-full border-2 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-card bg-white z-10"
              :class="[step.border]"
            >
              <Icon :name="step.icon" class="w-7 h-7" :class="step.color" aria-hidden="true" />
              <span
                class="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                :class="i === 0 ? 'bg-brand-primary' : i === 1 ? 'bg-brand-orange' : i === 2 ? 'bg-brand-success' : 'bg-brand-purple'"
              >
                {{ i + 1 }}
              </span>
            </div>

            <h3 class="font-semibold text-brand-primary mb-2">{{ step.title }}</h3>
            <p class="text-brand-text-secondary text-sm leading-relaxed max-w-[200px]">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/order"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-btn bg-gradient-brand text-white font-semibold text-base hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250"
        >
          <Icon name="mdi:rocket-launch" class="w-5 h-5" aria-hidden="true" />
          এখনই শুরু করুন
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
