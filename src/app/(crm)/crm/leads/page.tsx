import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadTable } from "@/modules/crm/components/lead-table";
import { getLeads, getLifecycles } from "@/modules/crm/services";

export default async function LeadsPage() {
  const [leads, lifecycles] = await Promise.all([
    getLeads(),
    getLifecycles(),
  ]);

  return (
    <CRMPageLayout>
      <LeadTable leads={leads} lifecycles={lifecycles} />
    </CRMPageLayout>
  );
}
