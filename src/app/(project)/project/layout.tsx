import { ProjectLayout } from "@/modules/project/components/project-layout";

export default function ProjectLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayout>{children}</ProjectLayout>;
}
