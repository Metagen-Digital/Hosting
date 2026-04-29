<script setup lang="ts">
const faqs = [
  {
    q: 'Domain registration কত দিনে হয়?',
    a: 'Payment confirm হওয়ার পর সাধারণত ২৪ ঘণ্টার মধ্যে আপনার domain ও hosting সম্পূর্ণ setup করা হয়। আমাদের helpline থেকে আপনাকে call করে জানানো হবে।',
  },
  {
    q: 'কোন payment method accept করা হয়?',
    a: 'বর্তমানে bKash, Nagad, Rocket এবং Upay এ payment গ্রহণ করা হয়। Personal number 01915557363 এ Send Money করতে হবে এবং Transaction ID form এ submit করতে হবে।',
  },
  {
    q: 'কতদিনের জন্য hosting কিনতে পারব?',
    a: 'Monthly বা Yearly দুইভাবেই নিতে পারবেন। Yearly নিলে প্রায় ২০% সাশ্রয় হয় এবং ১ বছরের জন্য Free Domain পাবেন।',
  },
  {
    q: 'আমার কি technical জ্ঞান দরকার?',
    a: 'না! আমরা সব setup করে দেব। cPanel access দেওয়া হবে এবং যেকোনো সমস্যায় আমাদের support team সাহায্য করবে।',
  },
  {
    q: 'SSL Certificate কি আলাদা কিনতে হবে?',
    a: 'না, সব plan এ Free SSL (Let\'s Encrypt) দেওয়া হয় যা auto-renewal হয়। আপনার site সবসময় HTTPS এ থাকবে।',
  },
  {
    q: 'Hosting renewal কীভাবে করব?',
    a: 'Hosting expire হওয়ার আগে আমরা আপনাকে email ও phone এ remind করব। একই payment process এ renewal করা যাবে।',
  },
  {
    q: 'পরে কি plan upgrade করতে পারব?',
    a: 'হ্যাঁ, যেকোনো সময় plan upgrade করা যাবে। Upgrade করলে বাকি দিনের proportional charge নেওয়া হবে।',
  },
  {
    q: 'WHMCS বা cPanel access পাব?',
    a: 'cPanel access পাবেন। এখন manual process এ কাজ করছি — ভবিষ্যতে WHMCS client portal চালু হবে যেখানে নিজেই সব manage করতে পারবেন।',
  },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="section-pad bg-brand-surface">
    <div class="container-content">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
            <Icon name="mdi:frequently-asked-questions" class="w-3.5 h-3.5" aria-hidden="true" />
            FAQ
          </span>
          <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
            সাধারণ জিজ্ঞাসা
          </h2>
          <p class="text-brand-text-secondary text-lg">
            আরো প্রশ্ন থাকলে সরাসরি call করুন —
            <a href="tel:+8801915557363" class="text-brand-primary font-medium hover:underline">01915557363</a>
          </p>
        </div>

        <!-- Accordion -->
        <div class="space-y-3">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="rounded-xl bg-white border transition-all duration-250"
            :class="openIndex === i ? 'border-brand-primary shadow-card' : 'border-brand-border hover:border-brand-border-strong'"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              :aria-expanded="openIndex === i"
              @click="toggle(i)"
            >
              <span class="font-medium text-brand-primary text-sm md:text-base">{{ faq.q }}</span>
              <Icon
                name="mdi:chevron-down"
                class="w-5 h-5 flex-shrink-0 transition-transform duration-250 text-brand-text-muted"
                :class="openIndex === i ? 'rotate-180 text-brand-primary' : ''"
                aria-hidden="true"
              />
            </button>

            <Transition
              enter-active-class="transition-all duration-250 ease-spring overflow-hidden"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-200 ease-in overflow-hidden"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openIndex === i" class="px-6 pb-5">
                <div class="w-full h-px bg-brand-border mb-4" />
                <p class="text-brand-text-secondary text-sm leading-relaxed">{{ faq.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
