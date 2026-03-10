"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { z } from "zod";
import type { Lifecycle, Lead, LeadSource } from "../types";
import { createLeadPayloadSchema } from "../schemas";
import { createLeadAction, updateLeadDetailsAction } from "../server-actions";

const LEAD_SOURCE_TYPES = [
  { value: "paid_search", label: "Ücretli arama" },
  { value: "paid_social", label: "Ücretli sosyal" },
  { value: "organic", label: "Organik" },
  { value: "referral", label: "Tavsiye" },
  { value: "direct", label: "Doğrudan" },
  { value: "other", label: "Diğer" },
] as const;

const LEAD_SOURCE_PLATFORMS = [
  { value: "google_ads", label: "Google Ads" },
  { value: "meta_ads", label: "Meta Ads" },
  { value: "linkedin_ads", label: "LinkedIn Ads" },
  { value: "tiktok_ads", label: "TikTok Ads" },
  { value: "website_form", label: "Web sitesi formu" },
  { value: "phone_call", label: "Telefon" },
  { value: "other", label: "Diğer" },
] as const;

type LeadFormMode = "create" | "edit";

interface LeadFormProps {
  mode: LeadFormMode;
  lifecycles: Lifecycle[];
  leadSources: LeadSource[];
  initialLead?: Lead;
  leadId?: string;
}

interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  sourceId: string;
  status: Lead["status"];
  lifecycleId: string;
  notes: string;

  sourceType: string;
  sourcePlatform: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  gclid: string;
  fbclid: string;
  consentMarketing: boolean;
  consentMarketingSource: string;
}

interface LeadFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  general?: string;
}

const initialFormState: LeadFormState = {
  name: "",
  email: "",
  phone: "",
  sourceId: "",
  status: "new",
  lifecycleId: "",
  notes: "",

  sourceType: "",
  sourcePlatform: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  gclid: "",
  fbclid: "",
  consentMarketing: false,
  consentMarketingSource: "",
};

function LeadForm({ mode, lifecycles, leadSources, initialLead, leadId }: LeadFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<LeadFormState>(() => {
    if (!initialLead) {
      return initialFormState;
    }
    return {
      name: initialLead.name,
      email: initialLead.email,
      phone: initialLead.phone ?? "",
      sourceId: initialLead.sourceId ?? "",
      status: initialLead.status,
      lifecycleId: initialLead.lifecycleId ?? "",
      notes: initialLead.notes ?? "",
      sourceType: initialLead.sourceType ?? "",
      sourcePlatform: initialLead.sourcePlatform ?? "",
      utmSource: initialLead.utmSource ?? "",
      utmMedium: initialLead.utmMedium ?? "",
      utmCampaign: initialLead.utmCampaign ?? "",
      gclid: initialLead.gclid ?? "",
      fbclid: initialLead.fbclid ?? "",
      consentMarketing: initialLead.consentMarketing ?? false,
      consentMarketingSource: initialLead.consentMarketingSource ?? "",
    };
  });
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignSectionOpen, setCampaignSectionOpen] = useState(false);

  useEffect(() => {
    if (!formState.lifecycleId && lifecycles.length > 0) {
      setFormState((previous) => ({
        ...previous,
        lifecycleId: lifecycles[0]!.id,
      }));
    }
  }, [formState.lifecycleId, lifecycles]);

  useEffect(() => {
    if (!formState.sourceId && leadSources.length > 0) {
      setFormState((previous) => ({
        ...previous,
        sourceId: leadSources[0]!.id,
      }));
    }
  }, [formState.sourceId, leadSources]);

  const handleChange =
    (field: keyof LeadFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
    };

  const setCampaignField = <K extends keyof LeadFormState>(
    field: K,
    value: LeadFormState[K],
  ) => {
    setFormState((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: z.input<typeof createLeadPayloadSchema> = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone || undefined,
        sourceId: formState.sourceId || null,
        status: formState.status,
        lifecycleId: formState.lifecycleId || null,
        notes: formState.notes || undefined,

        sourceType: formState.sourceType
          ? (formState.sourceType as z.infer<typeof createLeadPayloadSchema>["sourceType"])
          : undefined,
        sourcePlatform: formState.sourcePlatform
          ? (formState.sourcePlatform as z.infer<typeof createLeadPayloadSchema>["sourcePlatform"])
          : undefined,
        utmSource: formState.utmSource || undefined,
        utmMedium: formState.utmMedium || undefined,
        utmCampaign: formState.utmCampaign || undefined,
        gclid: formState.gclid || undefined,
        fbclid: formState.fbclid || undefined,
        consentMarketing: formState.consentMarketing || undefined,
        consentMarketingSource:
          formState.consentMarketingSource || undefined,
      };
      let generalError: string | undefined;
      if (mode === "create") {
        const result = await createLeadAction(payload);

        if (result.success && result.leadId) {
          window.location.href = `/crm/leads/${result.leadId}`;
          return;
        }

        const newErrors: LeadFormErrors = {};

        if (result.fieldErrors?.name) {
          newErrors.name = result.fieldErrors.name;
        }
        if (result.fieldErrors?.email) {
          newErrors.email = result.fieldErrors.email;
        }
        if (result.fieldErrors?.phone) {
          newErrors.phone = result.fieldErrors.phone;
        }
        if (result.message) {
          generalError = result.message;
        }

        setErrors(newErrors);
      } else if (mode === "edit" && leadId) {
        const result = await updateLeadDetailsAction(leadId, payload);

        if (result.success) {
          window.location.href = `/crm/leads/${leadId}`;
          return;
        }

        const newErrors: LeadFormErrors = {};

        if (result.fieldErrors?.name) {
          newErrors.name = result.fieldErrors.name;
        }
        if (result.fieldErrors?.email) {
          newErrors.email = result.fieldErrors.email;
        }
        if (result.fieldErrors?.phone) {
          newErrors.phone = result.fieldErrors.phone;
        }
        if (result.message) {
          generalError = result.message;
        }

        setErrors(newErrors);
      }

      if (generalError) {
        setErrors((previous) => ({
          ...previous,
          general: generalError,
        }));
      }
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Lead kaydedilirken beklenmeyen bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Yeni aday oluştur" : "Adayı düzenle"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <p className="text-sm text-destructive">{errors.general}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={handleChange("name")}
                placeholder="Ad Soyad"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={handleChange("email")}
                placeholder="ornek@firma.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formState.phone}
                onChange={handleChange("phone")}
                placeholder="+90 ..."
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Kaynak</Label>
              <Select
                value={formState.sourceId || undefined}
                onValueChange={(value) =>
                  setFormState((previous) => ({
                    ...previous,
                    sourceId: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kaynak seçin" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={formState.status}
                onValueChange={(value) =>
                  setFormState((previous) => ({
                    ...previous,
                    status: value as Lead["status"],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Yeni</SelectItem>
                  <SelectItem value="contacted">İletişime geçildi</SelectItem>
                  <SelectItem value="qualified">Nitelikli</SelectItem>
                  <SelectItem value="lost">Kaybedildi</SelectItem>
                  <SelectItem value="converted">Dönüştürüldü</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Yaşam döngüsü</Label>
              <Select
                value={formState.lifecycleId || undefined}
                onValueChange={(value) =>
                  setFormState((previous) => ({
                    ...previous,
                    lifecycleId: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Yaşam döngüsü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {lifecycles.map((lifecycle) => (
                    <SelectItem key={lifecycle.id} value={lifecycle.id}>
                      {lifecycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formState.notes}
              onChange={handleChange("notes")}
              placeholder="Not ekleyin"
              rows={4}
            />
          </div>

          <Collapsible
            open={campaignSectionOpen}
            onOpenChange={setCampaignSectionOpen}
          >
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                Kampanya detayları
                {campaignSectionOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4 rounded-md border p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Kaynak türü</Label>
                    <Select
                      value={formState.sourceType || undefined}
                      onValueChange={(value) => setCampaignField("sourceType", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_SOURCE_TYPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kaynak platformu</Label>
                    <Select
                      value={formState.sourcePlatform || undefined}
                      onValueChange={(value) => setCampaignField("sourcePlatform", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_SOURCE_PLATFORMS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="utmSource">UTM Kaynak</Label>
                    <Input
                      id="utmSource"
                      value={formState.utmSource}
                      onChange={handleChange("utmSource")}
                      placeholder="utm_source"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utmMedium">UTM Ortam</Label>
                    <Input
                      id="utmMedium"
                      value={formState.utmMedium}
                      onChange={handleChange("utmMedium")}
                      placeholder="utm_medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utmCampaign">UTM Kampanya</Label>
                    <Input
                      id="utmCampaign"
                      value={formState.utmCampaign}
                      onChange={handleChange("utmCampaign")}
                      placeholder="utm_campaign"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gclid">Google Click ID (gclid)</Label>
                    <Input
                      id="gclid"
                      value={formState.gclid}
                      onChange={handleChange("gclid")}
                      placeholder="gclid"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fbclid">Meta Click ID (fbclid)</Label>
                    <Input
                      id="fbclid"
                      value={formState.fbclid}
                      onChange={handleChange("fbclid")}
                      placeholder="fbclid"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentMarketing"
                      checked={formState.consentMarketing}
                      onCheckedChange={(checked) =>
                        setCampaignField("consentMarketing", checked === true)
                      }
                    />
                    <Label htmlFor="consentMarketing" className="font-normal">
                      Pazarlama izni
                    </Label>
                  </div>
                  <div className="flex-1 space-y-2 min-w-[200px]">
                    <Label htmlFor="consentMarketingSource">İzin kaynağı</Label>
                    <Input
                      id="consentMarketingSource"
                      value={formState.consentMarketingSource}
                      onChange={handleChange("consentMarketingSource")}
                      placeholder="Örn. Google lead formu"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Kaydediliyor…"
                : mode === "create"
                  ? "Adayı kaydet"
                  : "Değişiklikleri kaydet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.back()}
            >
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function LeadCreateForm({
  lifecycles,
  leadSources,
}: Omit<LeadFormProps, "mode" | "initialLead" | "leadId">) {
  return (
    <LeadForm
      mode="create"
      lifecycles={lifecycles}
      leadSources={leadSources}
    />
  );
}

export { LeadForm };

