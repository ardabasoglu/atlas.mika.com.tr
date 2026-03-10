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
} from "@/modules/crm/services";
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

  const [lifecycle, leadSource] = await Promise.all([
    lead.lifecycleId ? getLifecycleById(lead.lifecycleId) : undefined,
    lead.sourceId ? getLeadSourceById(lead.sourceId) : undefined,
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
            status={lead.status}
            archivedAt={lead.archivedAt}
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kişi bilgileri</CardTitle>
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
            <CardTitle>Durum ve kaynak</CardTitle>
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
      </div>
    </CRMPageLayout>
  );
}
