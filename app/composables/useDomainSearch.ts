export type DomainStatus = 'idle' | 'loading' | 'available' | 'taken' | 'error'

export function useDomainSearch() {
  const query = ref('')
  const status = ref<DomainStatus>('idle')
  const checkedDomain = ref('')
  const errorMsg = ref('')

  const tlds = ['.com', '.net', '.org', '.info', '.xyz', '.store', '.shop', '.online']
  const selectedTld = ref('.com')

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

  async function checkDomain() {
    if (!isValidDomain.value) return
    status.value = 'loading'
    checkedDomain.value = fullDomain.value
    errorMsg.value = ''

    try {
      const data = await $fetch<{ available: boolean }>('/api/domain-check', {
        query: { domain: fullDomain.value },
      })
      status.value = data.available ? 'available' : 'taken'
    } catch {
      status.value = 'error'
      errorMsg.value = 'Check করা যায়নি। আবার try করুন।'
    }
  }

  function reset() {
    query.value = ''
    status.value = 'idle'
    checkedDomain.value = ''
  }

  return { query, status, checkedDomain, errorMsg, tlds, selectedTld, fullDomain, isValidDomain, checkDomain, reset }
}
