import { z } from "zod";

/** Non-empty string; use z.string().email() in form/API schemas if stricter validation is needed. */
const emailLike = z.string().min(1);

const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "lost",
  "converted",
]);

const leadSourceTypeEnum = z.enum([
  "paid_search",
  "paid_social",
  "organic",
  "referral",
  "direct",
  "other",
]);

const leadSourcePlatformEnum = z.enum([
  "google_ads",
  "meta_ads",
  "linkedin_ads",
  "tiktok_ads",
  "website_form",
  "phone_call",
  "other",
]);

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  email: emailLike,
  sourceId: z.string().optional(),
  status: leadStatusEnum,
  lifecycleId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),

  archivedAt: z.string().optional(),
  personId: z.string().optional(),
  duplicateOfLeadId: z.string().optional(),

  sourceType: leadSourceTypeEnum.optional(),
  sourcePlatform: leadSourcePlatformEnum.optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),

  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referrer: z.string().optional(),

  consentMarketing: z.boolean().optional(),
  consentMarketingSource: z.string().optional(),
  consentInformative: z.boolean().optional(),

  convertedAt: z.string().optional(),
  convertedByUserId: z.string().optional(),
});

export const personSchema = z.object({
  id: z.string(),
  leadId: z.string().optional(),
  name: z.string(),
  phone: z.string().optional(),
  email: emailLike,
  notes: z.string().optional(),
  archivedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paymentPlanSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  downPaymentAmount: z.number(),
  installmentCount: z.number(),
  installmentAmount: z.number(),
  balloonAmount: z.number(),
  balloonDueMonth: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const dealStageEnum = z.enum([
  "inquiry",
  "meeting",
  "offer",
  "negotiation",
  "won",
  "lost",
]);

export const dealSchema = z.object({
  id: z.string(),
  personId: z.string(),
  unitId: z.string().optional(),
  title: z.string(),
  value: z.number(),
  currency: z.string().optional(),
  stage: dealStageEnum,
  lifecycleId: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  paymentPlan: paymentPlanSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const timelineEventEntityTypeEnum = z.enum(["lead", "person", "deal"]);
const timelineEventTypeEnum = z.enum([
  "note",
  "call",
  "meeting",
  "email",
  "status_change",
  "deal_created",
  "deal_stage_changed",
]);

export const timelineEventSchema = z.object({
  id: z.string(),
  entityType: timelineEventEntityTypeEnum,
  entityId: z.string(),
  type: timelineEventTypeEnum,
  title: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdBy: z.string().optional(),
  createdAt: z.string(),
});

export const lifecycleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const leadSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: emailLike,
  role: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const leadArraySchema = z.array(leadSchema);
export const personArraySchema = z.array(personSchema);
export const dealArraySchema = z.array(dealSchema);
export const paymentPlanArraySchema = z.array(paymentPlanSchema);
export const timelineEventArraySchema = z.array(timelineEventSchema);
export const lifecycleArraySchema = z.array(lifecycleSchema);
export const leadSourceArraySchema = z.array(leadSourceSchema);
export const teamArraySchema = z.array(teamSchema);

// --- Server action input schemas (for .safeParse() at boundaries) ---

export const idParamSchema = z.string().min(1, "ID is required");

export const savePaymentPlanInputSchema = z.object({
  downPaymentAmount: z.number(),
  installmentCount: z.number(),
  installmentAmount: z.number(),
  balloonAmount: z.number(),
  balloonDueMonth: z.number().nullable(),
});

export const updateDealPayloadSchema = z
  .object({
    title: z.string().optional(),
    value: z.number().optional(),
    stage: dealStageEnum.optional(),
    lifecycleId: z.string().nullable().optional(),
    personId: z.string().optional(),
    unitId: z.string().nullable().optional(),
    expectedCloseDate: z.string().nullable().optional(),
  })
  .strict();

export const updateLeadPayloadSchema = z
  .object({
    status: leadStatusEnum.optional(),
    lifecycleId: z.string().nullable().optional(),
    sourceId: z.string().nullable().optional(),
  })
  .strict();

const phoneRequired = z
  .string()
  .min(1, "Telefon numarası zorunludur")
  .regex(
    /^\+[1-9]\d{1,14}$/,
    "Geçerli bir uluslararası telefon numarası girin (örn. +905551112233)",
  );

export const createLeadPayloadSchema = z
  .object({
    name: z.string().min(1, "Ad Soyad zorunludur"),
    email: z
      .string()
      .min(1, "E-posta zorunludur")
      .email("Geçerli bir e-posta adresi girin"),
    phone: phoneRequired,
    sourceId: z.string().nullable().optional(),
    status: leadStatusEnum.default("new"),
    lifecycleId: z.string().nullable().optional(),
    notes: z.string().optional(),

    sourceType: leadSourceTypeEnum.optional(),
    sourcePlatform: leadSourcePlatformEnum.optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),

    gclid: z.string().optional(),
    fbclid: z.string().optional(),
    referrer: z.string().optional(),

    consentMarketing: z.boolean().optional(),
    consentMarketingSource: z.string().optional(),
    consentInformative: z.boolean().optional(),
  })
  .strict();

export const updateLeadDetailsPayloadSchema = z
  .object({
    name: z.string().min(1, "Ad Soyad zorunludur"),
    email: z
      .string()
      .min(1, "E-posta zorunludur")
      .email("Geçerli bir e-posta adresi girin"),
    phone: phoneRequired,
    sourceId: z.string().nullable().optional(),
    status: leadStatusEnum.optional(),
    lifecycleId: z.string().nullable().optional(),
    notes: z.string().optional(),

    sourceType: leadSourceTypeEnum.optional(),
    sourcePlatform: leadSourcePlatformEnum.optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),

    gclid: z.string().optional(),
    fbclid: z.string().optional(),
    referrer: z.string().optional(),

    consentMarketing: z.boolean().optional(),
    consentMarketingSource: z.string().optional(),
    consentInformative: z.boolean().optional(),
  })
  .strict();

export const createPersonPayloadSchema = z
  .object({
    name: z.string().min(1, "Ad Soyad zorunludur"),
    email: z
      .string()
      .min(1, "E-posta zorunludur")
      .email("Geçerli bir e-posta adresi girin"),
    phone: phoneRequired,
    notes: z.string().optional(),
  })
  .strict();

export const updatePersonDetailsPayloadSchema = z
  .object({
    name: z.string().min(1, "Ad Soyad zorunludur"),
    email: z
      .string()
      .min(1, "E-posta zorunludur")
      .email("Geçerli bir e-posta adresi girin"),
    phone: phoneRequired,
    notes: z.string().optional(),
  })
  .strict();

export const createLeadSourcePayloadSchema = z
  .object({
    name: z.string().min(1, "Ad zorunludur"),
    description: z.string().optional(),
    order: z.number(),
    color: z.string().optional(),
  })
  .strict();

export const updateLeadSourcePayloadSchema = z
  .object({
    name: z.string().min(1, "Ad zorunludur").optional(),
    description: z.string().nullable().optional(),
    order: z.number().optional(),
    color: z.string().nullable().optional(),
  })
  .strict();

export const convertLeadOptionsSchema = z
  .object({
    createDeal: z.boolean().optional(),
  })
  .strict()
  .optional();

/** Incoming lead form submission payload (e.g. from LP webhook or API). */
export const leadSubmissionPayloadSchema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().min(1).email(),
    phone: z.string().min(1),
    phone_raw: z.string().min(1),
    phone_normalized: z
      .string()
      .min(1)
      .regex(
        /^\+[1-9]\d{1,14}$/,
        "phone_normalized must be E.164 (e.g. +905551112233)",
      ),
    consent_informative: z.boolean(),
    consent_contact: z.boolean(),
    submitted_at: z.string().datetime({ offset: true }),
    ip: z.string(),
    user_agent: z.string(),
    referrer: z.string(),
  })
  .strict();

export type LeadSubmissionPayload = z.infer<typeof leadSubmissionPayloadSchema>;

export type Lead = z.infer<typeof leadSchema>;
export type Person = z.infer<typeof personSchema>;
export type PaymentPlan = z.infer<typeof paymentPlanSchema>;
export type Deal = z.infer<typeof dealSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type Lifecycle = z.infer<typeof lifecycleSchema>;
export type LeadSource = z.infer<typeof leadSourceSchema>;
export type Team = z.infer<typeof teamSchema>;
