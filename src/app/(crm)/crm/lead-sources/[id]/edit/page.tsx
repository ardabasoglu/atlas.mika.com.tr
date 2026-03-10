import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadSourceForm } from "@/modules/crm/components/lead-source-form";
import { getLeadSourceById } from "@/modules/crm/services";
import { notFound } from "next/navigation";

interface LeadSourceEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadSourceEditPage({
  params,
}: LeadSourceEditPageProps) {
  const { id } = await params;
  const leadSource = await getLeadSourceById(id);

  if (!leadSource) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <LeadSourceForm
        mode="edit"
        initialData={{
          id: leadSource.id,
          name: leadSource.name,
          description: leadSource.description ?? "",
          order: leadSource.order,
          color: leadSource.color ?? "",
        }}
      />
    </CRMPageLayout>
  );
}
