import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ConvertLeadButton } from "@/modules/crm/components/convert-lead-button";
import { LeadCampaignDetailsCard } from "@/modules/crm/components/lead-campaign-details-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { notFound } from "next/navigation";
import {
  getLeadById,
  getLifecycleById,
  getLeadSourceById,
  getDuplicatesOfLead,
} from "@/modules/crm/services";
import Link from "next/link";
import { LeadDetailActions } from "./lead-detail-actions";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const [lifecycle, leadSource, duplicates, canonicalLead] = await Promise.all([
    lead.lifecycleId ? getLifecycleById(lead.lifecycleId) : undefined,
    lead.sourceId ? getLeadSourceById(lead.sourceId) : undefined,
    getDuplicatesOfLead(lead.id),
    lead.duplicateOfLeadId ? getLeadById(lead.duplicateOfLeadId) : undefined,
  ]);

  const hasCampaignDetails =
    !!lead.sourceType ||
    !!lead.sourcePlatform ||
    !!lead.utmSource ||
    !!lead.utmMedium ||
    !!lead.utmCampaign ||
    !!lead.gclid ||
    !!lead.fbclid ||
    lead.consentMarketing !== undefined ||
    !!lead.consentMarketingSource;

  return (
    <CRMPageLayout
      actions={
        <div className="flex gap-2">
          <ConvertLeadButton lead={lead} />
          <LeadDetailActions
            leadId={lead.id}
            isConvertedToPerson={lead.status === "converted" && Boolean(lead.personId)}
            archivedAt={lead.archivedAt}
          />
        </div>
      }
    >
      {canonicalLead && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-background/60 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-background/80 dark:text-amber-200">
          Bu aday yinelenen bir kayıttır. Asıl aday:{" "}
          <Link
            href={`/crm/leads/${canonicalLead.id}`}
            className="font-medium underline underline-offset-2 hover:no-underline"
          >
            {canonicalLead.name}
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kişi bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Ad Soyad
              </h4>
              <p className="font-semibold">{lead.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                E-posta
              </h4>
              <p className="font-semibold">{lead.email}</p>
            </div>
            {lead.phone && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Telefon
                </h4>
                <p className="font-semibold">{lead.phone}</p>
              </div>
            )}
            {lead.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Notlar
                </h4>
                <p className="font-semibold">{lead.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Durum ve kaynak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Durum
              </h4>
              <StatusBadge status={lead.status} type="lead" />
            </div>
            {lifecycle && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Yaşam döngüsü
                </h4>
                <p className="font-semibold">{lifecycle.name}</p>
              </div>
            )}
            {leadSource && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Kaynak
                </h4>
                <p className="font-semibold">{leadSource.name}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Oluşturulma
              </h4>
              <p className="font-semibold">
                {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </CardContent>
        </Card>

        {hasCampaignDetails && <LeadCampaignDetailsCard lead={lead} />}

        {duplicates.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>İlgili yinelenenler</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bu adayla eşleşen diğer kayıtlar.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {duplicates.map((duplicate) => (
                  <li key={duplicate.id}>
                    <Link
                      href={`/crm/leads/${duplicate.id}`}
                      className="text-primary font-medium underline underline-offset-2 hover:no-underline"
                    >
                      {duplicate.name} — {duplicate.email}
                    </Link>
                    <span className="ml-2 text-muted-foreground text-sm">
                      {new Date(duplicate.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </CRMPageLayout>
  );
}
