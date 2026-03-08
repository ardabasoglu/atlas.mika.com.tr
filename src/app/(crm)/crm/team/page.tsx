import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { TeamTable } from "@/modules/crm/components/team-table";
import { getTeams } from "@/modules/crm/services";

export default async function TeamPage() {
  const teams = await getTeams();

  return (
    <CRMPageLayout>
      <TeamTable teams={teams} />
    </CRMPageLayout>
  );
}
