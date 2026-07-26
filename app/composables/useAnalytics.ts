// One call site per conversion, two destinations: GA4 (nuxt-gtag) and the Meta
// Pixel. Keeping them together means a new conversion can never be wired into
// one tool and forgotten in the other.
//
// Every method is a safe no-op when the tag/pixel isn't loaded (dev, missing
// env, ad-blocker), so call sites never need to guard.

interface LeadParams   { service?: string, value?: number }
interface ContentParams { name: string, category?: string, id?: string }
interface PurchaseParams { value: number, currency?: string, orderId?: string, plan?: string }

export function useAnalytics() {
  /**
   * Shared id between the browser Pixel and a future server-side Conversions
   * API call, so Meta can dedupe the two reports of the same conversion.
   */
  function newEventId(): string {
    if (import.meta.client && crypto?.randomUUID) return crypto.randomUUID()
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }

  function pixel(event: string, params?: Record<string, unknown>, eventId?: string) {
    if (!import.meta.client) return
    window.fbq?.('track', event, params ?? {}, eventId ? { eventID: eventId } : undefined)
  }

  function ga(event: string, params?: Record<string, unknown>) {
    if (!import.meta.client) return
    useTrackEvent(event, params)
  }

  function readCookie(name: string): string | undefined {
    if (!import.meta.client) return undefined
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')
      .slice(1)
      .join('=')
  }

  return {
    newEventId,

    /**
     * Tracking metadata to attach to the API call that records a conversion.
     *
     * `event_id` is what lets Meta discard the duplicate when both the browser
     * pixel and the server-side Conversions API report the same conversion —
     * pass the id returned by the matching track* call. `_fbp`/`_fbc` are
     * Meta's own first-party cookies and are the strongest match signals the
     * server can forward; they exist only if the pixel has loaded.
     */
    trackingPayload(eventId: string) {
      return {
        event_id: eventId,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc'),
      }
    },

    /** Contact form submitted, quote requested — the main agency conversion. */
    trackLead(params: LeadParams = {}, eventId = newEventId()) {
      ga('generate_lead', { service: params.service, value: params.value, currency: 'BDT' })
      pixel('Lead', { content_name: params.service, value: params.value, currency: 'BDT' }, eventId)
      return eventId
    },

    /** Account created. */
    trackRegistration(eventId = newEventId()) {
      ga('sign_up', { method: 'email' })
      pixel('CompleteRegistration', { status: true }, eventId)
      return eventId
    },

    /** A service / product / case study detail page was viewed. */
    trackViewContent(params: ContentParams) {
      ga('view_item', {
        items: [{ item_id: params.id ?? params.name, item_name: params.name, item_category: params.category }],
      })
      pixel('ViewContent', {
        content_name: params.name,
        content_category: params.category,
        content_ids: params.id ? [params.id] : undefined,
        content_type: 'product',
      })
    },

    /** Phone / WhatsApp / email tapped. */
    trackContact(method: string) {
      ga('contact', { method })
      pixel('Contact', { content_name: method })
    },

    /** Checkout started (plan chosen, order form opened). */
    trackInitiateCheckout(params: PurchaseParams) {
      const currency = params.currency ?? 'BDT'
      ga('begin_checkout', { value: params.value, currency, items: [{ item_name: params.plan }] })
      pixel('InitiateCheckout', { value: params.value, currency, content_name: params.plan })
    },

    /** Order placed. */
    trackPurchase(params: PurchaseParams, eventId = newEventId()) {
      const currency = params.currency ?? 'BDT'
      ga('purchase', {
        transaction_id: params.orderId,
        value: params.value,
        currency,
        items: [{ item_name: params.plan }],
      })
      pixel('Purchase', {
        value: params.value,
        currency,
        content_name: params.plan,
        content_type: 'product',
        order_id: params.orderId,
      }, eventId)
      return eventId
    },

    /** Newsletter signup. */
    trackSubscribe(eventId = newEventId()) {
      ga('newsletter_signup')
      pixel('Subscribe', { currency: 'BDT', value: 0 }, eventId)
      return eventId
    },
  }
}
