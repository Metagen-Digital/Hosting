# hosting.metagendigital.com — Project Plan
**Domain & Hosting Service Landing Page | MetaGenDigital**
_Verpex Reseller | Manual Order Flow → Future WHMCS Automation_

---

## 1. সিদ্ধান্ত: কোন Stack?

### ✅ সুপারিশ: Nuxt 3 (Same as MetagenFrontend)

| বিষয় | Nuxt 3 | Plain HTML |
|---|---|---|
| Design consistency | ✅ MetagenFrontend এর components reuse | ❌ আলাদা codebase, আলাদা style |
| Performance | ✅ SSG/ISR → ultra-fast static | ✅ Fast কিন্তু manual optimization |
| Domain Search API | ✅ `server/api/` দিয়ে backend proxy | ⚠️ CORS issue, API key expose |
| Future WHMCS | ✅ API integration সহজ | ❌ জটিল হবে |
| Form handling | ✅ vee-validate + yup already আছে | ❌ নতুন করে লিখতে হবে |
| SEO | ✅ useSeoMeta, sitemap, OG | ⚠️ Manual |
| Deploy | ✅ `nuxt generate` → static HTML export | ✅ |

**কারণ:** MetagenFrontend এ ইতিমধ্যে সব foundation আছে — same Tailwind config, same components, same fonts। আলাদা করে HTML template বানালে পরে maintain করা কঠিন হবে। Nuxt 3 দিয়ে `nuxt generate` করলে 100% static HTML পাবে, hosting খরচ শূন্য।

**Architecture:** `/MetaGenDigital/Hosting/` এ নতুন Nuxt 3 app। MetagenFrontend থেকে Tailwind config + design tokens copy করে একই look-and-feel রাখা হবে। সাবডোমেইনে deploy হবে তাই আলাদা app হওয়াই ভালো।

---

## 2. Site Architecture

```
hosting.metagendigital.com/          ← Single Page (সব section এক পেজে)
hosting.metagendigital.com/order     ← Order Form Page (নতুন পেজ)
hosting.metagendigital.com/thank-you ← Success Page
```

### Single Page Sections (উপর থেকে নিচ):

```
1. [HEADER]             — Logo, nav links, "Order Now" button
2. [HERO]               — Domain Search Bar + Tagline
3. [DOMAIN PRICING]     — Domain price strip
4. [HOSTING PACKAGES]   — 3 টি package card
5. [WHY CHOOSE US]      — Trust signals + Verpex badge
6. [HOW IT WORKS]       — 4 step process
7. [FAQ]                — Accordion
8. [HELPLINE CTA]       — Phone number, 24h support
9. [FOOTER]             — Same as MetagenFrontend footer style
```

---

## 3. Section-by-Section Design Plan

### 3.1 Header
```
Logo (MetaGen-Logo.svg)  |  Domain  Hosting  FAQ  Contact  |  [Order Now →]
```
- Sticky, blur-on-scroll
- MetagenFrontend এর AppHeader pattern follow করবে
- Primary color: `#303c8e` (MetagenFrontend brand.primary)

---

### 3.2 Hero Section — Domain Search
```
[Eyebrow badge] "Verpex Powered Reseller"

[H1]  আপনার স্বপ্নের Domain খুঁজুন
      Find Your Perfect Domain Today

[Subtitle]  Professional domain & hosting — Made affordable for Bangladesh

[SEARCH BAR]
┌─────────────────────────────────────────────┬──────────────┐
│  yourdomain.com                             │  [Search 🔍] │
└─────────────────────────────────────────────┴──────────────┘

[TLD chips]  .com  .net  .org  .info  .xyz  .store  .shop

[RESULT (dynamic)]
  ✅ yourdomain.com — পাওয়া যাচ্ছে!  ৳ ২,০০০/বছর  [Register Now →]
  ❌ yourdomain.com — নেওয়া হয়ে গেছে

[Social proof strip]
  🔒 100% Secure  |  ⚡ Instant Setup  |  📞 24/7 Support  |  🏆 Verpex Powered
```

**Domain Availability API Strategy:**
- Nuxt `server/api/domain-check.get.ts` — backend proxy
- Use **WhoisXML API** (free tier: 500 req/month) অথবা **RDAP public endpoint**
- RDAP approach (সম্পূর্ণ ফ্রি, কোনো API key নেই):
  - GET `https://rdap.org/domain/{domain}`
  - HTTP 200 → Domain নেওয়া আছে (taken)
  - HTTP 404 → Domain available (উপলব্ধ)
  - Limitation: সব TLD support করে না, `.xyz`, `.store` এর জন্য কাজ নাও করতে পারে
- **Better option:** WhoisXML API free tier — সব TLD support করে
- Fixed price: **৳ ২,০০০/বছর** (hardcoded, Verpex এর rate hide করে নিজের margin রাখা)

---

### 3.3 Domain Price Strip
```
┌─────────────────────────────────────────────────────────────────────┐
│  .com  ৳২,০০০/yr  |  .net  ৳২,৫০০/yr  |  .org  ৳২,২০০/yr  |  ... │
└─────────────────────────────────────────────────────────────────────┘
```
Scrolling marquee (same as MetagenFrontend TrustedBySection pattern)

---

### 3.4 Hosting Packages — 3 টি Plan

**Toggle: Monthly | Yearly (Save 20%)**

```
┌──────────────────┬──────────────────────┬────────────────────┐
│   STARTER        │   BUSINESS ⭐ Popular │   ENTERPRISE       │
│   ৳৩৯৯/মাস      │   ৳৭৯৯/মাস          │   ৳১,৪৯৯/মাস      │
│   ৳৩,৯৯০/বছর    │   ৳৭,৯৯০/বছর        │   ৳১৪,৯৯০/বছর     │
├──────────────────┼──────────────────────┼────────────────────┤
│ ✅ 5 GB SSD      │ ✅ 20 GB SSD         │ ✅ 50 GB NVMe SSD  │
│ ✅ 1 Website     │ ✅ 5 Websites        │ ✅ Unlimited Sites  │
│ ✅ 5 Email Acct  │ ✅ Unlimited Email   │ ✅ Unlimited Email  │
│ ✅ Free SSL      │ ✅ Free SSL          │ ✅ Free SSL         │
│ ✅ Daily Backup  │ ✅ Daily Backup      │ ✅ Hourly Backup    │
│ ❌ Free Domain   │ ✅ Free Domain 1yr   │ ✅ Free Domain 1yr  │
│ ❌ Priority Sup  │ ❌ Priority Support  │ ✅ Priority Support │
│ 10 GB Bandwidth  │ Unlimited Bandwidth  │ Unlimited BW       │
├──────────────────┼──────────────────────┼────────────────────┤
│ [Order Now]      │ [Order Now] (orange) │ [Order Now]        │
└──────────────────┴──────────────────────┴────────────────────┘
```

- Featured card (Business): orange glow border, "Most Popular" badge, scale-105
- MetagenFrontend এর PricingCard.vue pattern একই রাখা হবে
- BDT ৳ currency format

---

### 3.5 Why Choose Us
```
4 trust cards:
🏆 Verpex Powered       ⚡ 99.9% Uptime        🔒 Free SSL Always    📞 Local Support BD
World-class infra       SLA guaranteed         Let's Encrypt auto    বাংলায় সাহায্য
```

---

### 3.6 How It Works — 4 Steps
```
1. Domain Search    2. Choose Plan     3. Make Payment    4. Setup Complete
   আপনার domain        আপনার budget-       বিকাশ/নগদ/রকেট      ২৪ ঘণ্টার মধ্যে
   খুঁজুন               অনুযায়ী plan         এ সহজেই pay করুন    আপনার সাইট live
```

---

### 3.7 FAQ Accordion
- Domain registration কত দিনে হয়?
- Payment এর পর কতক্ষণে hosting setup হবে?
- কোন payment method accept করা হয়?
- Domain transfer করা যাবে?
- Renewal price কত?
- WHMCS ব্যবহার করি কি?

---

### 3.8 Helpline CTA
```
┌───────────────────────────────────────────────────────────────┐
│  এখনই শুরু করুন — আমরা সাহায্যের জন্য আছি                    │
│  📞 01915557363  |  ⏰ 24 ঘণ্টার মধ্যে Setup Guarantee        │
│              [Order Now →]  [WhatsApp করুন]                  │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Order Form — `/order` Page

"Order Now" click করলে `/order` page এ যাবে (modal নয়, full page — SEO ও UX দুটোর জন্যই ভালো)।

### 4.1 Form Layout

```
Order Page
├── Left column (sticky summary card):
│   ├── Selected Plan name + price
│   ├── Domain (যদি hero search থেকে আসে)
│   └── What's included list
│
└── Right column (form):
    ├── Step 1: Your Details
    │   ├── Domain Name (text input, pre-filled if from search)
    │   ├── Company Name
    │   ├── Your Name *
    │   ├── Phone Number *
    │   ├── Email Address *
    │   ├── Address (textarea)
    │   └── Plan Selection (if not pre-selected)
    │
    ├── Step 2: Payment
    │   ├── [bKash] [Nagad] [Rocket] [Upay]  ← Tab/button select
    │   │
    │   ├── [On select → shows payment info card]:
    │   │   ┌────────────────────────────────────────┐
    │   │   │  💳 bKash এ পাঠান                      │
    │   │   │  Number: 01915557363 (Personal)         │
    │   │   │  [QR Code Image]                        │
    │   │   │  Amount: ৳ XXX (selected plan price)   │
    │   │   └────────────────────────────────────────┘
    │   │
    │   ├── Transaction ID *  (input)
    │   ├── "Send Money From" Number *  (input)
    │   └── [Submit Order →]
```

### 4.2 Payment Method Config
```json
{
  "bkash":  { "number": "01915557363", "type": "Personal",   "qr": "/images/qr/bkash.png"  },
  "nagad":  { "number": "01915557363", "type": "Personal",   "qr": "/images/qr/nagad.png"  },
  "rocket": { "number": "01915557363", "type": "Personal",   "qr": "/images/qr/rocket.png" },
  "upay":   { "number": "01915557363", "type": "Personal",   "qr": "/images/qr/upay.png"   }
}
```

### 4.3 Form Submission Flow
```
User submits → Nuxt server/api/order.post.ts
  ├── Validate all fields
  ├── Send email to admin (bytestacklab@gmail.com) with order details
  ├── Send confirmation email to customer
  └── Return success → redirect to /thank-you
```

**Backend API:** Laravel (MetagenBackend) তে `POST /api/hosting-orders` endpoint বানানো হবে, অথবা Nuxt server API তে directly mail পাঠানো হবে।

---

## 5. Thank You Page — `/thank-you`

```
✅ Animated checkmark (Lottie or CSS)

"আপনার Order সফলভাবে পাঠানো হয়েছে!"
"Your order has been received successfully!"

Order summary box:
  - Order reference: #MGD-XXXXXX (random)
  - Plan: Business Hosting
  - Domain: yourdomain.com
  - Payment: bKash — TxID: XXXXXXXX

"২৪ ঘণ্টার মধ্যে আপনার Domain ও Hosting Setup করা হবে।
আমাদের helpline থেকে 01915557363 নম্বরে আপনাকে call করা হবে।"

[🏠 Home এ ফিরুন]  [📞 এখনই Call করুন]
```

---

## 6. Technical Architecture

### 6.1 Folder Structure
```
Hosting/
├── app/
│   ├── assets/css/main.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.vue
│   │   │   └── SiteFooter.vue
│   │   ├── sections/
│   │   │   ├── HeroSearch.vue        ← Domain search + result
│   │   │   ├── DomainPriceStrip.vue  ← TLD price marquee
│   │   │   ├── HostingPlans.vue      ← 3 plan cards + toggle
│   │   │   ├── WhyUsSection.vue
│   │   │   ├── HowItWorks.vue
│   │   │   ├── FaqSection.vue
│   │   │   └── HelpllineCta.vue
│   │   └── ui/
│   │       ├── PlanCard.vue          ← Pricing card (adapted)
│   │       ├── PaymentSelector.vue   ← bKash/Nagad/Rocket/Upay tabs
│   │       └── DomainResult.vue      ← Available/taken result card
│   ├── pages/
│   │   ├── index.vue                 ← Home (all sections)
│   │   ├── order.vue                 ← Order form
│   │   └── thank-you.vue
│   └── composables/
│       ├── useDomainSearch.ts        ← Domain availability logic
│       └── useOrderForm.ts           ← Order form state + submit
├── server/
│   └── api/
│       ├── domain-check.get.ts       ← RDAP/WhoisXML proxy
│       └── order.post.ts             ← Order save + email send
├── public/
│   └── images/
│       └── qr/                       ← bKash, Nagad, Rocket, Upay QR images
├── nuxt.config.ts
├── tailwind.config.js                ← MetagenFrontend থেকে copy
└── package.json
```

### 6.2 Domain Check API (server/api/domain-check.get.ts)
```typescript
// Strategy 1: RDAP (Free, no key needed)
// GET https://rdap.org/domain/{domain}
// 200 → taken, 404 → likely available
// Limitation: RDAP না থাকলে false positive দিতে পারে

// Strategy 2: WhoisXML API (Recommended)
// API Key: free account at whoisxmlapi.com (500 req/month)
// GET https://www.whoisxmlapi.com/whoisserver/WhoisService
//     ?apiKey={key}&domainName={domain}&outputFormat=JSON
// parsedWhois.registryData.expiresDate → taken
// "No match" → available
```

**সুপারিশ:** WhoisXML API free tier দিয়ে শুরু করা। মাসে ৫০০ request বিনামূল্যে — শুরুতে যথেষ্ট।

### 6.3 Order API (server/api/order.post.ts)
```typescript
// Receive: { domainName, plan, companyName, name, phone, email, address, paymentMethod, txId, sendFrom }
// Validate: Zod schema
// Send email: Nodemailer (SMTP from MetagenBackend .env)
//   - Admin email: bytestacklab@gmail.com (order details)
//   - Customer email: confirmation with order summary
// Return: { success: true, orderId: 'MGD-XXXXXX' }
```

---

## 7. Design System — Hosting Site

### 7.1 Color Scheme
MetagenFrontend এর exact same tokens ব্যবহার করা হবে:
```
Primary:    #303c8e  (brand.primary)
Background: #FFFFFF
Surface:    #F0F2FF
Card:       #FFFFFF
Footer:     #1D1D47  (brand.footer-bg)
Orange:     #FF6B35  (CTAs, featured)
Purple:     #7C3AED  (accents)
```

**Hosting site এর special addition:**
```
Server green:  #22C55E  (uptime, SSL indicators)
Price badge:   orange gradient (#FF6B35 → #F59E0B)
"Popular" glow: orange box shadow
```

### 7.2 Typography
Same as MetagenFrontend — Plus Jakarta Sans (headings), Inter (body).

Hosting-specific additions:
- বাংলা টেক্সটের জন্য: `Hind Siliguri` (already in MetagenFrontend googleFonts)
- Price display: `font-display font-extrabold` with `৳` prefix
- BDT number format: `৳২,০০০` (comma separator)

### 7.3 Key Animations
- Domain search result: fade-in slide-down (250ms)
- Plan toggle (Monthly/Yearly): price morphs with number animation
- Payment method select: card slides in with fade (300ms)
- Order submit: button loading spinner → redirect

---

## 8. Dependencies (package.json)

MetagenFrontend এর subset — শুধু যা দরকার:
```json
{
  "dependencies": {
    "nuxt": "^4.4.2",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@nuxtjs/google-fonts": "^3.2.0",
    "@vueuse/nuxt": "^14.2.1",
    "@vueuse/motion": "^3.0.3",
    "@nuxt/icon": "^2.2.1",
    "@nuxt/image": "^2.0.0",
    "vee-validate": "^4.15.1",
    "yup": "^1.7.1",
    "nodemailer": "^6.x"
  }
}
```

---

## 9. Development Phases

### Phase 1 — Foundation (1 দিন)
- [ ] Nuxt 3 project init in `/Hosting/`
- [ ] Tailwind config copy from MetagenFrontend
- [ ] Global CSS, fonts, design tokens
- [ ] SiteHeader + SiteFooter components

### Phase 2 — Home Page (2-3 দিন)
- [ ] HeroSearch section (search bar + domain check UI)
- [ ] Domain price strip (marquee)
- [ ] HostingPlans section (3 cards + monthly/yearly toggle)
- [ ] WhyUsSection + HowItWorks
- [ ] FaqSection + HelplineCta

### Phase 3 — Domain Check API (1 দিন)
- [ ] `server/api/domain-check.get.ts`
- [ ] WhoisXML API integration
- [ ] Available/Taken result UI
- [ ] Error handling (invalid domain, API down)

### Phase 4 — Order Flow (2 দিন)
- [ ] `/order` page with form
- [ ] PaymentSelector component (bKash/Nagad/Rocket/Upay)
- [ ] QR code display + phone number
- [ ] `server/api/order.post.ts` (validation + email)
- [ ] `/thank-you` page

### Phase 5 — Polish & Deploy (1 দিন)
- [ ] Responsive (mobile) QA
- [ ] SEO: useSeoMeta, OG image
- [ ] `nuxt generate` → static export
- [ ] Deploy to subdomain (hosting.metagendigital.com)

**Total: ~7-8 দিন**

---

## 10. Future Roadmap — WHMCS Integration

### Stage 1 (এখন — Manual):
- Order form → email notification → manual setup
- WhatsApp/phone confirmation

### Stage 2 (3-6 মাস পরে):
- WHMCS install on server
- Verpex reseller API connect
- `server/api/order.post.ts` → WHMCS API call
- Automatic provisioning, invoice generation

### Stage 3 (6-12 মাস পরে):
- Full WHMCS client area
- Auto domain registration via Verpex API
- Renewal reminders (email + SMS)
- Multiple reseller API (Namecheap, etc.)
- MetagenFrontend main site থেকে hosting.metagendigital.com এ link

---

## 11. Files to Create First

### Priority 1 (Bootstrap):
1. `Hosting/nuxt.config.ts`
2. `Hosting/tailwind.config.js`
3. `Hosting/package.json`
4. `Hosting/app/assets/css/main.css`

### Priority 2 (Core Components):
5. `Hosting/app/components/sections/HeroSearch.vue`
6. `Hosting/app/components/sections/HostingPlans.vue`
7. `Hosting/app/components/ui/PlanCard.vue`
8. `Hosting/app/components/ui/PaymentSelector.vue`

### Priority 3 (API & Form):
9. `Hosting/server/api/domain-check.get.ts`
10. `Hosting/server/api/order.post.ts`
11. `Hosting/app/pages/order.vue`
12. `Hosting/app/pages/thank-you.vue`

---

## 12. Admin Notification Email Template

**Subject:** 🆕 New Hosting Order — {domain} — {plan}

```
New Order Received
==================
Order ID:       MGD-XXXXXX
Domain:         yourdomain.com
Plan:           Business Hosting — ৳৭,৯৯০/year
Company:        ABC Company
Customer Name:  মোহাম্মদ তানভীর
Phone:          01XXXXXXXXX
Email:          customer@email.com
Address:        Dhaka, Bangladesh

Payment
-------
Method:         bKash
Number (Send):  01XXXXXXXXX
Transaction ID: TXN123456789
Amount:         ৳৭,৯৯০

Action Required:
→ Verify payment
→ Setup hosting on Verpex
→ Call customer: 01XXXXXXXXX
→ Send confirmation email
```

---

_Plan created: 2026-04-29 | MetaGenDigital Hosting Service_
_Stack: Nuxt 3 + Tailwind CSS | Domain: hosting.metagendigital.com_
