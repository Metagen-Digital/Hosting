<script setup lang="ts">
const { t, locale } = useI18n()

useSeoMeta({
  title: () => locale.value === 'bn' ? 'শর্তাবলী — MetaGen Hosting' : 'Terms & Conditions — MetaGen Hosting',
  description: () => locale.value === 'bn'
    ? 'MetaGenDigital Hosting-এর সেবা গ্রহণের শর্তাবলী ও নীতিমালা।'
    : 'Terms and conditions for using MetaGenDigital Hosting services.',
})

const isBn = computed(() => locale.value === 'bn')

const sections = computed(() => isBn.value ? [
  {
    icon: 'heroicons:clipboard-document-check-16-solid',
    title: '১. অর্ডার ও পেমেন্ট প্রক্রিয়া',
    content: [
      'অর্ডার সম্পন্ন করার পর আপনাকে আমাদের নির্ধারিত মোবাইল ব্যাংকিং নম্বরে (bKash / Nagad / Rocket / Upay) পেমেন্ট পাঠাতে হবে।',
      'পেমেন্ট প্রাপ্তির পর আমাদের টিম আপনার দেওয়া ফোন নম্বরে কল করে অর্ডারটি ডাবল কনফার্ম করবে।',
      'কনফার্মেশন কল ছাড়া কোনো সার্ভিস সেটআপ শুরু হবে না।',
      'ভুল তথ্য বা যোগাযোগ না পেলে অর্ডার প্রক্রিয়া বিলম্বিত হতে পারে।',
    ],
  },
  {
    icon: 'heroicons:server-stack-16-solid',
    title: '২. সার্ভিস সেটআপ',
    content: [
      'কনফার্মেশনের পর সাধারণত কয়েক ঘণ্টার মধ্যে — সর্বোচ্চ ২৪ ঘণ্টার মধ্যে Domain ও Hosting সেটআপ করা হবে।',
      'সেটআপ সম্পন্ন হলে আপনাকে ফোনে বা ইমেইলে জানানো হবে।',
      'সার্ভিস চালু হওয়ার পর লগইন তথ্য ও প্রয়োজনীয় নির্দেশনা সরবরাহ করা হবে।',
    ],
  },
  {
    icon: 'heroicons:arrow-path-16-solid',
    title: '৩. রিফান্ড নীতি',
    subsections: [
      {
        subtitle: 'ডোমেইন রেজিস্ট্রেশন',
        points: [
          'ডোমেইন রেজিস্ট্রেশন সম্পন্ন হলে কোনো অবস্থাতেই রিফান্ড প্রদান করা হবে না।',
          'ডোমেইন রেজিস্ট্রেশন একটি তৃতীয় পক্ষের (Registry) মাধ্যমে হয়, তাই এটি ফেরতযোগ্য নয়।',
        ],
      },
      {
        subtitle: 'মাসিক হোস্টিং প্যাকেজ',
        points: [
          'মাসিক হোস্টিং প্যাকেজে কোনো রিফান্ড প্রদান করা হবে না।',
          'সার্ভিস একবার চালু হলে সেই মাসের পেমেন্ট সম্পূর্ণ অপরিবর্তনীয়।',
        ],
      },
      {
        subtitle: 'বার্ষিক হোস্টিং প্যাকেজ',
        points: [
          'বার্ষিক প্যাকেজে সার্ভিস পছন্দ না হলে সেটআপের তারিখ থেকে ৩০ দিনের মধ্যে বাতিলের আবেদন করতে পারবেন।',
          '৩০ দিনের মধ্যে বাতিল করলে প্রথম মাসের হোস্টিং মূল্য কেটে রেখে বাকি অর্থ ফেরত দেওয়া হবে।',
          '৩০ দিন পার হয়ে গেলে কোনো রিফান্ড প্রযোজ্য হবে না।',
        ],
      },
      {
        subtitle: 'সাধারণ শর্ত',
        points: [
          'Domain ও Hosting উভয়ই সক্রিয় হয়ে যাওয়ার পর কোনো রিফান্ড প্রদান করা হবে না।',
          'সার্ভার অপব্যবহার, স্প্যাম বা অবৈধ কার্যকলাপের কারণে সার্ভিস বন্ধ হলে কোনো রিফান্ড প্রযোজ্য নয়।',
        ],
      },
    ],
  },
  {
    icon: 'heroicons:arrows-right-left-16-solid',
    title: '৪. ডোমেইন ট্রান্সফার',
    content: [
      'আপনি চাইলে যেকোনো সময় আপনার ডোমেইন অন্য কোনো প্রোভাইডারের কাছে ট্রান্সফার করতে পারবেন।',
      'ডোমেইন ট্রান্সফারের জন্য আমাদের সাথে যোগাযোগ করুন — আমরা প্রয়োজনীয় Authorization Code (EPP Code) সরবরাহ করব।',
      'ট্রান্সফার প্রক্রিয়ায় আমাদের কোনো বাধা নেই, তবে সময় লাগতে পারে ৫–৭ কার্যদিবস।',
      'ডোমেইন ট্রান্সফারের জন্য আলাদা কোনো ফি নেওয়া হয় না।',
    ],
  },
  {
    icon: 'heroicons:shield-check-16-solid',
    title: '৫. ব্যবহারের শর্তাবলী',
    content: [
      'আমাদের সার্ভারে কোনো অবৈধ, ক্ষতিকর বা স্প্যাম কন্টেন্ট হোস্ট করা যাবে না।',
      'নিয়ম লঙ্ঘন করলে আমরা বিনা নোটিশে সার্ভিস বন্ধ করার অধিকার রাখি।',
      'সার্ভিস সংক্রান্ত যেকোনো সমস্যায় আমাদের সাপোর্ট টিমে যোগাযোগ করুন।',
    ],
  },
  {
    icon: 'heroicons:phone-16-solid',
    title: '৬. যোগাযোগ',
    content: [
      'যেকোনো প্রশ্ন বা সমস্যায় আমাদের সাথে যোগাযোগ করুন:',
    ],
    contact: true,
  },
] : [
  {
    icon: 'heroicons:clipboard-document-check-16-solid',
    title: '1. Order & Payment Process',
    content: [
      'After placing your order, you must send payment to our designated mobile banking number (bKash / Nagad / Rocket / Upay).',
      'Once payment is received, our team will call you at the provided phone number to double-confirm your order.',
      'No service setup will begin without a confirmation call.',
      'Incorrect information or failure to respond may delay your order processing.',
    ],
  },
  {
    icon: 'heroicons:server-stack-16-solid',
    title: '2. Service Setup',
    content: [
      'After confirmation, domain and hosting will typically be set up within a few hours — maximum 24 hours.',
      'You will be notified via phone or email once setup is complete.',
      'Login credentials and necessary instructions will be provided upon service activation.',
    ],
  },
  {
    icon: 'heroicons:arrow-path-16-solid',
    title: '3. Refund Policy',
    subsections: [
      {
        subtitle: 'Domain Registration',
        points: [
          'No refund will be issued once domain registration is completed.',
          'Domain registration is processed through a third-party Registry and is therefore non-refundable.',
        ],
      },
      {
        subtitle: 'Monthly Hosting Package',
        points: [
          'No refund is available for monthly hosting packages.',
          'Once the service is activated, the payment for that month is non-refundable.',
        ],
      },
      {
        subtitle: 'Yearly Hosting Package',
        points: [
          'If you are not satisfied with the yearly package, you may request cancellation within 30 days of the setup date.',
          'If cancelled within 30 days, a refund will be issued after deducting the first month\'s hosting cost.',
          'No refund is applicable after 30 days have passed.',
        ],
      },
      {
        subtitle: 'General Conditions',
        points: [
          'No refund will be issued once both domain and hosting are fully activated.',
          'No refund applies if the service is suspended due to server misuse, spam, or illegal activity.',
        ],
      },
    ],
  },
  {
    icon: 'heroicons:arrows-right-left-16-solid',
    title: '4. Domain Transfer',
    content: [
      'You may transfer your domain to any other provider at any time.',
      'To initiate a domain transfer, simply contact us — we will provide the necessary Authorization Code (EPP Code).',
      'We place no restrictions on domain transfers; however, the process may take 5–7 business days.',
      'No additional fee is charged for domain transfers.',
    ],
  },
  {
    icon: 'heroicons:shield-check-16-solid',
    title: '5. Acceptable Use',
    content: [
      'Hosting illegal, harmful, or spam content on our servers is strictly prohibited.',
      'We reserve the right to suspend services without notice in case of policy violations.',
      'For any service-related issues, please contact our support team.',
    ],
  },
  {
    icon: 'heroicons:phone-16-solid',
    title: '6. Contact Us',
    content: [
      'For any questions or concerns, please reach out to us:',
    ],
    contact: true,
  },
])
</script>

<template>
  <div class="min-h-screen bg-brand-surface">

    <!-- Hero -->
    <div class="bg-brand-primary">
      <div class="container-content py-14 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-5">
          <Icon name="heroicons:document-text-16-solid" class="w-3.5 h-3.5" />
          {{ isBn ? 'আইনি নথি' : 'Legal Document' }}
        </div>
        <h1 class="font-display font-extrabold text-3xl md:text-4xl text-white mb-3">
          {{ isBn ? 'শর্তাবলী ও নীতিমালা' : 'Terms & Conditions' }}
        </h1>
        <p class="text-white/70 text-sm max-w-lg mx-auto">
          {{ isBn
            ? 'MetaGenDigital Hosting-এর সেবা ব্যবহারের আগে এই শর্তাবলী মনোযোগ দিয়ে পড়ুন।'
            : 'Please read these terms carefully before using MetaGenDigital Hosting services.'
          }}
        </p>
        <p class="mt-3 text-white/50 text-xs">
          {{ isBn ? 'সর্বশেষ আপডেট: মে ২০২৫' : 'Last updated: May 2025' }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="container-content py-12">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Intro card -->
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">
          <Icon name="heroicons:information-circle-16-solid" class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p class="text-sm text-blue-800 leading-relaxed">
            {{ isBn
              ? 'আমাদের সেবা গ্রহণ করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন। কোনো প্রশ্ন থাকলে অর্ডার দেওয়ার আগেই আমাদের সাথে যোগাযোগ করুন।'
              : 'By using our services, you agree to the terms outlined below. If you have any questions, please contact us before placing an order.'
            }}
          </p>
        </div>

        <!-- Sections -->
        <div
          v-for="(section, i) in sections"
          :key="i"
          class="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden"
        >
          <!-- Section header -->
          <div class="flex items-center gap-3 px-6 py-4 border-b border-brand-border bg-brand-surface">
            <span class="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Icon :name="section.icon" class="w-4 h-4 text-brand-primary" />
            </span>
            <h2 class="font-display font-bold text-base text-brand-primary">{{ section.title }}</h2>
          </div>

          <div class="px-6 py-5 space-y-4">
            <!-- Simple content list -->
            <ul v-if="section.content" class="space-y-2.5">
              <li
                v-for="(point, j) in section.content"
                :key="j"
                class="flex items-start gap-2.5 text-sm text-brand-text-secondary leading-relaxed"
              >
                <Icon name="heroicons:check-circle-16-solid" class="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>{{ point }}</span>
              </li>
            </ul>

            <!-- Contact block -->
            <div v-if="section.contact" class="mt-1 space-y-2.5">
              <a href="tel:+8801970222573" class="flex items-center gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-primary/40 transition-colors group">
                <span class="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Icon name="heroicons:phone-16-solid" class="w-4 h-4 text-brand-primary" />
                </span>
                <div>
                  <p class="text-xs text-brand-text-muted">{{ isBn ? 'ফোন' : 'Phone' }}</p>
                  <p class="text-sm font-semibold text-brand-primary group-hover:underline">+88 01970-222573</p>
                </div>
              </a>
              <a href="mailto:hosting@metagendigital.com" class="flex items-center gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-primary/40 transition-colors group">
                <span class="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Icon name="heroicons:envelope-16-solid" class="w-4 h-4 text-brand-primary" />
                </span>
                <div>
                  <p class="text-xs text-brand-text-muted">{{ isBn ? 'ইমেইল' : 'Email' }}</p>
                  <p class="text-sm font-semibold text-brand-primary group-hover:underline">hosting@metagendigital.com</p>
                </div>
              </a>
            </div>

            <!-- Subsections (refund policy) -->
            <div v-if="section.subsections" class="space-y-4">
              <div
                v-for="(sub, k) in section.subsections"
                :key="k"
                class="rounded-xl border border-brand-border p-4"
              >
                <h3 class="text-sm font-bold text-brand-primary mb-2.5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-brand-primary inline-block" />
                  {{ sub.subtitle }}
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="(point, l) in sub.points"
                    :key="l"
                    class="flex items-start gap-2 text-sm text-brand-text-secondary leading-relaxed"
                  >
                    <Icon name="heroicons:chevron-right-16-solid" class="w-3.5 h-3.5 text-brand-primary/60 shrink-0 mt-0.5" />
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer note -->
        <div class="text-center py-4">
          <p class="text-xs text-brand-text-muted">
            {{ isBn
              ? 'এই শর্তাবলী পরিবর্তনের অধিকার MetaGenDigital-এর আছে। পরিবর্তন হলে এই পেজে আপডেট করা হবে।'
              : 'MetaGenDigital reserves the right to update these terms. Changes will be reflected on this page.'
            }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
