import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { PersonForm } from "@/modules/crm/components/person-create-form";
import { getPersonById } from "@/modules/crm/services";
import { notFound } from "next/navigation";

interface PersonEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonEditPage({ params }: PersonEditPageProps) {
  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <PersonForm mode="edit" personId={id} initialPerson={person} />
    </CRMPageLayout>
  );
}
