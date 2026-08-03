<script setup lang="ts">
// Floating "chat" launcher — expands into Messenger + WhatsApp bubbles so
// visitors can jump straight into an inbox instead of hunting for contact
// info. Links use the deep-link forms (m.me / wa.me) so they open the actual
// chat thread, not just the Facebook page.
const { t } = useI18n({ useScope: 'global' })

const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const channels = computed(() => [
  {
    key: 'messenger',
    label: t('chatWidget.messenger'),
    href: 'https://m.me/MetagenDigital',
    icon: 'mdi:facebook-messenger',
    gradient: 'linear-gradient(135deg, #00B2FF 0%, #006AFF 100%)',
  },
  {
    key: 'whatsapp',
    label: t('chatWidget.whatsapp'),
    href: 'https://wa.me/8801970222573',
    icon: 'mdi:whatsapp',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  },
])

const visibleChannels = computed(() => (isOpen.value ? channels.value : []))

onClickOutside(rootEl, () => { isOpen.value = false })
onKeyStroke('Escape', () => { isOpen.value = false })
</script>

<template>
  <div ref="rootEl" class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[150] flex flex-col items-end">
    <!-- Channel bubbles -->
    <TransitionGroup
      tag="div"
      class="flex flex-col items-end gap-3 mb-3"
      enter-active-class="transition-all duration-250 ease-spring"
      enter-from-class="opacity-0 scale-50 translate-y-3"
      leave-active-class="transition-all duration-150 ease-spring"
      leave-to-class="opacity-0 scale-50 translate-y-3"
    >
      <a
        v-for="(channel, i) in visibleChannels"
        :key="channel.key"
        :href="channel.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="channel.label"
        class="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-card-hover hover:scale-110 active:scale-95 transition-all duration-250 ease-spring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        :style="{ background: channel.gradient, transitionDelay: `${i * 60}ms` }"
      >
        <span
          class="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-btn bg-brand-card border border-brand-border px-3 py-1.5 text-sm font-medium text-brand-text-primary shadow-card opacity-0 translate-x-1 transition-all duration-200 ease-spring group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block"
        >
          {{ channel.label }}
        </span>
        <Icon :name="channel.icon" class="w-6 h-6 text-white" aria-hidden="true" />
      </a>
    </TransitionGroup>

    <!-- Toggle button -->
    <button
      type="button"
      class="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-brand shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250 ease-spring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? t('chatWidget.close') : t('chatWidget.open')"
      @click="isOpen = !isOpen"
    >
      <span v-if="!isOpen" class="absolute top-0 right-0 flex w-3.5 h-3.5">
        <span class="absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75 animate-ping" />
        <span class="relative inline-flex w-3.5 h-3.5 rounded-full bg-brand-success border-2 border-white" />
      </span>

      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-200 ease-spring"
        enter-from-class="opacity-0 scale-50 rotate-45"
        leave-active-class="transition-all duration-150 ease-spring"
        leave-to-class="opacity-0 scale-50 -rotate-45"
      >
        <Icon v-if="isOpen" key="close" name="mdi:close" class="w-6 h-6 text-white" aria-hidden="true" />
        <Icon v-else key="open" name="mdi:message-text-outline" class="w-6 h-6 text-white" aria-hidden="true" />
      </Transition>
    </button>
  </div>
</template>
