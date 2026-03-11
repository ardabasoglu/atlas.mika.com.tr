import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import { Project } from "../types";

const projectStatusLabels: Record<Project["status"], string> = {
  planning: "Planlama",
  construction: "İnşaat",
  completed: "Tamamlandı",
  on_hold: "Beklemede",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>
          {projectStatusLabels[project.status] ?? project.status}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}

          {project.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="text-sm">{project.address}</span>
            </div>
          )}

          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString("tr-TR")
                  : "-"}{" "}
                –{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString("tr-TR")
                  : "-"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
