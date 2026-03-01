import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { crmServices } from "@/modules/crm/services";

interface TeamDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { id } = await params;
  const team = await crmServices.getTeamById(id);

  if (!team) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>İletişim bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Ad
              </h4>
              <p>{team.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                E-posta
              </h4>
              <p>{team.email}</p>
            </div>
            {team.phone && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Telefon
                </h4>
                <p>{team.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.role ? (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Pozisyon
                </h4>
                <p>{team.role}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Rol tanımlanmamış</p>
            )}
          </CardContent>
        </Card>
      </div>
    </CRMPageLayout>
  );
}
