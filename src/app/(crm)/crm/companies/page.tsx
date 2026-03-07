import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";

export default function CompaniesPage() {
  return (
    <CRMPageLayout>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">Şirketler</h2>
        <p className="mt-1 text-muted-foreground">
          Şirket listesi yakında eklenecek.
        </p>
      </div>
    </CRMPageLayout>
  );
}
