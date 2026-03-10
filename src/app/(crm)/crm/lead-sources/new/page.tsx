import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadSourceForm } from "@/modules/crm/components/lead-source-form";

export default function NewLeadSourcePage() {
  return (
    <CRMPageLayout>
      <LeadSourceForm mode="create" />
    </CRMPageLayout>
  );
}
