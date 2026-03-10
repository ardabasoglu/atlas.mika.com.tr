import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LeadForm } from "@/modules/crm/components/lead-create-form";
import {
  getLeadById,
  getLifecycles,
  getLeadSources,
} from "@/modules/crm/services";
import { notFound } from "next/navigation";

interface LeadEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadEditPage({ params }: LeadEditPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const [lifecycles, leadSources] = await Promise.all([
    getLifecycles(),
    getLeadSources(),
  ]);

  return (
    <CRMPageLayout>
      <LeadForm
        mode="edit"
        leadId={id}
        initialLead={lead}
        lifecycles={lifecycles}
        leadSources={leadSources}
      />
    </CRMPageLayout>
  );
}

