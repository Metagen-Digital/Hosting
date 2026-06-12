<template>
  <div class="flex flex-col min-h-dvh bg-brand-surface">
    <!-- Minimal header -->
    <header class="border-b border-brand-border bg-white">
      <div class="container-content flex items-center justify-between h-16">
        <NuxtLink to="/" aria-label="MetaGenDigital Hosting home">
          <NuxtImg
            src="/images/logo/logo-light.png"
            alt="MetaGenDigital"
            class="h-8 w-auto object-contain"
            loading="eager"
          />
        </NuxtLink>
        <NuxtLink
          to="/"
          class="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors duration-150 flex items-center gap-1.5"
        >
          <Icon name="mdi:arrow-left" class="w-4 h-4" aria-hidden="true" />
          Back to Home
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>
