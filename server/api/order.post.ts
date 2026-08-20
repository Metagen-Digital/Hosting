import { z } from 'zod'

const schema = z.object({
  domainName:  z.string().optional().default(''),
  companyName: z.string().optional().default(''),
  fullName:    z.string().min(1),
  phone:       z.string().regex(/^01\d{9}$/),
  email:       z.string().email(),
  address:     z.string().min(1),
  plan:        z.string().min(1),
  billing:     z.enum(['monthly', 'yearly']),
  price:       z.coerce.number().positive(),
  payMethod:   z.enum(['bkash', 'nagad', 'rocket', 'upay']),
  txId:        z.string().min(1),
  sendFrom:    z.string().regex(/^01\d{9}$/),
  // Meta Pixel dedupe metadata. Shared with the browser's Purchase event so
  // Laravel's Conversions API send is recognised as the same conversion.
  eventId:     z.string().max(100).optional(),
  fbp:         z.string().max(255).optional(),
  fbc:         z.string().max(255).optional(),
})

// Crockford-ish alphabet: no I/O/0/1, so a customer reading the id off a
// receipt cannot mistype it.
const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const ID_LENGTH = 10

/**
 * Order reference.
 *
 * Uses the CSPRNG, not Math.random(): this id is the only thing standing
 * between a stranger and someone else's order details on the public status
 * lookup, and Math.random() is a predictable PRNG — observing a few outputs
 * narrows the rest. Ten characters over a 32-symbol alphabet is ~50 bits,
 * versus ~30 bits at the old length of six, where a birthday collision was
 * plausible within a few tens of thousands of orders.
 *
 * The status endpoint additionally requires the order's email address, so this
 * is one factor rather than the whole credential.
 */
function orderId() {
  const bytes = new Uint8Array(ID_LENGTH)
  globalThis.crypto.getRandomValues(bytes)

  let id = 'MGD-'
  for (let i = 0; i < ID_LENGTH; i++) {
    // 256 % 32 === 0, so the modulo introduces no bias here.
    id += ID_ALPHABET[bytes[i] % ID_ALPHABET.length]
  }
  return id
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
    throw createError({ statusCode: 400, message: `Validation failed — ${issues}` })
  }

  const d = parsed.data
  const id = orderId()
  const config = useRuntimeConfig()
  const backendUrl = config.backendUrl

  if (!backendUrl) {
    throw createError({ statusCode: 500, message: 'Ordering is temporarily unavailable. Please contact us.' })
  }

  // Persist the order in Laravel, which is the single source of truth AND
  // sends every order email (branded customer confirmation + invoice PDF, and
  // the team notification) via the configured SMTP. We await it so a failure
  // is surfaced instead of silently losing the order.
  try {
    await $fetch(`${backendUrl}/api/hosting-orders`, {
      method: 'POST',
      // Laravel queues the confirmation mail and the Meta event, so this call
      // is a database write and nothing more. Bound it explicitly: an
      // unbounded default is what let a slow SMTP server time this route out
      // at the edge after the order had already been written.
      timeout: 8000,
      body: {
        order_id:     id,
        full_name:    d.fullName,
        email:        d.email,
        phone:        d.phone,
        company_name: d.companyName || null,
        address:      d.address,
        domain_name:  d.domainName || null,
        plan:         d.plan,
        billing:      d.billing,
        price:        d.price,
        pay_method:   d.payMethod,
        tx_id:        d.txId,
        send_from:    d.sendFrom,
        ordered_at:   new Date().toISOString(),
        // Tracking metadata for Laravel's Conversions API send. This is a
        // server-to-server call, so Laravel would otherwise attribute the
        // conversion to this server's IP and user agent — forward the
        // visitor's own or the Meta match rate collapses.
        event_id:     d.eventId,
        fbp:          d.fbp,
        fbc:          d.fbc,
        client_ip:    getRequestIP(event, { xForwardedFor: true }),
        client_ua:    getRequestHeader(event, 'user-agent'),
      },
    })
  } catch (err: any) {
    // Validation rejections from Laravel are the customer's problem to fix and
    // must not be reported as "try again" — retrying an invalid payload just
    // produces the same failure.
    const status = err?.response?.status ?? err?.statusCode
    if (status === 422) {
      throw createError({
        statusCode: 422,
        message: err?.data?.message || 'Some of the order details were rejected. Please review and resubmit.',
      })
    }

    throw createError({
      statusCode: 502,
      message: 'We could not confirm your order. Please do NOT pay again — call us on 01970-222573 and we will check it for you.',
    })
  }

  return { success: true, orderId: id }
})
