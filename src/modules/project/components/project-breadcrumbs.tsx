"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

interface ProjectBreadcrumbItem {
  href: string;
  label: string;
}

function buildProjectBreadcrumbItems(
  pathname: string
): ProjectBreadcrumbItem[] {
  const trimmedPathname = pathname.split("?")[0].split("#")[0];
  const pathSegments = trimmedPathname.split("/").filter(Boolean);

  if (pathSegments.length === 0 || pathSegments[0] !== "project") {
    return [];
  }

  const breadcrumbItems: ProjectBreadcrumbItem[] = [];

  pathSegments.forEach((pathSegment, pathSegmentIndex) => {
    const href = `/${pathSegments.slice(0, pathSegmentIndex + 1).join("/")}`;

    let label: string;

    if (pathSegmentIndex === 0) {
      label = "Proje";
    } else if (pathSegmentIndex === 1) {
      switch (pathSegment) {
        case "projects":
          label = "Projeler";
          break;
        case "units":
          label = "Üniteler";
          break;
        default:
          label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
          break;
      }
    } else if (
      pathSegmentIndex === 2 &&
      (pathSegments[1] === "projects" || pathSegments[1] === "units")
    ) {
      label = "Detay";
    } else {
      label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
    }

    breadcrumbItems.push({
      href,
      label,
    });
  });

  if (pathSegments.length === 1 && pathSegments[0] === "project") {
    breadcrumbItems.push({
      href: "/project",
      label: "Genel Bakış",
    });
  }

  return breadcrumbItems;
}

export function ProjectBreadcrumbs() {
  const currentPathname = usePathname();
  const breadcrumbItems = buildProjectBreadcrumbItems(currentPathname);
  return <BreadcrumbNav items={breadcrumbItems} />;
}

export { buildProjectBreadcrumbItems };
