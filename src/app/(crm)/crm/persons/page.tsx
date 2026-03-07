import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { PersonTable } from "@/modules/crm/components/person-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function PersonsPage() {
  const persons = await crmServices.getPersons();

  return (
    <CRMPageLayout>
      <PersonTable
        persons={persons}
        toolbar={
          <Button asChild>
            <Link href="/crm/persons/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Kişi Ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}
