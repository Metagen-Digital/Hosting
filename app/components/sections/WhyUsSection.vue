<script setup lang="ts">
const features = [
  {
    icon: 'mdi:server-network',
    color: 'text-brand-primary',
    bg: 'bg-brand-surface',
    title: 'Verpex Infrastructure',
    desc: 'World-class server infrastructure — 99.9% uptime SLA গ্যারান্টি সহ।',
  },
  {
    icon: 'mdi:shield-lock',
    color: 'text-brand-success',
    bg: 'bg-brand-success/10',
    title: 'Free SSL সবসময়',
    desc: 'Let\'s Encrypt auto-renewal — HTTPS আপনার site সবসময় secure রাখবে।',
  },
  {
    icon: 'mdi:lightning-bolt',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10',
    title: '২৪ ঘণ্টায় Setup',
    desc: 'Order confirm হলে ২৪ ঘণ্টার মধ্যে আপনার hosting ready — helpline থেকে call।',
  },
  {
    icon: 'mdi:headset',
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    title: 'বাংলায় Support',
    desc: 'Local Bangladeshi team — বাংলায় সাহায্য পান যেকোনো সমস্যায়।',
  },
  {
    icon: 'mdi:credit-card',
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10',
    title: 'Mobile Payment',
    desc: 'bKash, Nagad, Rocket, Upay — যেকোনো MFS দিয়ে সহজেই payment করুন।',
  },
  {
    icon: 'mdi:backup-restore',
    color: 'text-brand-primary',
    bg: 'bg-brand-surface',
    title: 'Daily Backup',
    desc: 'প্রতিদিন automatic backup — আপনার data সবসময় নিরাপদ।',
  },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '২৪ঘণ্টা', label: 'Setup Guarantee' },
  { value: '৳৩৯৯', label: 'থেকে শুরু' },
  { value: '100%', label: 'Secure' },
]
</script>

<template>
  <section class="section-pad bg-brand-surface">
    <div class="container-content">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
          <Icon name="mdi:thumb-up" class="w-3.5 h-3.5" aria-hidden="true" />
          Why MetaGen Hosting
        </span>
        <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
          কেন আমাদের বেছে নেবেন?
        </h2>
        <p class="text-brand-text-secondary text-lg">
          আমরা শুধু hosting বিক্রি করি না — আপনার business কে online এ grow করতে সাহায্য করি।
        </p>
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-6 rounded-2xl bg-white border border-brand-border shadow-card"
        >
          <p class="font-display font-extrabold text-3xl text-brand-primary mb-1">{{ stat.value }}</p>
          <p class="text-brand-text-muted text-sm">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Feature grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feat in features"
          :key="feat.title"
          class="group p-6 rounded-2xl bg-white border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-250"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-250 group-hover:scale-110"
            :class="feat.bg"
          >
            <Icon :name="feat.icon" class="w-6 h-6" :class="feat.color" aria-hidden="true" />
          </div>
          <h3 class="font-semibold text-brand-primary mb-2">{{ feat.title }}</h3>
          <p class="text-brand-text-secondary text-sm leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
