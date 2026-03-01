"use client";

import { useEffect, useState } from "react";
import type { Icon } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const triggerClassName =
  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
const chevronClassName =
  "ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90";

function NavMenuItems({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <a href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function NavMain({
  items,
  groupLabel,
  defaultOpen = true,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  groupLabel?: string;
  defaultOpen?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <SidebarGroup>
      {groupLabel != null ? (
        mounted ? (
          <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel asChild>
                <button type="button" className={triggerClassName}>
                  <span>{groupLabel}</span>
                  <ChevronRight className={chevronClassName} />
                </button>
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="flex flex-col gap-2">
                <NavMenuItems items={items} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="group/collapsible" data-slot="collapsible">
            <SidebarGroupLabel asChild>
              <button type="button" className={triggerClassName} aria-expanded={defaultOpen}>
                <span>{groupLabel}</span>
                <ChevronRight className={chevronClassName} />
              </button>
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
              <NavMenuItems items={items} />
            </SidebarGroupContent>
          </div>
        )
      ) : (
        <SidebarGroupContent className="flex flex-col gap-2">
          <NavMenuItems items={items} />
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}
