"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
            label = "Pano";
            break;
          case "customers":
            label = "Müşteriler";
            break;
          case "companies":
            label = "Firmalar";
            break;
          case "contacts":
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
            label = "Yaşam Döngüsü";
            break;
          case "team":
            label = "Takım";
            break;
          default:
            label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
            break;
        }
      } else if (
        pathSegmentIndex === 2 &&
        (pathSegments[1] === "customers" ||
          pathSegments[1] === "leads" ||
          pathSegments[1] === "lifecycle" ||
          pathSegments[1] === "team")
      ) {
        label = "Detaylar";
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

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="py-1" suppressHydrationWarning>
      <BreadcrumbList className="text-base font-medium text-foreground/90 sm:gap-3 [&>li[data-slot=breadcrumb-separator]>svg]:size-4">
        {breadcrumbItems.map((breadcrumbItem, index) => {
          const isLastItem = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={`${breadcrumbItem.href}-${index}`}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {breadcrumbItem.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-foreground/70 hover:text-foreground">
                    <Link href={breadcrumbItem.href} suppressHydrationWarning>
                      {breadcrumbItem.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { buildCrmBreadcrumbItems };
