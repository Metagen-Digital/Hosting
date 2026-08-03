<template>
  <div class="min-h-screen flex flex-col bg-brand-bg">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <ChatWidget />
  </div>
</template>
