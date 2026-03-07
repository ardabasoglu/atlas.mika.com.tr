import { ProjectPageLayout } from "@/modules/project/components/project-page-layout";
import { ProjectTable } from "@/modules/project/components/project-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { projectServices } from "@/modules/project/services";

export default async function ProjectsListPage() {
  const projects = await projectServices.getProjects();

  return (
    <ProjectPageLayout>
      <ProjectTable
        projects={projects}
        toolbar={
          <Button asChild>
            <Link href="/project/projects/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Proje Ekle
            </Link>
          </Button>
        }
      />
    </ProjectPageLayout>
  );
}
