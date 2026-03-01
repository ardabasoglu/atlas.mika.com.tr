import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { CustomerTable } from "@/modules/crm/components/customer-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function CustomersPage() {
  const customers = await crmServices.getCustomers();

  return (
    <CRMPageLayout>
      <CustomerTable
        customers={customers}
        toolbar={
          <Button asChild>
            <Link href="/crm/customers/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Müşteri Ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}

