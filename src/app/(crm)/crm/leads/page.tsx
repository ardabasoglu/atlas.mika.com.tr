import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadTable } from "@/modules/crm/components/lead-table";
import { getLeads, getLifecycles, getLeadSources } from "@/modules/crm/services";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function LeadsPage() {
  const [leads, lifecycles, leadSources] = await Promise.all([
    getLeads(),
    getLifecycles(),
    getLeadSources(),
  ]);
  return (
    <CRMPageLayout>
      <LeadTable
        leads={leads}
        lifecycles={lifecycles}
        leadSources={leadSources}
        toolbar={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/crm/leads/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Aday Ekle
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/crm/leads/archived">Arşivlenmiş adaylar</Link>
            </Button>
          </div>
        }
      />
    </CRMPageLayout>
  );
}
