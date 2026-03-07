import { ProjectPageLayout } from "@/modules/project/components/project-page-layout";
import { ProjectTable } from "@/modules/project/components/project-table";
import { UnitTable } from "@/modules/project/components/unit-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LayoutGrid, Hammer, CheckCircle } from "lucide-react";
import { projectServices } from "@/modules/project/services";

export default async function ProjectOverviewPage() {
  const projects = await projectServices.getProjects();
  const units = await projectServices.getUnits();

  const byStatus = {
    planning: projects.filter((project) => project.status === "planning")
      .length,
    construction: projects.filter((project) => project.status === "construction")
      .length,
    completed: projects.filter((project) => project.status === "completed")
      .length,
    on_hold: projects.filter((project) => project.status === "on_hold").length,
  };

  return (
    <ProjectPageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Proje
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Kayıtlı proje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Ünite
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units.length}</div>
            <p className="text-xs text-muted-foreground">Kayıtlı ünite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              İnşaat Aşamasında
            </CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{byStatus.construction}</div>
            <p className="text-xs text-muted-foreground">Aktif inşaat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tamamlanan
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{byStatus.completed}</div>
            <p className="text-xs text-muted-foreground">Proje</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Son Projeler</h2>
          <span className="text-sm text-muted-foreground">
            Son {Math.min(5, projects.length)}
          </span>
        </div>
        <ProjectTable projects={projects.slice(0, 5)} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Son Üniteler</h2>
          <span className="text-sm text-muted-foreground">
            Son {Math.min(5, units.length)}
          </span>
        </div>
        <UnitTable units={units.slice(0, 5)} />
      </div>
    </ProjectPageLayout>
  );
}
