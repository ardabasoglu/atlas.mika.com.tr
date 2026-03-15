import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { PersonTable } from "@/modules/crm/components/person-table";
import { getArchivedPersons } from "@/modules/crm/services";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ArchivedPersonsPage() {
  const persons = await getArchivedPersons();

  return (
    <CRMPageLayout>
      <PersonTable
        persons={persons}
        toolbar={
          <Button variant="ghost" asChild>
            <Link href="/crm/persons">Aktif kişiler</Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}
