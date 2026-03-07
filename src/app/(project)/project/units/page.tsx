import { ProjectPageLayout } from "@/modules/project/components/project-page-layout";
import { UnitTable } from "@/modules/project/components/unit-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { projectServices } from "@/modules/project/services";

export default async function UnitsListPage() {
  const units = await projectServices.getUnits();

  return (
    <ProjectPageLayout>
      <UnitTable
        units={units}
        toolbar={
          <Button asChild>
            <Link href="/project/units/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Ünite Ekle
            </Link>
          </Button>
        }
      />
    </ProjectPageLayout>
  );
}
