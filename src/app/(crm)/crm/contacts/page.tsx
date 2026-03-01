import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ContactTable } from "@/modules/crm/components/contact-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function ContactsPage() {
  const contacts = await crmServices.getContacts();

  return (
    <CRMPageLayout>
      <ContactTable
        contacts={contacts}
        toolbar={
          <Button asChild>
            <Link href="/crm/contacts/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Kişi Ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}

