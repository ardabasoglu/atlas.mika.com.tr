"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveLeadAction, unarchiveLeadAction } from "@/modules/crm/server-actions";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface LeadDetailActionsProps {
  leadId: string;
  isConvertedToPerson: boolean;
  archivedAt?: string;
}

const ARCHIVE_MESSAGE =
  "Bu adayı arşivlemek istediğinize emin misiniz? Arşivlenen aday listelerde gösterilmeyecektir.";

export function LeadDetailActions({
  leadId,
  isConvertedToPerson,
  archivedAt,
}: LeadDetailActionsProps) {
  const router = useRouter();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const isArchived = Boolean(archivedAt);
  const canArchive = !isConvertedToPerson && !isArchived;

  const handleArchiveConfirm = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(leadId);
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
      const result = await unarchiveLeadAction(leadId);
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

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href={`/crm/leads/${leadId}/edit`}>Düzenle</Link>
        </Button>
        {isArchived ? (
          <Button
            variant="outline"
            onClick={() => setUnarchiveDialogOpen(true)}
            disabled={isUnarchiving}
          >
            {isUnarchiving ? "Arşivden çıkarılıyor…" : "Arşivden çıkar"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setArchiveDialogOpen(true)}
            disabled={!canArchive || isArchiving}
          >
            {isArchiving ? "Arşivleniyor…" : "Arşivle"}
          </Button>
        )}
      </div>
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

