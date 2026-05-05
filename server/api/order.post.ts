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

  // Send email via nodemailer (only if SMTP configured)
  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: Number(config.smtpPort) === 465,
      auth: { user: config.smtpUser, pass: config.smtpPass },
    })

    const adminHtml = `
<h2>🆕 New Hosting Order — ${id}</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Order ID</td><td style="padding:8px;border:1px solid #eee">${id}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Domain</td><td style="padding:8px;border:1px solid #eee">${d.domainName || '—'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Plan</td><td style="padding:8px;border:1px solid #eee">${d.plan} — ${d.billing} — ৳${d.price.toLocaleString()}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Company</td><td style="padding:8px;border:1px solid #eee">${d.companyName || '—'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Name</td><td style="padding:8px;border:1px solid #eee">${d.fullName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Phone</td><td style="padding:8px;border:1px solid #eee">${d.phone}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Email</td><td style="padding:8px;border:1px solid #eee">${d.email}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Address</td><td style="padding:8px;border:1px solid #eee">${d.address}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9;color:#E2136E">Payment Method</td><td style="padding:8px;border:1px solid #eee;font-weight:bold">${d.payMethod.toUpperCase()}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Transaction ID</td><td style="padding:8px;border:1px solid #eee;font-family:monospace">${d.txId}</td></tr>
  <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;background:#f9f9f9">Send From</td><td style="padding:8px;border:1px solid #eee;font-family:monospace">${d.sendFrom}</td></tr>
</table>
<p style="margin-top:16px;color:#666;font-family:sans-serif;font-size:13px">
  ✅ <strong>Action:</strong> Verify payment → Setup hosting → Call ${d.phone}
</p>`

    await transporter.sendMail({
      from: `"MetaGen Hosting" <${config.smtpUser}>`,
      to: config.adminEmail,
      subject: `🆕 New Order ${id} — ${d.plan} — ${d.phone}`,
      html: adminHtml,
    })

    // Customer confirmation
    await transporter.sendMail({
      from: `"MetaGen Hosting" <${config.smtpUser}>`,
      to: d.email,
      subject: `✅ Order Received — ${id} | MetaGen Hosting`,
      html: `
<h2>আপনার Order পাওয়া গেছে! — ${id}</h2>
<p>প্রিয় ${d.fullName},</p>
<p>আপনার order সফলভাবে পাঠানো হয়েছে। আমরা payment verify করে ২৪ ঘণ্টার মধ্যে আপনার hosting setup করব।</p>
<p><strong>Plan:</strong> ${d.plan} (${d.billing})<br/>
<strong>Amount:</strong> ৳${d.price.toLocaleString()}<br/>
<strong>TxID:</strong> ${d.txId}</p>
<p>যেকোনো প্রশ্নে call করুন: <strong>01970-222573</strong></p>
<p>ধন্যবাদ<br/>MetaGen Hosting Team</p>`,
    })
  }

  // Forward order to Laravel backend (fire-and-forget, non-blocking)
  const backendUrl = config.backendUrl
  if (backendUrl) {
    $fetch(`${backendUrl}/api/hosting-orders`, {
      method: 'POST',
      body: {
        order_id:    id,
        full_name:   d.fullName,
        email:       d.email,
        phone:       d.phone,
        company_name: d.companyName || null,
        address:     d.address,
        domain_name: d.domainName || null,
        plan:        d.plan,
        billing:     d.billing,
        price:       d.price,
        pay_method:  d.payMethod,
        tx_id:       d.txId,
        send_from:   d.sendFrom,
        ordered_at:  new Date().toISOString(),
      },
    }).catch(() => {/* silently fail if backend unreachable */})
  }

  return { success: true, orderId: id }
})
