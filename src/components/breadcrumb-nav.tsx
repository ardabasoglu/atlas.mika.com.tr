"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbNavItem {
  href: string;
  label: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="py-1" suppressHydrationWarning>
      <BreadcrumbList className="text-base font-medium text-foreground/90 sm:gap-3 [&>li[data-slot=breadcrumb-separator]>svg]:size-4">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <React.Fragment key={`${item.href}-${index}`}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="text-foreground/70 hover:text-foreground"
                  >
                    <Link href={item.href} suppressHydrationWarning>
                      {item.label}
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
