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
})

function orderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'MGD-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
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
      },
    })
  } catch {
    throw createError({
      statusCode: 502,
      message: 'We could not place your order right now. Please try again, or contact us on 01970-222573.',
    })
  }

  return { success: true, orderId: id }
})
