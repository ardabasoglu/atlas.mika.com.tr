import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ConvertLeadButton } from "@/modules/crm/components/convert-lead-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { notFound } from "next/navigation";
import { crmServices } from "@/modules/crm/services";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await crmServices.getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <CRMPageLayout actions={<ConvertLeadButton lead={lead} />}
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
              <p>
                {lead.firstName} {lead.lastName}
              </p>
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
            {lead.position && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Pozisyon
                </h4>
                <p>{lead.position}</p>
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
            {lead.source && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Kaynak
                </h4>
                <p>{lead.source}</p>
              </div>
            )}
            {lead.propertyInterest && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  İlgi alanı (gayrimenkul)
                </h4>
                <p>{lead.propertyInterest}</p>
              </div>
            )}
            {lead.convertedAt && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Dönüştürülme tarihi
                </h4>
                <p>
                  {new Date(lead.convertedAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {lead.companyName && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Firma bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Firma adı
                </h4>
                <p>{lead.companyName}</p>
              </div>
              {lead.website && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Web sitesi
                  </h4>
                  <a
                    href={
                      lead.website.startsWith("http")
                        ? lead.website
                        : `https://${lead.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              )}
              {lead.industry && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Sektör
                  </h4>
                  <p>{lead.industry}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </CRMPageLayout>
  );
}
