import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ActivityTable } from "@/modules/crm/components/activity-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { crmServices } from "@/modules/crm/services";

export default async function ActivitiesPage() {
  const activities = await crmServices.getActivities();

  return (
    <CRMPageLayout>
      <ActivityTable
        activities={activities}
        toolbar={
          <Button asChild>
            <Link href="/crm/activities/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Aktivite Ekle
            </Link>
          </Button>
        }
      />
    </CRMPageLayout>
  );
}

