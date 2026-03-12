"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Lead } from "../types";
import { EntityActionMenu, type ActionMenuItem } from "./common/entity-action-menu";
import { archiveLeadAction, unarchiveLeadAction } from "../server-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ARCHIVE_MESSAGE =
  "Bu adayı arşivlemek istediğinize emin misiniz? Arşivlenen aday listelerde gösterilmeyecektir.";

interface LeadRowActionsProps {
  lead: Lead;
}

export function LeadRowActions({ lead }: LeadRowActionsProps) {
  const router = useRouter();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const isConvertedToPerson = lead.status === "converted" && Boolean(lead.personId);
  const isArchived = Boolean(lead.archivedAt);

  const canArchive = !isConvertedToPerson && !isArchived;

  const handleArchiveConfirm = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(lead.id);
      if (result.success) {
        setArchiveDialogOpen(false);
        router.push("/crm/leads/archived");
        router.refresh();
      } else if (result.message) {
        toast.error(result.message);
      }
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchiveConfirm = async () => {
    setIsUnarchiving(true);
    try {
      const result = await unarchiveLeadAction(lead.id);
      if (result.success) {
        setUnarchiveDialogOpen(false);
        router.push("/crm/leads");
        router.refresh();
      } else if (result.message) {
        toast.error(result.message);
      }
    } finally {
      setIsUnarchiving(false);
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

  if (canArchive) {
    actions.push({ type: "separator" });
    actions.push({
      label: "Arşivle",
      variant: "destructive",
      onClick: () => setArchiveDialogOpen(true),
      disabled: isArchiving,
    });
  } else if (isArchived) {
    actions.push({ type: "separator" });
    actions.push({
      label: "Arşivden çıkar",
      variant: "default",
      onClick: () => setUnarchiveDialogOpen(true),
      disabled: isUnarchiving,
    });
  }

  return (
    <>
      <EntityActionMenu
        entityId={lead.id}
        basePath="/crm/leads"
        actions={actions}
      />
      <ConfirmDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Adayı arşivle"
        description={ARCHIVE_MESSAGE}
        confirmLabel="Arşivle"
        cancelLabel="İptal"
        confirmVariant="destructive"
        onConfirm={handleArchiveConfirm}
        isLoading={isArchiving}
      />
      <ConfirmDialog
        open={unarchiveDialogOpen}
        onOpenChange={setUnarchiveDialogOpen}
        title="Adayı arşivden çıkar"
        description="Bu adayı arşivden çıkarmak istediğinize emin misiniz? Aday yeniden listelerde gösterilecektir."
        confirmLabel="Arşivden çıkar"
        cancelLabel="İptal"
        confirmVariant="default"
        onConfirm={handleUnarchiveConfirm}
        isLoading={isUnarchiving}
      />
    </>
  );
}

