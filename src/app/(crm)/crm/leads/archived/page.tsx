import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadTable } from "@/modules/crm/components/lead-table";
import { getArchivedLeads, getLifecycles, getLeadSources } from "@/modules/crm/services";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ArchivedLeadsPage() {
  const [leads, lifecycles, leadSources] = await Promise.all([
    getArchivedLeads(),
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
          <Button variant="ghost" asChild>
            <Link href="/crm/leads">Aktif adaylar</Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}

