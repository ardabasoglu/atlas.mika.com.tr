"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconActivity,
  IconBriefcase,
  IconChartBar,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconLayoutDashboard,
  IconLayoutGrid,
  IconRefresh,
  IconReport,
  IconSearch,
  IconSettings,
  IconUserCircle,
  IconUserSearch,
  IconUsersGroup,
} from "@tabler/icons-react";

import { isSidebarFeatureEnabled } from "@/lib/feature-flags";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/placeholder-avatar.png",
  },
  navCrm: [
    {
      title: "Genel Bakış",
      url: "/crm",
      icon: IconLayoutDashboard,
      featureKey: "crm",
    },
    {
      title: "Adaylar",
      url: "/crm/leads",
      icon: IconUserSearch,
      featureKey: "leads",
    },
    {
      title: "Kişiler",
      url: "/crm/persons",
      icon: IconUserCircle,
      featureKey: "persons",
    },
    {
      title: "Fırsatlar",
      url: "/crm/deals",
      icon: IconBriefcase,
      featureKey: "deals",
    },
    {
      title: "Aktiviteler",
      url: "/crm/activities",
      icon: IconActivity,
      featureKey: "activities",
    },
    {
      title: "Yaşam Döngüsü",
      url: "/crm/lifecycle",
      icon: IconRefresh,
      featureKey: "lifecycle",
    },
    {
      title: "Takım",
      url: "/crm/team",
      icon: IconUsersGroup,
      featureKey: "team",
    },
  ],
  navProject: [
    {
      title: "Genel Bakış",
      url: "/project",
      icon: IconLayoutDashboard,
      featureKey: "project",
    },
    {
      title: "Projeler",
      url: "/project/projects",
      icon: IconFolder,
      featureKey: "projects",
    },
    {
      title: "Üniteler",
      url: "/project/units",
      icon: IconLayoutGrid,
      featureKey: "units",
    },
  ],
  navMainOther: [
    {
      title: "Analitik",
      url: "#",
      icon: IconChartBar,
      featureKey: "analytics",
    },
  ],
  navSecondary: [
    {
      title: "Ayarlar",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Yardım Al",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Ara",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Veri Kütüphanesi",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Raporlar",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Asistanı",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

const navCrmFiltered = data.navCrm.filter((item) =>
  isSidebarFeatureEnabled(item.featureKey),
);
const navProjectFiltered = data.navProject.filter((item) =>
  isSidebarFeatureEnabled(item.featureKey),
);
const navMainOtherFiltered = data.navMainOther.filter((item) =>
  isSidebarFeatureEnabled(item.featureKey),
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="text-base font-semibold">ATLAS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navCrmFiltered} groupLabel="CRM" />
        <NavMain items={navProjectFiltered} groupLabel="Proje" />
        <NavMain items={navMainOtherFiltered} />
        {isSidebarFeatureEnabled("documents") && (
          <NavDocuments items={data.documents} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
