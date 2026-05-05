<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const footerLinks = computed(() => [
  { labelKey: 'footer.links.domain',  href: '/#domain'  },
  { labelKey: 'footer.links.hosting', href: '/#hosting' },
  { labelKey: 'footer.links.how',     href: '/#how'     },
  { labelKey: 'footer.links.faq',     href: '/#faq'     },
  { labelKey: 'footer.links.order',   href: localePath('/order') },
  { labelKey: 'footer.links.terms',   href: localePath('/terms') },
])

const companyLinks = [
  { label: 'About Us',  href: 'https://metagendigital.com/about'     },
  { label: 'Portfolio', href: 'https://metagendigital.com/portfolio'  },
  { label: 'Blog',      href: 'https://metagendigital.com/blog'       },
  { label: 'Products',  href: 'https://metagendigital.com/products'   },
  { label: 'Contact',   href: 'https://metagendigital.com/contact'    },
]

const socialLinks = [
  { icon: 'mdi:facebook',  label: 'Facebook',  href: 'https://www.facebook.com/MetagenDigital'         },
  { icon: 'mdi:instagram', label: 'Instagram', href: 'https://www.instagram.com/MetagenDigital'        },
  { icon: 'mdi:linkedin',  label: 'LinkedIn',  href: 'https://www.linkedin.com/company/MetagenDigital' },
  { icon: 'mdi:youtube',   label: 'YouTube',   href: 'https://www.youtube.com/@MetagenDigital'         },
  { icon: 'heroicons:globe-alt-16-solid', label: 'Website', href: 'https://metagendigital.com'         },
]
</script>

<template>
  <footer class="bg-brand-footer-bg border-t border-brand-footer-border">
    <div class="container-content py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        <!-- Brand -->
        <div>
          <NuxtImg
            src="/images/logo/logo-dark.png"
            alt="MetaGenDigital"
            class="h-10 w-auto object-contain mb-3"
            loading="lazy"
          />
          <p class="text-sm text-brand-footer-text/70 leading-relaxed max-w-sm mb-5">
            {{ t('footer.tagline') }}
          </p>

          <!-- Social Icons -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-footer-text/60 hover:text-white hover:bg-brand-primary/20 hover:border-brand-primary/40 transition-all duration-200"
            >
              <Icon :name="social.icon" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Company -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Company</h3>
          <ul class="space-y-2">
            <li v-for="link in companyLinks" :key="link.href">
              <a :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-brand-footer-text/70 hover:text-white transition-colors">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">{{ t('footer.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li v-for="link in footerLinks" :key="link.labelKey">
              <NuxtLink :to="link.href" class="text-sm text-brand-footer-text/70 hover:text-white transition-colors">
                {{ t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Contact Us</h3>
          <ul class="space-y-2.5 text-sm text-brand-footer-text/70">
            <li class="flex items-center gap-2">
              <Icon name="heroicons:envelope-16-solid" class="w-4 h-4 shrink-0 text-brand-primary" />
              <a href="mailto:hosting@metagendigital.com" class="hover:text-white transition-colors truncate">hosting@metagendigital.com</a>
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:envelope-16-solid" class="w-4 h-4 shrink-0 text-brand-primary" />
              <a href="mailto:metagendigital@gmail.com" class="hover:text-white transition-colors truncate">metagendigital@gmail.com</a>
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:phone-16-solid" class="w-4 h-4 shrink-0 text-brand-primary" />
              <a href="tel:+8801970222573" class="hover:text-white transition-colors">+88 01970-222573</a>
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:clock-16-solid" class="w-4 h-4 shrink-0 text-brand-primary" />
              <span>{{ t('cta.responseTime') }}</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:map-pin-16-solid" class="w-4 h-4 mt-0.5 shrink-0 text-brand-primary" />
              <span>Uttara 10, Dhaka, Bangladesh</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:globe-alt-16-solid" class="w-4 h-4 shrink-0 text-brand-primary" />
              <a href="https://metagendigital.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">metagendigital.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div class="border-t border-brand-footer-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-footer-text/50">
        <p>© {{ new Date().getFullYear() }} MetaGenDigital Hosting. All rights reserved.</p>
        <p class="text-brand-footer-text/40">A <a href="https://metagendigital.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">MetaGen Digital</a> Service</p>
      </div>
    </div>
  </footer>
</template>
