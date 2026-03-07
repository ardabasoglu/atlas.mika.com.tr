import { ProjectPageLayout } from "@/modules/project/components/project-page-layout";
import { UnitCard } from "@/modules/project/components/unit-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { projectServices } from "@/modules/project/services";
import { crmServices } from "@/modules/crm/services";
import { formatMoney } from "@/lib/currency";

interface UnitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id: unitId } = await params;
  const unit = await projectServices.getUnitById(unitId);

  if (!unit) {
    notFound();
  }

  const [project, deal, person] = await Promise.all([
    projectServices.getProjectById(unit.projectId),
    unit.dealId
      ? crmServices.getDealById(unit.dealId)
      : Promise.resolve(undefined),
    unit.personId
      ? crmServices.getPersonById(unit.personId)
      : Promise.resolve(undefined),
  ]);

  return (
    <ProjectPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UnitCard
            unit={unit}
            projectName={project?.name}
            dealTitle={deal?.title}
            personName={person?.name}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detay</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Kod</dt>
                  <dd>{unit.code}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Tip</dt>
                  <dd>
                    {unit.type === "apartment"
                      ? "Daire"
                      : unit.type === "commercial"
                        ? "Ticari"
                        : unit.type === "parking"
                          ? "Otopark"
                          : "Diğer"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">m²</dt>
                  <dd>{unit.sizeSqm}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Durum</dt>
                  <dd>
                    {unit.status === "available"
                      ? "Müsait"
                      : unit.status === "reserved"
                        ? "Rezerve"
                        : "Satıldı"}
                  </dd>
                </div>
                {unit.floor != null && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Kat</dt>
                    <dd>{unit.floor}</dd>
                  </div>
                )}
                {unit.price != null && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Fiyat</dt>
                    <dd>{formatMoney(unit.price, unit.currency)}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Oluşturulma
                  </dt>
                  <dd>
                    {new Date(unit.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
