import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { DealTable } from "@/modules/crm/components/deal-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function DealsPage() {
  const deals = await crmServices.getDeals();

  return (
    <CRMPageLayout>
      <DealTable
        deals={deals}
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
  );
}

