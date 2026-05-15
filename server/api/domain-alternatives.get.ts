const RDAP_SERVERS: Record<string, string> = {
  com:    'https://rdap.verisign.com/com/v1',
  net:    'https://rdap.verisign.com/net/v1',
  org:    'https://rdap.publicinterestregistry.org/rdap',
  xyz:    'https://rdap.centralnic.com/xyz',
  store:  'https://rdap.centralnic.com/store',
  shop:   'https://rdap.centralnic.com/shop',
  online: 'https://rdap.centralnic.com/online',
  site:   'https://rdap.centralnic.com/site',
  tech:   'https://rdap.centralnic.com/tech',
  info:   'https://rdap.identitydigital.services/rdap',
}

const FALLBACK_PRICES: Record<string, number> = {
  '.com': 2400, '.net': 2500, '.org': 2400, '.info': 3300, '.xyz': 2200,
  '.store': 6000, '.shop': 3900, '.online': 3200, '.site': 3800, '.tech': 5000,
}

async function checkTld(base: string, tld: string, rdapBase: string): Promise<{ domain: string; tld: string; available: boolean }> {
  const domain = `${base}.${tld}`
  try {
    await $fetch(`${rdapBase}/domain/${domain}`, { timeout: 5000 })
    return { domain, tld, available: false }
  } catch (e: unknown) {
    const err = e as { statusCode?: number; status?: number }
    const status = err?.statusCode ?? err?.status
    return { domain, tld, available: status === 404 }
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const domain = String(query.domain || '').trim().toLowerCase()

  if (!domain) throw createError({ statusCode: 400, message: 'Missing domain' })

  // Extract base name (strip TLD)
  const parts = domain.split('.')
  const base = parts[0]
  const currentTld = parts.slice(1).join('.')

  // Check all TLDs except the one already searched
  const checks = Object.entries(RDAP_SERVERS)
    .filter(([tld]) => tld !== currentTld)
    .map(([tld, rdapBase]) => checkTld(base, tld, rdapBase))

  const results = await Promise.allSettled(checks)

  const config = useRuntimeConfig()

  // Try to get backend prices
  let prices: Record<string, number> = {}
  try {
    prices = await $fetch<Record<string, number>>(`${config.backendUrl}/api/domain-prices`, { timeout: 3000 })
  } catch {
    // use fallback
  }

  const alternatives = results
    .map(r => r.status === 'fulfilled' ? r.value : null)
    .filter((r): r is NonNullable<typeof r> => r !== null && r.available)
    .map(r => ({
      domain: r.domain,
      tld: `.${r.tld}`,
      price: prices[`.${r.tld}`] ?? FALLBACK_PRICES[`.${r.tld}`] ?? 2400,
    }))
    .slice(0, 6)

  return { base, alternatives }
})
