import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LifecycleForm } from "@/modules/crm/components/lifecycle-form";

export default function NewLifecyclePage() {
  return (
    <CRMPageLayout>
      <LifecycleForm mode="create" />
    </CRMPageLayout>
  );
}
