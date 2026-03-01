"use client";

import React from "react";

interface CRMPageLayoutProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function CRMPageLayout({ actions, children }: CRMPageLayoutProps) {
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
