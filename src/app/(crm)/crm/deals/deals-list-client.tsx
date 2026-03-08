"use client";

import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { DealTable } from "@/modules/crm/components/deal-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { QueryBoundary } from "@/lib/query/query-boundary";
import { useDeals, useLifecycles } from "@/modules/crm/hooks";

export function DealsListClient() {
  const dealsQuery = useDeals();
  const lifecyclesQuery = useLifecycles();

  const isLoading = dealsQuery.isLoading || lifecyclesQuery.isLoading;
  const isError = dealsQuery.isError || lifecyclesQuery.isError;
  const error = dealsQuery.error ?? lifecyclesQuery.error;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error instanceof Error ? error : undefined}
    >
      <CRMPageLayout>
        <DealTable
          deals={dealsQuery.data ?? []}
          lifecycles={lifecyclesQuery.data ?? []}
          toolbar={
            <Button asChild>
              <Link href="/crm/deals/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Fırsat Ekle
              </Link>
            </Button>
          }
        />
      </CRMPageLayout>
    </QueryBoundary>
  );
}
