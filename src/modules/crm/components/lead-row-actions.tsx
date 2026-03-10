"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead } from "../types";
import { EntityActionMenu, type ActionMenuItem } from "./common/entity-action-menu";
import { archiveLeadAction } from "../server-actions";

interface LeadRowActionsProps {
  lead: Lead;
}

export function LeadRowActions({ lead }: LeadRowActionsProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  const isConverted = lead.status === "converted";
  const isArchived = Boolean(lead.archivedAt);

  const canArchive = !isConverted && !isArchived;

  const handleArchive = async () => {
    if (!canArchive || isArchiving) return;

    const confirmed = window.confirm(
      "Bu adayı arşivlemek istediğinize emin misiniz? Arşivlenen aday listelerde gösterilmeyecektir.",
    );
    if (!confirmed) return;

    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(lead.id);
      if (result.success) {
        router.refresh();
      } else if (result.message) {
        window.alert(result.message);
      }
    } finally {
      setIsArchiving(false);
    }
  };

  const actions: ActionMenuItem[] = [
    {
      label: "Görüntüle",
      href: `/crm/leads/${lead.id}`,
    },
    {
      label: "Düzenle",
      href: `/crm/leads/${lead.id}/edit`,
    },
  ];

  if (canArchive || isArchived) {
    actions.push({
      label: isArchived ? "Arşivlendi" : "Arşivle",
      variant: isArchived ? "default" : "destructive",
      onClick: canArchive ? handleArchive : undefined,
      disabled: !canArchive || isArchiving,
    });
  }

  return (
    <EntityActionMenu
      entityId={lead.id}
      basePath="/crm/leads"
      actions={actions}
    />
  );
}

