<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const { query, status, checkedDomain, tlds, selectedTld, fullDomain, isValidDomain, domainPrice, alternatives, loadingAlternatives, checkDomain, reset } = useDomainSearch()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') checkDomain()
}
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-brand-surface to-white pt-10 pb-20 md:pb-28">
    <!-- Grid bg -->
    <div class="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />
    <!-- Glow orbs -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-orange/8 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

    <div class="container-content relative z-10">
      <!-- Badge -->
      <div class="flex justify-center mb-6">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border shadow-card text-xs font-semibold text-brand-primary uppercase tracking-widest">
          <span class="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
          {{ t('hero.badge') }}
        </span>
      </div>

      <!-- Headline -->
      <div class="text-center max-w-4xl mx-auto mb-10">
        <h1 class="font-display font-extrabold text-4xl md:text-5xl lg:text-display-lg text-brand-primary leading-tight mb-4">
          {{ t('hero.headline1') }}
          <span class="relative inline-block mx-2">
            <span class="text-gradient-orange">{{ t('hero.headline2') }}</span>
            <svg class="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#FF6B35" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>
          </span>
          {{ t('hero.headline3') }}
        </h1>
        <i18n-t keypath="hero.sub" tag="p" class="text-brand-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          <template #brand>
            <a href="https://metagendigital.com" target="_blank" rel="noopener noreferrer" class="font-bold text-brand-primary hover:underline">MetaGen Digital</a>
          </template>
        </i18n-t>
      </div>

      <!-- Search box -->
      <div class="max-w-2xl mx-auto">
        <div class="flex items-stretch rounded-2xl shadow-card-hover border border-brand-border bg-white overflow-hidden transition-shadow duration-250 focus-within:shadow-glow-primary focus-within:border-brand-primary">
          <div class="flex items-center pl-5 pr-2 text-brand-text-muted">
            <Icon name="mdi:magnify" class="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            v-model="query"
            type="text"
            :placeholder="t('hero.placeholder')"
            class="flex-1 py-4 px-2 text-brand-primary placeholder-brand-text-muted bg-transparent outline-none font-medium text-base"
            :aria-label="t('hero.placeholder')"
            @keydown="onKeydown"
          />
          <select
            v-model="selectedTld"
            class="hidden sm:block border-l border-brand-border px-3 py-4 bg-brand-surface text-brand-text-secondary text-sm font-medium outline-none cursor-pointer hover:bg-brand-surface-alt transition-colors"
            :aria-label="t('hero.selectTld')"
          >
            <option v-for="tld in tlds" :key="tld" :value="tld">{{ tld }}</option>
          </select>
          <button
            class="m-1.5 px-6 py-3 rounded-xl bg-gradient-brand text-white font-semibold text-sm hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all duration-250 ease-spring disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap"
            :disabled="!isValidDomain || status === 'loading'"
            @click="checkDomain"
          >
            <svg v-if="status === 'loading'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <Icon v-else name="mdi:magnify" class="w-4 h-4" aria-hidden="true" />
            {{ t('hero.searchBtn') }}
          </button>
        </div>

        <!-- TLD chips (mobile) -->
        <div class="flex sm:hidden flex-wrap gap-2 mt-3 justify-center">
          <button
            v-for="tld in tlds"
            :key="tld"
            class="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
            :class="selectedTld === tld
              ? 'bg-brand-primary text-white border-brand-primary'
              : 'bg-white text-brand-text-secondary border-brand-border hover:border-brand-primary hover:text-brand-primary'"
            @click="selectedTld = tld"
          >
            {{ tld }}
          </button>
        </div>

        <!-- Result -->
        <Transition
          enter-active-class="transition-all duration-300 ease-spring"
          enter-from-class="opacity-0 translate-y-2"
          leave-active-class="transition-all duration-200 ease-in"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div v-if="status === 'available'" class="mt-4 p-4 rounded-xl bg-white border-2 border-brand-success shadow-card flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center flex-shrink-0">
                <Icon name="mdi:check-circle" class="w-5 h-5 text-brand-success" aria-hidden="true" />
              </div>
              <div>
                <p class="font-semibold text-brand-primary text-sm">{{ checkedDomain }}</p>
                <p class="text-brand-success text-xs font-medium">{{ t('hero.available') }}</p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-display font-extrabold text-xl text-brand-primary">৳{{ domainPrice.toLocaleString() }}</p>
              <p class="text-brand-text-muted text-xs">{{ t('hero.perYear') }}</p>
            </div>
            <NuxtLink
              :to="`/order?domain=${checkedDomain}&type=domain`"
              class="flex-shrink-0 px-5 py-2.5 rounded-btn bg-gradient-brand text-white text-sm font-semibold hover:shadow-glow-primary hover:scale-105 transition-all duration-250"
            >
              {{ t('hero.register') }}
            </NuxtLink>
          </div>

          <div v-else-if="status === 'taken'" class="mt-4 p-4 rounded-xl bg-white border-2 border-brand-error/30 shadow-card flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-error/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:close-circle" class="w-5 h-5 text-brand-error" aria-hidden="true" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-brand-primary text-sm">{{ checkedDomain }}</p>
              <p class="text-brand-error text-xs font-medium">{{ t('hero.taken') }}</p>
            </div>
            <button class="text-xs text-brand-text-muted hover:text-brand-primary transition-colors" @click="reset">
              {{ t('hero.searchAgain') }}
            </button>
          </div>

          <div v-else-if="status === 'premium'" class="mt-4 p-4 rounded-xl bg-white border-2 border-brand-warning/40 shadow-card flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-warning/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:star-off" class="w-5 h-5 text-brand-warning" aria-hidden="true" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-brand-primary text-sm">{{ checkedDomain }}</p>
              <p class="text-brand-warning text-xs font-medium">{{ t('hero.premiumUnavailable') }}</p>
            </div>
            <button class="text-xs text-brand-text-muted hover:text-brand-primary transition-colors" @click="reset">
              {{ t('hero.searchAgain') }}
            </button>
          </div>

          <div v-else-if="status === 'error'" class="mt-4 p-4 rounded-xl bg-brand-warning/10 border border-brand-warning/30 text-brand-warning text-sm font-medium flex items-center gap-2">
            <Icon name="mdi:alert-circle" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {{ t('hero.taken') }}
          </div>
        </Transition>

        <!-- Alternatives -->
        <div v-if="status === 'taken'" class="mt-3">
          <div v-if="loadingAlternatives" class="flex items-center gap-2 text-brand-text-muted text-xs py-2">
            <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ t('hero.checkingAlts') }}
          </div>
          <div v-else-if="alternatives.length" class="space-y-2">
            <p class="text-brand-text-muted text-xs font-medium mb-2">{{ t('hero.tryAlternatives') }}</p>
            <div
              v-for="alt in alternatives"
              :key="alt.domain"
              class="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-brand-border hover:border-brand-primary transition-all duration-150"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-brand-success flex-shrink-0" />
                <span class="font-medium text-brand-primary text-sm">{{ alt.domain }}</span>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <span class="text-brand-text-secondary text-sm font-semibold">৳{{ alt.price.toLocaleString() }}/yr</span>
                <NuxtLink
                  :to="`/order?domain=${alt.domain}&type=domain`"
                  class="px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-xs font-semibold hover:shadow-glow-primary transition-all duration-150"
                >
                  {{ t('hero.register') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Social proof -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-brand-text-secondary">
        <span class="flex items-center gap-1.5"><Icon name="mdi:shield-check" class="w-4 h-4 text-brand-success" aria-hidden="true" />{{ t('hero.proof.secure') }}</span>
        <span class="hidden sm:block w-px h-4 bg-brand-border" aria-hidden="true" />
        <span class="flex items-center gap-1.5"><Icon name="mdi:lightning-bolt" class="w-4 h-4 text-brand-orange" aria-hidden="true" />{{ t('hero.proof.setup') }}</span>
        <span class="hidden sm:block w-px h-4 bg-brand-border" aria-hidden="true" />
        <span class="flex items-center gap-1.5"><Icon name="mdi:headset" class="w-4 h-4 text-brand-primary" aria-hidden="true" />{{ t('hero.proof.support') }}</span>
        <span class="hidden sm:block w-px h-4 bg-brand-border" aria-hidden="true" />
        <span class="flex items-center gap-1.5"><Icon name="mdi:server" class="w-4 h-4 text-brand-purple" aria-hidden="true" />{{ t('hero.proof.powered') }}</span>
      </div>
    </div>
  </section>
</template>
