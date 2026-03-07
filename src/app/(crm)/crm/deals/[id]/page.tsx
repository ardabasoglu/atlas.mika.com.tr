import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { crmServices } from "@/modules/crm/services";
import { formatMoney } from "@/lib/currency";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { DealEditForm } from "@/modules/crm/components/deal-edit-form";

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id: dealId } = await params;
  const dealWithUnit = await crmServices.getDealWithUnit(dealId);
  const deal = dealWithUnit?.deal ?? (await crmServices.getDealById(dealId));

  if (!deal) {
    notFound();
  }

  const [person, lifecycle] = await Promise.all([
    crmServices.getPersonById(deal.personId),
    deal.lifecycleId
      ? crmServices.getLifecycleById(deal.lifecycleId)
      : Promise.resolve(undefined),
  ]);

  return (
    <CRMPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{deal.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={deal.stage} type="deal" />
                {lifecycle && (
                  <span
                    className="text-xs rounded-md px-2 py-0.5 border"
                    style={
                      lifecycle.color
                        ? { borderColor: lifecycle.color, color: lifecycle.color }
                        : undefined
                    }
                  >
                    {lifecycle.name}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Değer</dt>
                  <dd>{formatMoney(deal.value, deal.currency)}</dd>
                </div>
                {deal.expectedCloseDate && (
                  <div>
                    <dt className="font-medium text-muted-foreground">
                      Tahmini Kapanış
                    </dt>
                    <dd>
                      {new Date(
                        deal.expectedCloseDate,
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-muted-foreground">Kişi</dt>
                  <dd>
                    <Link
                      href={`/crm/persons/${deal.personId}`}
                      className="text-primary hover:underline"
                    >
                      {person?.name ?? deal.personId}
                    </Link>
                  </dd>
                </div>
                {dealWithUnit && (
                  <>
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Proje
                      </dt>
                      <dd>
                        <Link
                          href={`/project/projects/${dealWithUnit.unit.projectId}`}
                          className="text-primary hover:underline"
                        >
                          {dealWithUnit.project.name}
                        </Link>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Birim
                      </dt>
                      <dd>
                        <Link
                          href={`/project/units/${dealWithUnit.unit.id}`}
                          className="text-primary hover:underline"
                        >
                          {dealWithUnit.unit.code}
                        </Link>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <DealEditForm
            deal={deal}
            initialProjectId={dealWithUnit?.unit.projectId}
          />
        </div>
      </div>
    </CRMPageLayout>
  );
}
