<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const footerLinks = computed(() => [
  { labelKey: 'footer.links.domain',  href: '/#domain'  },
  { labelKey: 'footer.links.hosting', href: '/#hosting' },
  { labelKey: 'footer.links.how',     href: '/#how'     },
  { labelKey: 'footer.links.faq',     href: '/#faq'     },
  { labelKey: 'footer.links.order',   href: localePath('/order') },
])
</script>

<template>
  <footer class="bg-brand-footer-bg border-t border-brand-footer-border">
    <div class="container-content py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <!-- Brand -->
        <div>
          <p class="font-display font-extrabold text-xl text-white mb-2">
            MetaGen <span class="text-brand-orange">Hosting</span>
          </p>
          <p class="text-sm text-brand-footer-text/70 leading-relaxed max-w-xs">
            {{ t('footer.tagline') }}
          </p>
          <p class="mt-4 text-sm text-brand-footer-text/70">
            📞 <a href="tel:+8801915557363" class="hover:text-white transition-colors">01915557363</a>
          </p>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">{{ t('footer.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks" :key="link.labelKey">
              <a :href="link.href" class="text-sm text-brand-footer-text/70 hover:text-white transition-colors">
                {{ t(link.labelKey) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">{{ t('footer.support') }}</h3>
          <ul class="space-y-2 text-sm text-brand-footer-text/70">
            <li>📧 bytestacklab@gmail.com</li>
            <li>📞 01915557363</li>
            <li>⏰ {{ t('cta.responseTime') }}</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-brand-footer-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-footer-text/50">
        <p>© {{ new Date().getFullYear() }} MetaGenDigital. {{ t('footer.rights') }}</p>
        <p>Powered by <span class="text-brand-orange">Verpex</span></p>
      </div>
    </div>
  </footer>
</template>
