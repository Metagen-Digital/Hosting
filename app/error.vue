<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] via-[#111640] to-[#0a0f2c] px-4">
    <div class="text-center max-w-md">
      <p class="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 font-display">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-4 text-2xl font-bold text-white font-display">
        {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>
      <p class="mt-3 text-sm text-white/60 leading-relaxed">
        {{ is404
          ? 'The page you are looking for does not exist or has been moved.'
          : 'An unexpected error occurred. Please try again later.'
        }}
      </p>
      <button
        class="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all"
        @click="handleError"
      >
        <Icon name="mdi:home" class="w-4 h-4" />
        Back to Home
      </button>
    </div>
  </div>
</template>
