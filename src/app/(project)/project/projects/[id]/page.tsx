import { ProjectPageLayout } from "@/modules/project/components/project-page-layout";
import { ProjectCard } from "@/modules/project/components/project-card";
import { UnitTable } from "@/modules/project/components/unit-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { projectServices } from "@/modules/project/services";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id: projectId } = await params;
  const project = await projectServices.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const units = await projectServices.getUnitsByProjectId(projectId);

  return (
    <ProjectPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProjectCard project={project} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Üniteler</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bu projeye ait {units.length} ünite
              </p>
            </CardHeader>
            <CardContent>
              <UnitTable units={units} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
