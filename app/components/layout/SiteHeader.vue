<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 50)
const mobileOpen = ref(false)
const { t } = useI18n({ useScope: 'global' })
const { isEn, setLocale } = useLocale()
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
      <NuxtLink :to="localePath('/')" class="flex items-center flex-shrink-0" aria-label="MetaGenDigital Hosting home">
        <NuxtImg
          src="/images/logo/logo-light.png"
          alt="MetaGenDigital"
          class="h-9 md:h-10 w-auto object-contain"
          loading="eager"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-1" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="px-3 py-2 text-sm font-semibold text-brand-text-secondary hover:text-brand-primary transition-colors duration-150 rounded-md hover:bg-brand-surface"
        >
          {{ t(link.labelKey) }}
        </a>
      </nav>

      <!-- Right side: lang toggle + UserMenu + CTA -->
      <div class="hidden md:flex items-center gap-2">
        <!-- Language toggle -->
        <div class="inline-flex items-center rounded-md border border-brand-border overflow-hidden text-xs font-semibold" role="group" aria-label="Language selector">
          <button
            class="px-2 py-1 transition-all duration-150"
            :class="isEn ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface'"
            aria-label="English"
            @click="setLocale('en')"
          >EN</button>
          <div class="w-px self-stretch bg-brand-border" />
          <button
            class="px-2 py-1 transition-all duration-150"
            :class="!isEn ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface'"
            aria-label="বাংলা"
            @click="setLocale('bn')"
          >বাং</button>
        </div>

        <!-- Order CTA -->
        <NuxtLink
          :to="localePath('/order')"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250"
        >
          <Icon name="mdi:rocket-launch" class="w-4 h-4" aria-hidden="true" />
          {{ t('nav.orderNow') }}
        </NuxtLink>

        <!-- User Menu -->
        <UserMenu />
      </div>

      <!-- Mobile right: lang + hamburger -->
      <div class="md:hidden flex items-center gap-2">
        <div class="inline-flex items-center rounded-md border border-brand-border overflow-hidden text-xs font-bold" role="group" aria-label="Language selector">
          <button
            class="px-2 py-1 transition-all duration-150"
            :class="isEn ? 'bg-brand-primary text-white' : 'text-brand-text-secondary'"
            aria-label="English"
            @click="setLocale('en')"
          >EN</button>
          <div class="w-px self-stretch bg-brand-border" />
          <button
            class="px-2 py-1 transition-all duration-150"
            :class="!isEn ? 'bg-brand-primary text-white' : 'text-brand-text-secondary'"
            aria-label="বাংলা"
            @click="setLocale('bn')"
          >বাং</button>
        </div>
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

  </header>

  <!-- Mobile drawer overlay -->
  <Transition name="overlay">
    <div
      v-if="mobileOpen"
      class="md:hidden fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm"
      @click="mobileOpen = false"
    />
  </Transition>

  <!-- Mobile drawer panel -->
  <Transition name="drawer">
    <div
      v-if="mobileOpen"
      class="md:hidden fixed top-0 left-0 z-[99] h-full w-72 bg-white shadow-2xl flex flex-col"
    >
      <!-- Drawer header -->
      <div class="flex items-center justify-between px-5 h-16 border-b border-brand-border flex-shrink-0">
        <NuxtImg
          src="/images/logo/logo-light.png"
          alt="MetaGenDigital"
          class="h-8 w-auto object-contain"
        />
        <button
          class="p-1.5 rounded-md text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors"
          aria-label="Close menu"
          @click="mobileOpen = false"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-semibold text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface transition-colors"
          @click="mobileOpen = false"
        >
          {{ t(link.labelKey) }}
        </a>
      </nav>

      <!-- CTA -->
      <div class="px-4 py-5 border-t border-brand-border flex-shrink-0 space-y-3">
        <NuxtLink
          :to="localePath('/order')"
          class="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-btn text-sm font-semibold text-white bg-gradient-brand hover:shadow-glow-primary transition-all duration-250"
          @click="mobileOpen = false"
        >
          <Icon name="mdi:rocket-launch" class="w-4 h-4" />
          {{ t('nav.orderNow') }}
        </NuxtLink>
        <div @click="mobileOpen = false">
          <UserMenu />
        </div>
      </div>
    </div>
  </Transition>

  <!-- Spacer -->
  <div class="h-16 md:h-20" aria-hidden="true" />
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 250ms ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
