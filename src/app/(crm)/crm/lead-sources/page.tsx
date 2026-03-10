import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadSourceTable } from "@/modules/crm/components/lead-source-table";
import { getLeadSources } from "@/modules/crm/services";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function LeadSourcesPage() {
  const leadSources = await getLeadSources();

  return (
    <CRMPageLayout>
      <LeadSourceTable
        leadSources={leadSources}
        toolbar={
          <Button asChild>
            <Link href="/crm/lead-sources/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Aday kaynağı ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}
