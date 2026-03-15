import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LifecycleForm } from "@/modules/crm/components/lifecycle-form";
import { getLifecycleById } from "@/modules/crm/services";
import { notFound } from "next/navigation";

interface LifecycleEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function LifecycleEditPage({
  params,
}: LifecycleEditPageProps) {
  const { id } = await params;
  const lifecycle = await getLifecycleById(id);

  if (!lifecycle) {
    notFound();
  }

  return (
    <CRMPageLayout>
      <LifecycleForm
        mode="edit"
        initialData={{
          id: lifecycle.id,
          name: lifecycle.name,
          description: lifecycle.description ?? "",
          order: lifecycle.order,
          color: lifecycle.color ?? "",
        }}
      />
    </CRMPageLayout>
  );
}
