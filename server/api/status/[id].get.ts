/**
 * Order status proxy.
 *
 * Requires the order's email address alongside the id. The id alone used to be
 * enough, and the response carried the customer's name — so a reference read
 * off a shared screenshot, a forwarded receipt or a lucky guess disclosed
 * someone else's purchase. Two factors keep the flow login-free while making a
 * leaked id useless on its own.
 *
 * The old six-character ids are still accepted so orders placed before the
 * length change can still be looked up.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { email } = getQuery(event)
  const config = useRuntimeConfig()

  // {6} = legacy ids, {10} = current. Anchored so nothing else gets through.
  if (!id || !/^MGD-[A-Z0-9]{6}(?:[A-Z0-9]{4})?$/i.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid order ID format' })
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    throw createError({
      statusCode: 400,
      message: 'Please enter the email address the order was placed with.',
    })
  }

  const url = `${config.backendUrl}/api/hosting-orders/${id.toUpperCase()}/status`

  try {
    // POST with the email in the body, not a query string: this call is
    // server-to-server (Nitro -> Laravel), and a GET's query string would land
    // verbatim, forever, in the Laravel/Nginx access log. The browser-facing
    // route above stays GET — that's what lets the confirmation email's
    // ?email= link open in one click — only this backend leg changed.
    return await $fetch(url, { method: 'POST', body: { email }, timeout: 8000 })
  }
  catch (err: any) {
    const status = err?.response?.status ?? err?.statusCode ?? 500

    // A wrong email and a nonexistent order deliberately produce the SAME
    // message. Distinguishing them would turn this into an oracle for "has
    // this address ever ordered from you".
    if (status === 404 || status === 422) {
      throw createError({
        statusCode: 404,
        message: 'No order found for that Order ID and email address.',
      })
    }

    throw createError({ statusCode: 502, message: 'Unable to reach backend. Please try again.' })
  }
})
