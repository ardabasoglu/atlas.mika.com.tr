import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { crmServices } from "@/modules/crm/services";

interface LifecycleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LifecycleDetailPage({
  params,
}: LifecycleDetailPageProps) {
  const { id } = await params;
  const lifecycle = await crmServices.getLifecycleById(id);

  if (!lifecycle) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ad</h4>
              <p>{lifecycle.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Sıra
              </h4>
              <p>{lifecycle.order}</p>
            </div>
            {lifecycle.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </h4>
                <p>{lifecycle.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Görünüm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lifecycle.color && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Renk
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-8 rounded-md border"
                    style={{ backgroundColor: lifecycle.color }}
                    aria-hidden
                  />
                  <span className="text-sm font-mono">{lifecycle.color}</span>
                </div>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Güncellenme
              </h4>
              <p>
                {new Date(lifecycle.updatedAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMPageLayout>
  );
}
