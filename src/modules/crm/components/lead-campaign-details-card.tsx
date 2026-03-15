"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Lead } from "../types";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  paid_search: "Ücretli arama",
  paid_social: "Ücretli sosyal",
  organic: "Organik",
  referral: "Tavsiye",
  direct: "Doğrudan",
  other: "Diğer",
};

const SOURCE_PLATFORM_LABELS: Record<string, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  linkedin_ads: "LinkedIn Ads",
  tiktok_ads: "TikTok Ads",
  website_form: "Web sitesi formu",
  phone_call: "Telefon",
  other: "Diğer",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
      <p className="break-all font-semibold">{value}</p>
    </div>
  );
}

export function hasLeadCampaignDetails(lead: Lead): boolean {
  return !!(
    lead.sourceType ||
    lead.sourcePlatform ||
    lead.utmSource ||
    lead.utmMedium ||
    lead.utmCampaign ||
    lead.gclid ||
    lead.fbclid ||
    lead.consentMarketing !== undefined ||
    lead.consentMarketingSource
  );
}

interface LeadCampaignDetailsCardProps {
  lead: Lead;
}

export function LeadCampaignDetailsCard({ lead }: LeadCampaignDetailsCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="lg:col-span-2">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between p-0 hover:bg-transparent"
            >
              <CardTitle className="text-lg">Kampanya detayları</CardTitle>
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <DetailRow
              label="Kaynak türü"
              value={
                lead.sourceType
                  ? SOURCE_TYPE_LABELS[lead.sourceType] ?? lead.sourceType
                  : undefined
              }
            />
            <DetailRow
              label="Kaynak platformu"
              value={
                lead.sourcePlatform
                  ? SOURCE_PLATFORM_LABELS[lead.sourcePlatform] ??
                    lead.sourcePlatform
                  : undefined
              }
            />
            <DetailRow label="UTM Kaynak" value={lead.utmSource} />
            <DetailRow label="UTM Ortam" value={lead.utmMedium} />
            <DetailRow label="UTM Kampanya" value={lead.utmCampaign} />
            <DetailRow label="Google Click ID (gclid)" value={lead.gclid} />
            <DetailRow label="Meta Click ID (fbclid)" value={lead.fbclid} />
            {lead.consentMarketing !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Pazarlama izni
                </h4>
                <p className="font-semibold">{lead.consentMarketing ? "Evet" : "Hayır"}</p>
              </div>
            )}
            <DetailRow
              label="İzin kaynağı"
              value={lead.consentMarketingSource}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
