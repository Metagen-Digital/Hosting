export type DomainStatus = 'idle' | 'loading' | 'available' | 'taken' | 'premium' | 'error'

export interface Alternative {
  domain: string
  tld: string
  price: number
}

// Fallback prices if backend unreachable (Namecheap renewal × 122 BDT + 500 BDT)
const FALLBACK_PRICES: Record<string, number> = {
  '.com':    2400,
  '.net':    2500,
  '.org':    2400,
  '.info':   3300,
  '.xyz':    2200,
  '.store':  6000,
  '.shop':   3900,
  '.online': 3200,
  '.site':   3800,
  '.tech':   5000,
}

// Shared prices state — fetched once, reused across composable instances
const backendPrices = ref<Record<string, number>>({})
const pricesLoaded = ref(false)

async function loadPrices(backendUrl: string) {
  if (pricesLoaded.value) return
  try {
    const data = await $fetch<Record<string, number>>(`${backendUrl}/api/domain-prices`, {
      timeout: 5000,
    })
    backendPrices.value = data
  } catch {
    // fall back silently
  }
  pricesLoaded.value = true
}

export function useDomainSearch() {
  const config = useRuntimeConfig()
  const query = ref('')
  const status = ref<DomainStatus>('idle')
  const checkedDomain = ref('')
  const errorMsg = ref('')
  const alternatives = ref<Alternative[]>([])
  const loadingAlternatives = ref(false)

  const tlds = Object.keys(FALLBACK_PRICES)
  const selectedTld = ref('.com')

  // Fetch backend prices on first use
  onMounted(() => loadPrices(config.public.backendUrl as string))

  const fullDomain = computed(() => {
    const raw = query.value.trim().toLowerCase().replace(/\s+/g, '')
    if (!raw) return ''
    const hasTld = tlds.some(t => raw.endsWith(t))
    return hasTld ? raw : raw + selectedTld.value
  })

  const isValidDomain = computed(() => {
    if (!fullDomain.value) return false
    return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(fullDomain.value)
  })

  const domainPrice = computed(() => {
    const tld = tlds.find(t => checkedDomain.value.endsWith(t))
    if (!tld) return FALLBACK_PRICES['.com']
    const prices = Object.keys(backendPrices.value).length ? backendPrices.value : FALLBACK_PRICES
    return prices[tld] ?? FALLBACK_PRICES[tld] ?? FALLBACK_PRICES['.com']
  })

  async function checkDomain() {
    if (!isValidDomain.value) return
    status.value = 'loading'
    checkedDomain.value = fullDomain.value
    errorMsg.value = ''

    try {
      const data = await $fetch<{ available: boolean; premium: boolean }>('/api/domain-check', {
        query: { domain: fullDomain.value },
      })
      if (data.premium) {
        status.value = 'premium'
        alternatives.value = []
      } else if (data.available) {
        status.value = 'available'
        alternatives.value = []
      } else {
        status.value = 'taken'
        fetchAlternatives(fullDomain.value)
      }
    } catch {
      status.value = 'error'
      errorMsg.value = 'Check করা যায়নি। আবার try করুন।'
    }
  }

  async function fetchAlternatives(domain: string) {
    loadingAlternatives.value = true
    alternatives.value = []
    try {
      const data = await $fetch<{ alternatives: Alternative[] }>('/api/domain-alternatives', {
        query: { domain },
      })
      alternatives.value = data.alternatives
    } catch {
      alternatives.value = []
    } finally {
      loadingAlternatives.value = false
    }
  }

  function reset() {
    query.value = ''
    status.value = 'idle'
    checkedDomain.value = ''
    alternatives.value = []
  }

  return { query, status, checkedDomain, errorMsg, alternatives, loadingAlternatives, tlds, selectedTld, fullDomain, isValidDomain, domainPrice, checkDomain, reset }
}
