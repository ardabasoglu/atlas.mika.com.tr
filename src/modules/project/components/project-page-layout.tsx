"use client";

import React from "react";

interface ProjectPageLayoutProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ProjectPageLayout({
  actions,
  children,
}: ProjectPageLayoutProps) {
  return (
    <>
      {actions && (
        <div className="mb-2 flex justify-end gap-4 py-1">
          <div className="shrink-0">{actions}</div>
        </div>
      )}

      {children}
    </>
  );
}
