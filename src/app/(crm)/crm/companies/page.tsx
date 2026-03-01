import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { CompanyTable } from "@/modules/crm/components/company-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function CompaniesPage() {
  const companies = await crmServices.getCompanies();

  return (
    <CRMPageLayout>
      <CompanyTable
        companies={companies}
        toolbar={
          <Button asChild>
            <Link href="/crm/companies/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Firma Ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}

