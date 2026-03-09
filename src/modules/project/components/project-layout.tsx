"use client";

import React from "react";
import { SidebarPageLayout } from "@/components/sidebar-page-layout";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export function ProjectLayout({ children }: ProjectLayoutProps) {
  return <SidebarPageLayout>{children}</SidebarPageLayout>;
}
