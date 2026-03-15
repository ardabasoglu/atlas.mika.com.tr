import { NextRequest, NextResponse } from "next/server";
import {
  createLead,
  findExistingLeadMatchingPayload,
  getLeadSourceIdForPlatform,
  getLifecycles,
} from "@/modules/crm/services";
import {
  createLeadPayloadSchema,
  leadSubmissionPayloadSchema,
  type LeadSubmissionPayload,
} from "@/modules/crm/schemas";
import type { z } from "zod";
import { formatZodError } from "@/lib/utils";
import { timingSafeEqual } from "crypto";

const API_KEY_HEADER = "x-api-key";
const BEARER_PREFIX = "Bearer ";

function getSubmittedApiKey(request: NextRequest): string | null {
  const header = request.headers.get(API_KEY_HEADER);
  if (header) return header.trim();
  const auth = request.headers.get("authorization");
  if (auth?.startsWith(BEARER_PREFIX)) return auth.slice(BEARER_PREFIX.length).trim();
  return null;
}

function verifyApiKey(provided: string | null): boolean {
  const expected = process.env.LEAD_SUBMISSION_API_KEY;
  if (!expected || expected.length === 0) return false;
  if (!provided || provided.length === 0) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function getAllowedOrigins(): string[] {
  const raw = process.env.LEAD_SUBMISSION_ALLOWED_ORIGINS;
  if (!raw?.trim()) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function getAllowedDomains(): string[] {
  const raw = process.env.LEAD_SUBMISSION_ALLOWED_DOMAINS;
  if (!raw?.trim()) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function checkCallingDomain(request: NextRequest): boolean {
  const origins = getAllowedOrigins();
  const domains = getAllowedDomains();
  if (origins.length === 0 && domains.length === 0) return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origins.length > 0 && origin && origins.includes(origin)) return true;
  if (domains.length > 0) {
    try {
      if (origin) {
        const u = new URL(origin);
        if (domains.some((d) => u.hostname === d || u.hostname.endsWith("." + d)))
          return true;
      }
      if (referer) {
        const u = new URL(referer);
        if (domains.some((d) => u.hostname === d || u.hostname.endsWith("." + d)))
          return true;
      }
    } catch {
      // invalid URL
    }
  }
  return false;
}

function parseUtmFromReferrer(referrer: string): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
  /** True if any Google Ads click/signaling param is present (gclid, gad_source, gbraid, gad_campaignid). */
  hasGoogleAdsParams: boolean;
} {
  try {
    const u = new URL(referrer);
    const q = u.searchParams;
    const gclid = q.get("gclid") ?? undefined;
    const gadSource = q.get("gad_source");
    const gbraid = q.get("gbraid");
    const gadCampaignId = q.get("gad_campaignid");
    const hasGoogleAdsParams =
      Boolean(gclid) ||
      Boolean(gadSource) ||
      Boolean(gbraid) ||
      Boolean(gadCampaignId);
    return {
      utmSource: q.get("utm_source") ?? undefined,
      utmMedium: q.get("utm_medium") ?? undefined,
      utmCampaign: q.get("utm_campaign") ?? undefined,
      gclid,
      fbclid: q.get("fbclid") ?? undefined,
      hasGoogleAdsParams,
    };
  } catch {
    return { hasGoogleAdsParams: false };
  }
}

function inferSourcePlatformFromUtm(utmSource: string | undefined): "meta_ads" | "google_ads" | "other" | undefined {
  if (!utmSource) return undefined;
  const s = utmSource.toLowerCase();
  if (s === "ig" || s === "facebook" || s === "fb" || s === "meta") return "meta_ads";
  if (s === "google" || s === "cpc" || s === "gdn") return "google_ads";
  return "other";
}

/** Infer platform from UTM and/or click IDs (gclid → google_ads, fbclid → meta_ads). UTM takes precedence. */
function inferSourcePlatform(utm: {
  utmSource?: string;
  hasGoogleAdsParams: boolean;
  fbclid?: string;
}): "meta_ads" | "google_ads" | "other" | undefined {
  const fromUtm = inferSourcePlatformFromUtm(utm.utmSource);
  if (fromUtm !== undefined) return fromUtm;
  if (utm.hasGoogleAdsParams) return "google_ads";
  if (utm.fbclid) return "meta_ads";
  return undefined;
}

function inferSourceType(sourcePlatform: "meta_ads" | "google_ads" | "other" | undefined): "paid_social" | "paid_search" | "other" | undefined {
  if (!sourcePlatform) return undefined;
  if (sourcePlatform === "google_ads") return "paid_search";
  if (sourcePlatform === "meta_ads") return "paid_social";
  return "other";
}

function mapSubmissionToCreateLeadPayload(
  body: LeadSubmissionPayload,
): z.input<typeof createLeadPayloadSchema> {
  const utm = parseUtmFromReferrer(body.referrer);
  const sourcePlatform = inferSourcePlatform(utm);
  const sourceType = inferSourceType(sourcePlatform);
  return {
    name: `${body.first_name} ${body.last_name}`.trim(),
    email: body.email,
    phone: body.phone_normalized,
    status: "new",
    consentMarketing: body.consent_contact,
    consentMarketingSource: "lp_form",
    consentInformative: body.consent_informative,
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    gclid: utm.gclid,
    fbclid: utm.fbclid,
    referrer: body.referrer,
    sourcePlatform: sourcePlatform ?? undefined,
    sourceType: sourceType ?? undefined,
  };
}

export async function POST(request: NextRequest) {
  if (!verifyApiKey(getSubmittedApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkCallingDomain(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = leadSubmissionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const basePayload = mapSubmissionToCreateLeadPayload(parsed.data);
    const existingId = await findExistingLeadMatchingPayload({
      email: basePayload.email,
      phone: basePayload.phone ?? null,
      name: basePayload.name,
      referrer: basePayload.referrer ?? null,
      consentMarketing: basePayload.consentMarketing ?? null,
      consentInformative: basePayload.consentInformative ?? null,
    });
    if (existingId) {
      return NextResponse.json({ leadId: existingId }, { status: 200 });
    }
    const [lifecycles, sourceId] = await Promise.all([
      getLifecycles(),
      basePayload.sourcePlatform === "google_ads" ||
        basePayload.sourcePlatform === "meta_ads"
        ? getLeadSourceIdForPlatform(basePayload.sourcePlatform)
        : Promise.resolve(null),
    ]);
    let payload: z.input<typeof createLeadPayloadSchema> = {
      ...basePayload,
      ...(sourceId && { sourceId }),
      ...(lifecycles[0]?.id && { lifecycleId: lifecycles[0].id }),
    };
    const lead = await createLead(payload);
    return NextResponse.json({ leadId: lead.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
