// prisma/seed.ts
import { prisma } from "@/lib/prisma";

async function seedLifecycles() {
  const lifecycleData = [
    {
      id: 'lifecycle_new_lead',
      name: 'Yeni aday',
      description: 'Yeni oluşturulan aday',
      order: 1,
      color: '#0ea5e9',
    },
    {
      id: 'lifecycle_first_contact',
      name: 'İlk temas',
      description: 'İlk iletişim kurulan aday',
      order: 2,
      color: '#6366f1',
    },
    {
      id: 'lifecycle_evaluation',
      name: 'Değerlendirme',
      description: 'Aday değerlendirme aşamasında',
      order: 3,
      color: '#f97316',
    },
    {
      id: 'lifecycle_customer',
      name: 'Müşteri',
      description: 'Aktif müşteri',
      order: 4,
      color: '#22c55e',
    },
    {
      id: 'lifecycle_past_customer',
      name: 'Eski müşteri',
      description: 'Daha önce müşteri olmuş aday',
      order: 5,
      color: '#6b7280',
    },
  ];

  for (const lifecycle of lifecycleData) {
    await prisma.lifecycle.upsert({
      where: { id: lifecycle.id },
      update: {
        name: lifecycle.name,
        description: lifecycle.description,
        order: lifecycle.order,
        color: lifecycle.color,
      },
      create: lifecycle,
    });
  }
}

async function seedLeadSources() {
  const leadSourceData = [
    // Paid search
    {
      id: 'lead_source_google_ads_search',
      name: 'Google Ads',
      description: 'Google Ads reklam kampanyaları',
      order: 1,
      color: '#2563eb',
    },
    // Paid social
    {
      id: 'lead_source_meta_ads',
      name: 'Meta Ads',
      description: 'Facebook ve Instagram reklamları',
      order: 2,
      color: '#ec4899',
    },
    {
      id: 'lead_source_linkedin_ads',
      name: 'LinkedIn Ads',
      description: 'LinkedIn reklam kampanyaları',
      order: 3,
      color: '#0ea5e9',
    },
    {
      id: 'lead_source_tiktok_ads',
      name: 'TikTok Ads',
      description: 'TikTok reklam kampanyaları',
      order: 4,
      color: '#8b5cf6',
    },
    // Website / own properties
    {
      id: 'lead_source_website_form',
      name: 'Web formu',
      description: 'Web sitesi iletişim / teklif formu',
      order: 5,
      color: '#22c55e',
    },
    {
      id: 'lead_source_live_chat',
      name: 'Canlı sohbet',
      description: 'Web sitesi canlı sohbet / chatbot',
      order: 6,
      color: '#14b8a6',
    },
    // Email
    {
      id: 'lead_source_email_campaign',
      name: 'E-posta kampanyası',
      description: 'Toplu e-posta / bülten gönderileri',
      order: 7,
      color: '#f97316',
    },
    {
      id: 'lead_source_outbound_email',
      name: 'Outbound e-posta',
      description: 'Bire bir outbound e-posta',
      order: 8,
      color: '#ea580c',
    },
    // Organic search
    {
      id: 'lead_source_organic_search',
      name: 'Organik arama',
      description: 'Google organik arama / SEO',
      order: 9,
      color: '#16a34a',
    },
    // Social (organic)
    {
      id: 'lead_source_instagram_dm',
      name: 'Instagram DM',
      description: 'Instagram mesaj / yorum',
      order: 10,
      color: '#db2777',
    },
    {
      id: 'lead_source_linkedin_dm',
      name: 'LinkedIn mesajı',
      description: 'LinkedIn mesaj / InMail',
      order: 11,
      color: '#0284c7',
    },
    // Referrals / partners
    {
      id: 'lead_source_customer_referral',
      name: 'Müşteri tavsiyesi',
      description: 'Mevcut müşteriden gelen tavsiye',
      order: 12,
      color: '#22c55e',
    },
    {
      id: 'lead_source_partner_referral',
      name: 'İş ortağı',
      description: 'Bayi, aracı, çözüm ortağı',
      order: 13,
      color: '#0f766e',
    },
    // Events & offline
    {
      id: 'lead_source_event',
      name: 'Etkinlik / fuar',
      description: 'Fuar, konferans, seminer',
      order: 14,
      color: '#a855f7',
    },
    {
      id: 'lead_source_phone_call',
      name: 'Telefon araması',
      description: 'Doğrudan gelen telefon araması',
      order: 15,
      color: '#facc15',
    },
    // Marketplaces & listings
    {
      id: 'lead_source_portal_listing',
      name: 'İlan siteleri',
      description: 'Sahibinden, Hepsiemlak vb.',
      order: 16,
      color: '#4b5563',
    },
    // Other / unknown
    {
      id: 'lead_source_other',
      name: 'Diğer',
      description: 'Diğer / bilinmeyen kaynak',
      order: 17,
      color: '#6b7280',
    },
  ];

  for (const leadSource of leadSourceData) {
    await prisma.leadSource.upsert({
      where: { id: leadSource.id },
      update: {
        name: leadSource.name,
        description: leadSource.description,
        order: leadSource.order,
        color: leadSource.color,
      },
      create: leadSource,
    });
  }
}

async function main() {
  await seedLifecycles();
  await seedLeadSources();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });