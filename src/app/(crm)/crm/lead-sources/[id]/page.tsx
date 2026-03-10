import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getLeadSourceById } from "@/modules/crm/services";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadSourceDetailActions } from "./lead-source-detail-actions";

interface LeadSourceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadSourceDetailPage({
  params,
}: LeadSourceDetailPageProps) {
  const { id } = await params;
  const leadSource = await getLeadSourceById(id);

  if (!leadSource) {
    notFound();
  }

  return (
    <CRMPageLayout
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href={`/crm/lead-sources/${id}/edit`}>Düzenle</Link>
          </Button>
          <LeadSourceDetailActions leadSourceId={id} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ad</h4>
              <p>{leadSource.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Sıra
              </h4>
              <p>{leadSource.order}</p>
            </div>
            {leadSource.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </h4>
                <p>{leadSource.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Görünüm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadSource.color && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Renk
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-8 rounded-md border"
                    style={{ backgroundColor: leadSource.color }}
                    aria-hidden
                  />
                  <span className="text-sm font-mono">{leadSource.color}</span>
                </div>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Güncellenme
              </h4>
              <p>
                {new Date(leadSource.updatedAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMPageLayout>
  );
}
