import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { TeamTable } from "@/modules/crm/components/team-table";
import { crmServices } from "@/modules/crm/services";

export default async function TeamPage() {
  const teams = await crmServices.getTeams();

  return (
    <CRMPageLayout>
      <TeamTable teams={teams} />
    </CRMPageLayout>
  );
}
