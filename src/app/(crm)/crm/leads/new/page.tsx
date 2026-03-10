import { CRMPageLayout, LeadCreateForm } from "@/modules/crm/components";
import { getLifecycles, getLeadSources } from "@/modules/crm/services";

export default async function LeadCreatePage() {
  const [lifecycles, leadSources] = await Promise.all([
    getLifecycles(),
    getLeadSources(),
  ]);

  return (
    <CRMPageLayout>
      <LeadCreateForm lifecycles={lifecycles} leadSources={leadSources} />
    </CRMPageLayout>
  );
}

