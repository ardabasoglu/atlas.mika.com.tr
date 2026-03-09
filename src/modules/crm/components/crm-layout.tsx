"use client";

import React from "react";
import { SidebarPageLayout } from "@/components/sidebar-page-layout";

interface CRMLayoutProps {
  children: React.ReactNode;
}

export function CRMLayout({ children }: CRMLayoutProps) {
  return <SidebarPageLayout>{children}</SidebarPageLayout>;
}
