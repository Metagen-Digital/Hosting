<script setup lang="ts">
const { user, isLoggedIn, userInitials, logout, loading } = useAuth()
const localePath = useLocalePath()
const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

onClickOutside(menuRef, () => { open.value = false })
</script>

<template>
  <ClientOnly>
  <!-- Logged in: avatar dropdown -->
  <div v-if="isLoggedIn" ref="menuRef" class="relative">
    <button
      class="w-9 h-9 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:ring-offset-1 shrink-0"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="`Account menu for ${user?.name}`"
      @click="open = !open"
    >
      {{ userInitials }}
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-brand-border py-1.5 z-50 origin-top-right"
        role="menu"
      >
        <div class="px-3 py-2.5 border-b border-brand-border">
          <p class="text-xs font-semibold text-brand-text-primary truncate">{{ user?.name }}</p>
          <p class="text-xs text-brand-text-muted truncate mt-0.5">{{ user?.email }}</p>
        </div>

        <NuxtLink
          :to="localePath('/dashboard')"
          role="menuitem"
          class="flex items-center gap-2.5 px-3 py-2 text-sm text-brand-text-primary hover:bg-brand-surface hover:text-brand-primary transition-colors"
          @click="open = false"
        >
          <Icon name="mdi:view-dashboard-outline" class="w-4 h-4 shrink-0" />
          My Dashboard
        </NuxtLink>

        <div class="border-t border-brand-border mt-1 pt-1">
          <button
            role="menuitem"
            :disabled="loading"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            @click="logout(); open = false"
          >
            <Icon name="mdi:logout" class="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Logged out: avatar icon -->
  <NuxtLink
    v-else
    :to="localePath('/auth/login')"
    class="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
    aria-label="Sign in"
  >
    <Icon name="mdi:account-circle" class="w-9 h-9 text-brand-text-secondary" />
  </NuxtLink>

  <template #fallback>
    <div class="w-9 h-9" />
  </template>
  </ClientOnly>
</template>
