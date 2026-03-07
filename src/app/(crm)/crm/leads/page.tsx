import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadTable } from "@/modules/crm/components/lead-table";
import { crmServices } from "@/modules/crm/services";

export default async function LeadsPage() {
  const [leads, lifecycles] = await Promise.all([
    crmServices.getLeads(),
    crmServices.getLifecycles(),
  ]);

  return (
    <CRMPageLayout>
      <LeadTable leads={leads} lifecycles={lifecycles} />
    </CRMPageLayout>
  );
}
