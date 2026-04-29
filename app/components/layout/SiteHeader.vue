<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 50)
const mobileOpen = ref(false)
const { t } = useI18n()
const { toggleLocale, localeLabel } = useLocale()
const localePath = useLocalePath()

const navLinks = computed(() => [
  { labelKey: 'nav.domain',  href: '/#domain'  },
  { labelKey: 'nav.hosting', href: '/#hosting' },
  { labelKey: 'nav.faq',     href: '/#faq'     },
  { labelKey: 'nav.contact', href: '/#contact' },
])
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-[100] transition-all duration-250 ease-in-out"
    :class="isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-header border-b border-brand-border'
      : 'bg-white/80 backdrop-blur-sm'"
  >
    <div class="container-content flex items-center justify-between h-16 md:h-20">
      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 flex-shrink-0" aria-label="MetaGenDigital Hosting home">
        <span class="font-display font-extrabold text-xl text-brand-primary">
          Meta<span class="text-gradient-orange">Gen</span>
          <span class="ml-1 text-sm font-semibold text-brand-text-secondary">Hosting</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-1" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="px-3 py-2 text-sm font-medium text-brand-text-secondary hover:text-brand-primary transition-colors duration-150 rounded-md hover:bg-brand-surface"
        >
          {{ t(link.labelKey) }}
        </a>
      </nav>

      <!-- Right side: lang toggle + CTA -->
      <div class="hidden md:flex items-center gap-2">
        <!-- Language toggle -->
        <button
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border text-sm font-semibold text-brand-primary hover:bg-brand-surface hover:border-brand-border-strong transition-all duration-150"
          :aria-label="`Switch to ${localeLabel}`"
          @click="toggleLocale"
        >
          <Icon name="mdi:translate" class="w-4 h-4" aria-hidden="true" />
          {{ localeLabel }}
        </button>

        <!-- Order CTA -->
        <NuxtLink
          :to="localePath('/order')"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250"
        >
          <Icon name="mdi:rocket-launch" class="w-4 h-4" aria-hidden="true" />
          {{ t('nav.orderNow') }}
        </NuxtLink>
      </div>

      <!-- Mobile right: lang + hamburger -->
      <div class="md:hidden flex items-center gap-2">
        <button
          class="p-2 rounded-lg border border-brand-border text-sm font-bold text-brand-primary hover:bg-brand-surface transition-colors"
          :aria-label="`Switch to ${localeLabel}`"
          @click="toggleLocale"
        >
          {{ localeLabel }}
        </button>
        <button
          class="p-2 rounded-md text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-brand-border bg-white px-4 py-4 space-y-1"
      >
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="block px-3 py-2.5 rounded-md text-sm font-medium text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors"
          @click="mobileOpen = false"
        >
          {{ t(link.labelKey) }}
        </a>
        <NuxtLink
          :to="localePath('/order')"
          class="block mt-2 text-center px-5 py-3 rounded-btn text-sm font-semibold text-white bg-gradient-brand"
          @click="mobileOpen = false"
        >
          {{ t('nav.orderNow') }} →
        </NuxtLink>
      </div>
    </Transition>
  </header>

  <!-- Spacer -->
  <div class="h-16 md:h-20" aria-hidden="true" />
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 150ms ease, transform 200ms ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
