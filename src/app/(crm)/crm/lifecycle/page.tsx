import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { LifecycleTable } from "@/modules/crm/components/lifecycle-table";
import { getLifecycles } from "@/modules/crm/services";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function LifecyclePage() {
  const lifecycles = await getLifecycles();

  return (
    <CRMPageLayout>
      <LifecycleTable
        lifecycles={lifecycles}
        toolbar={
          <Button asChild>
            <Link href="/crm/lifecycle/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Yaşam döngüsü ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}
