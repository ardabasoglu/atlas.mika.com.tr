"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

interface CrmBreadcrumbItem {
  href: string;
  label: string;
}

function buildCrmBreadcrumbItems(pathname: string): CrmBreadcrumbItem[] {
  const trimmedPathname = pathname.split("?")[0].split("#")[0];
  const pathSegments = trimmedPathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return [];
  }

  const breadcrumbItems: CrmBreadcrumbItem[] = [];

  pathSegments.forEach((pathSegment, pathSegmentIndex) => {
    const href = `/${pathSegments.slice(0, pathSegmentIndex + 1).join("/")}`;

    let label: string;

    if (pathSegments[0] === "crm") {
      if (pathSegmentIndex === 0) {
        label = "CRM";
      } else if (pathSegmentIndex === 1) {
        switch (pathSegment) {
          case "dashboard":
            label = "Örnek Pano";
            break;
          case "persons":
            label = "Kişiler";
            break;
          case "activities":
            label = "Aktiviteler";
            break;
          case "deals":
            label = "Fırsatlar";
            break;
          case "leads":
            label = "Adaylar";
            break;
          case "lifecycle":
            label = "Aşamalar";
            break;
          case "lead-sources":
            label = "Aday Kaynakları";
            break;
          case "team":
            label = "Takım";
            break;
          case "customers":
            label = "Kişiler";
            break;
          default:
            label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
            break;
        }
      } else if (
        pathSegmentIndex === 2 &&
        (pathSegments[1] === "persons" ||
          pathSegments[1] === "leads" ||
          pathSegments[1] === "lifecycle" ||
          pathSegments[1] === "lead-sources" ||
          pathSegments[1] === "team")
      ) {
        label =
          pathSegments[1] === "lead-sources" && pathSegment === "new"
            ? "Yeni kaynak"
            : "Detay";
      } else if (pathSegment === "edit") {
        label = "Düzenle";
      } else {
        label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
      }
    } else {
      if (pathSegment === "dashboard") {
        label = "Pano";
      } else {
        const humanReadableSegment = pathSegment.replace(/-/g, " ");
        label =
          humanReadableSegment.charAt(0).toUpperCase() +
          humanReadableSegment.slice(1);
      }
    }

    breadcrumbItems.push({
      href,
      label,
    });
  });

  // CRM root (/crm) should show: CRM -> Genel Bakış
  if (
    pathSegments.length === 1 &&
    pathSegments[0] === "crm"
  ) {
    breadcrumbItems.push({
      href: "/crm",
      label: "Genel Bakış",
    });
  }

  return breadcrumbItems;
}

export function CrmBreadcrumbs() {
  const currentPathname = usePathname();
  const breadcrumbItems = buildCrmBreadcrumbItems(currentPathname);
  return <BreadcrumbNav items={breadcrumbItems} />;
}

export { buildCrmBreadcrumbItems };
