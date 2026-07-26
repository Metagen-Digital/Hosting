<script setup lang="ts">
const { t, tm, rt } = useI18n({ useScope: 'global' })
const openIndex = ref<number | null>(null)

const faqs = computed(() => {
  const items = tm('faq.items') as { q: unknown; a: unknown }[]
  return items.map(item => ({
    q: rt(item.q),
    a: rt(item.a),
  }))
})

// FAQPage rich result — the answers can render as an expandable block directly
// in the SERP, taking up more space and intercepting the click. The questions
// are locale-aware, so the bn page emits Bengali markup.
useJsonLd('faq', () => {
  if (!faqs.value.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.value.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
})

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="section-pad bg-brand-surface">
    <div class="container-content">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-xs font-semibold text-brand-primary uppercase tracking-widest mb-4">
            <Icon name="mdi:frequently-asked-questions" class="w-3.5 h-3.5" aria-hidden="true" />
            {{ t('faq.badge') }}
          </span>
          <h2 class="font-display font-extrabold text-3xl md:text-4xl text-brand-primary mb-4">
            {{ t('faq.heading') }}
          </h2>
          <p class="text-brand-text-secondary text-lg">
            {{ t('faq.sub') }}
            <a href="tel:+8801970222573" class="text-brand-primary font-medium hover:underline">01970-222573</a>
          </p>
        </div>

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
