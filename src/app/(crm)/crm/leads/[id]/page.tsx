import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ConvertLeadButton } from "@/modules/crm/components/convert-lead-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { notFound } from "next/navigation";
import { getLeadById, getLifecycleById } from "@/modules/crm/services";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const lifecycle = lead.lifecycleId
    ? await getLifecycleById(lead.lifecycleId)
    : undefined;

  return (
    <CRMPageLayout actions={<ConvertLeadButton lead={lead} />}>
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
              <p>{lead.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                E-posta
              </h4>
              <p>{lead.email}</p>
            </div>
            {lead.phone && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Telefon
                </h4>
                <p>{lead.phone}</p>
              </div>
            )}
            {lead.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Notlar
                </h4>
                <p>{lead.notes}</p>
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
                <p>{lifecycle.name}</p>
              </div>
            )}
            {lead.source && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Kaynak
                </h4>
                <p>{lead.source}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Oluşturulma
              </h4>
              <p>{new Date(lead.createdAt).toLocaleDateString("tr-TR")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMPageLayout>
  );
}
