// Tracks phone / email / WhatsApp taps as Contact conversions.
//
// Done with one delegated listener on the document rather than a handler per
// link: these links are scattered across the footer, contact page, FAQ blocks
// and several detail pages, and new ones get added over time. Delegation means
// any tel:/mailto:/wa.me link anywhere is covered automatically.
export default defineNuxtPlugin(() => {
  const { trackContact } = useAnalytics()

  function methodFor(href: string): string | null {
    if (href.startsWith('tel:')) return 'phone'
    if (href.startsWith('mailto:')) return 'email'
    if (href.includes('wa.me') || href.includes('whatsapp.com')) return 'whatsapp'
    return null
  }

  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a')
      if (!link) return

      const method = methodFor(link.getAttribute('href') ?? '')
      if (method) trackContact(method)
    },
    // Capture phase, so the event is recorded even if a handler further down
    // stops propagation before it reaches the document in the bubble phase.
    { capture: true },
  )
})
