"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatMoney } from "@/lib/currency";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { DealEditForm } from "@/modules/crm/components/deal-edit-form";
import { DealPaymentPlanCard } from "@/modules/crm/components/deal-payment-plan-card";
import { QueryBoundary } from "@/lib/query/query-boundary";
import {
  useDeal,
  useDealWithPaymentPlan,
  useDealWithUnit,
  usePerson,
  useLifecycles,
} from "@/modules/crm/hooks";

interface DealDetailClientProps {
  dealId: string;
}

export function DealDetailClient({ dealId }: DealDetailClientProps) {
  const router = useRouter();
  const dealWithPlanQuery = useDealWithPaymentPlan(dealId);
  const dealWithUnitQuery = useDealWithUnit(dealId);
  const dealQuery = useDeal(dealId);

  const deal =
    dealWithPlanQuery.data ??
    dealWithUnitQuery.data?.deal ??
    dealQuery.data;

  const personQuery = usePerson(deal?.personId ?? "");
  const lifecyclesQuery = useLifecycles();

  const lifecycle = deal?.lifecycleId
    ? lifecyclesQuery.data?.find((lifecycleItem) => lifecycleItem.id === deal.lifecycleId)
    : undefined;

  const hasDeal = !!deal;
  const isLoadingDeal =
    dealWithPlanQuery.isLoading ||
    dealWithUnitQuery.isLoading ||
    (!hasDeal && dealQuery.isLoading);
  const isLoadingPersonOrLifecycles =
    hasDeal && (personQuery.isLoading || lifecyclesQuery.isLoading);
  const isLoading = isLoadingDeal || isLoadingPersonOrLifecycles;
  const isError =
    dealWithPlanQuery.isError ||
    dealWithUnitQuery.isError ||
    (hasDeal && (personQuery.isError || lifecyclesQuery.isError));
  const error =
    dealWithPlanQuery.error ??
    dealWithUnitQuery.error ??
    (hasDeal ? personQuery.error ?? lifecyclesQuery.error : null);

  const notFoundYet =
    !dealWithPlanQuery.isLoading &&
    !dealWithUnitQuery.isLoading &&
    !dealQuery.isLoading &&
    !deal;

  useEffect(() => {
    if (notFoundYet) {
      router.replace("/crm/deals");
    }
  }, [notFoundYet, router]);

  if (notFoundYet) {
    return null;
  }

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error instanceof Error ? error : undefined}
    >
      {deal && (
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
                            ? {
                                borderColor: lifecycle.color,
                                color: lifecycle.color,
                              }
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
                      <dt className="font-medium text-muted-foreground">
                        Değer
                      </dt>
                      <dd>{formatMoney(deal.value, deal.currency)}</dd>
                    </div>
                    {deal.expectedCloseDate && (
                      <div>
                        <dt className="font-medium text-muted-foreground">
                          Tahmini Kapanış
                        </dt>
                        <dd>
                          {new Date(
                            deal.expectedCloseDate
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Kişi
                      </dt>
                      <dd>
                        <Link
                          href={`/crm/persons/${deal.personId}`}
                          className="text-primary hover:underline"
                        >
                          {personQuery.data?.name ?? deal.personId}
                        </Link>
                      </dd>
                    </div>
                    {dealWithUnitQuery.data && (
                      <>
                        <div>
                          <dt className="font-medium text-muted-foreground">
                            Proje
                          </dt>
                          <dd>
                            <Link
                              href={`/project/projects/${dealWithUnitQuery.data.unit.projectId}`}
                              className="text-primary hover:underline"
                            >
                              {dealWithUnitQuery.data.project.name}
                            </Link>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-muted-foreground">
                            Birim
                          </dt>
                          <dd>
                            <Link
                              href={`/project/units/${dealWithUnitQuery.data.unit.id}`}
                              className="text-primary hover:underline"
                            >
                              {dealWithUnitQuery.data.unit.code}
                            </Link>
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </CardContent>
              </Card>

              <DealPaymentPlanCard deal={deal} />
            </div>

            <div className="lg:col-span-2">
              <DealEditForm
                deal={deal}
                initialProjectId={dealWithUnitQuery.data?.unit.projectId}
              />
            </div>
          </div>
        </CRMPageLayout>
      )}
    </QueryBoundary>
  );
}
