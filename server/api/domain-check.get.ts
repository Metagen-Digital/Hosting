export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const domain = String(query.domain || '').trim().toLowerCase()

  if (!domain || !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(domain)) {
    throw createError({ statusCode: 400, message: 'Invalid domain name' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.whoisApiKey

  try {
    if (apiKey) {
      // WhoisXML API (free tier: 500 req/month)
      const res = await $fetch<{ WhoisRecord?: { dataError?: string } }>(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService`,
        {
          query: {
            apiKey,
            domainName: domain,
            outputFormat: 'JSON',
          },
          timeout: 8000,
        }
      )
      const noMatch = res?.WhoisRecord?.dataError === 'MISSING_WHOIS_DATA'
      return { available: noMatch, domain }
    }

    // Fallback: RDAP (free, no key, limited TLD support)
    const tld = domain.split('.').slice(-1)[0]
    const rdapBase: Record<string, string> = {
      com: 'https://rdap.verisign.com/com/v1',
      net: 'https://rdap.verisign.com/net/v1',
      org: 'https://rdap.publicinterestregistry.org/rdap',
    }
    const base = rdapBase[tld]
    if (base) {
      try {
        await $fetch(`${base}/domain/${domain}`, { timeout: 6000 })
        return { available: false, domain }
      } catch (e: unknown) {
        const err = e as { statusCode?: number }
        if (err?.statusCode === 404) return { available: true, domain }
      }
    }

    // Generic: simulate (demo mode — replace with real API)
    await new Promise(r => setTimeout(r, 800))
    const demoTaken = ['google', 'facebook', 'amazon', 'microsoft', 'apple']
    const base2 = domain.split('.')[0]
    return { available: !demoTaken.includes(base2), domain }

  } catch {
    throw createError({ statusCode: 502, message: 'Domain check service unavailable' })
  }
})
