import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { ActivityTable } from "@/modules/crm/components/activity-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getTimelineEvents } from "@/modules/crm/services";

export default async function ActivitiesPage() {
  const timelineEvents = await getTimelineEvents();

  return (
    <CRMPageLayout>
      <ActivityTable
        timelineEvents={timelineEvents}
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

