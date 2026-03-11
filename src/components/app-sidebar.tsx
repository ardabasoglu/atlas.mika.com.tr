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
  IconLink,
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
      iconClassName: "text-slate-500",
      featureKey: "crm",
    },
    {
      title: "Adaylar",
      url: "/crm/leads",
      icon: IconUserSearch,
      iconClassName: "text-blue-500",
      featureKey: "leads",
    },
    {
      title: "Kişiler",
      url: "/crm/persons",
      icon: IconUserCircle,
      iconClassName: "text-cyan-500",
      featureKey: "persons",
    },
    {
      title: "Fırsatlar",
      url: "/crm/deals",
      icon: IconBriefcase,
      iconClassName: "text-emerald-500",
      featureKey: "deals",
    },
    {
      title: "Aktiviteler",
      url: "/crm/activities",
      icon: IconActivity,
      iconClassName: "text-amber-500",
      featureKey: "activities",
    },
    {
      title: "Yaşam Döngüsü",
      url: "/crm/lifecycle",
      icon: IconRefresh,
      iconClassName: "text-violet-500",
      featureKey: "lifecycle",
    },
    {
      title: "Aday Kaynakları",
      url: "/crm/lead-sources",
      icon: IconLink,
      iconClassName: "text-orange-500",
      featureKey: "leadSources",
    },
    {
      title: "Takım",
      url: "/crm/team",
      icon: IconUsersGroup,
      iconClassName: "text-rose-500",
      featureKey: "team",
    },
  ],
  navProject: [
    {
      title: "Genel Bakış",
      url: "/project",
      icon: IconLayoutDashboard,
      iconClassName: "text-slate-500",
      featureKey: "project",
    },
    {
      title: "Projeler",
      url: "/project/projects",
      icon: IconFolder,
      iconClassName: "text-emerald-500",
      featureKey: "projects",
    },
    {
      title: "Üniteler",
      url: "/project/units",
      icon: IconLayoutGrid,
      iconClassName: "text-teal-500",
      featureKey: "units",
    },
  ],
  navMainOther: [
    {
      title: "Analitik",
      url: "#",
      icon: IconChartBar,
      iconClassName: "text-indigo-500",
      featureKey: "analytics",
    },
  ],
  navSecondary: [
    {
      title: "Ayarlar",
      url: "#",
      icon: IconSettings,
      iconClassName: "text-zinc-500",
    },
    {
      title: "Yardım Al",
      url: "#",
      icon: IconHelp,
      iconClassName: "text-sky-500",
    },
    {
      title: "Ara",
      url: "#",
      icon: IconSearch,
      iconClassName: "text-gray-500",
    },
  ],
  documents: [
    {
      name: "Veri Kütüphanesi",
      url: "#",
      icon: IconDatabase,
      iconClassName: "text-blue-500",
    },
    {
      name: "Raporlar",
      url: "#",
      icon: IconReport,
      iconClassName: "text-amber-500",
    },
    {
      name: "Word Asistanı",
      url: "#",
      icon: IconFileWord,
      iconClassName: "text-blue-600",
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
