import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LifecycleTable } from "@/modules/crm/components/lifecycle-table";
import { crmServices } from "@/modules/crm/services";

export default async function LifecyclePage() {
  const lifecycles = await crmServices.getLifecycles();

  return (
    <CRMPageLayout>
      <LifecycleTable lifecycles={lifecycles} />
    </CRMPageLayout>
  );
}
