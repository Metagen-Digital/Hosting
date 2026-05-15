interface RdapEntity {
  roles: string[]
  vcardArray?: [string, Array<[string, Record<string, unknown>, string, string]>]
  publicIds?: Array<{ type: string; identifier: string }>
}

interface RdapResponse {
  ldhName?: string
  status?: string[]
  entities?: RdapEntity[]
}

// RDAP endpoints per TLD (verified working)
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

// Registry-as-registrar = premium/reserved domain
const PREMIUM_REGISTRAR_PATTERNS: string[] = [
  'xyz.com llc', 'xyz registry',
  'radix fzc', 'radix inc',
  'gmo internet',
  'afilias', 'identity digital',
  'donuts',
]

function isPremiumRegistrar(entities: RdapEntity[] = []): boolean {
  const registrar = entities.find(e => e.roles?.includes('registrar'))
  if (!registrar?.vcardArray) return false
  const fn = registrar.vcardArray[1]?.find(f => f[0] === 'fn')?.[3] ?? ''
  const name = String(fn).toLowerCase()
  return PREMIUM_REGISTRAR_PATTERNS.some(p => name.includes(p))
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const domain = String(query.domain || '').trim().toLowerCase()

  if (!domain || !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(domain)) {
    throw createError({ statusCode: 400, message: 'Invalid domain name' })
  }

  const config = useRuntimeConfig()
  const tld = domain.split('.').slice(-1)[0]

  try {
    // ── RDAP (free, no key) ────────────────────────────────────
    const rdapBase = RDAP_SERVERS[tld]
    if (rdapBase) {
      try {
        const data = await $fetch<RdapResponse>(`${rdapBase}/domain/${domain}`, {
          timeout: 7000,
        })
        // Domain exists — check if it's premium (registry holds it)
        const premium = isPremiumRegistrar(data.entities)
        return { available: false, domain, premium }
      } catch (e: unknown) {
        const err = e as { statusCode?: number; status?: number }
        const status = err?.statusCode ?? err?.status
        if (status === 404) return { available: true, domain, premium: false }
      }
    }

    // ── WhoisXML fallback ──────────────────────────────────────
    if (config.whoisApiKey) {
      const res = await $fetch<{ WhoisRecord?: { dataError?: string } }>(
        'https://www.whoisxmlapi.com/whoisserver/WhoisService',
        {
          query: { apiKey: config.whoisApiKey, domainName: domain, outputFormat: 'JSON' },
          timeout: 8000,
        }
      )
      const noMatch = res?.WhoisRecord?.dataError === 'MISSING_WHOIS_DATA'
      return { available: noMatch, domain, premium: false }
    }

    // ── Demo mode ──────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 600))
    const demoTaken = ['google', 'facebook', 'amazon', 'microsoft', 'apple']
    const base = domain.split('.')[0]
    return { available: !demoTaken.includes(base), domain, premium: false }

  } catch {
    throw createError({ statusCode: 502, message: 'Domain check service unavailable' })
  }
})
