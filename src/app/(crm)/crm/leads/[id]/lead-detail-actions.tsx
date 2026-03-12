"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveLeadAction } from "@/modules/crm/server-actions";
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

  const isArchived = Boolean(archivedAt);
  const canArchive = !isConvertedToPerson && !isArchived;

  const handleArchiveConfirm = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(leadId);
      if (result.success) {
        setArchiveDialogOpen(false);
        router.push("/crm/leads");
        router.refresh();
      } else if (result.message) {
        toast.error(result.message);
      }
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href={`/crm/leads/${leadId}/edit`}>Düzenle</Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => setArchiveDialogOpen(true)}
          disabled={!canArchive || isArchiving}
        >
          {isArchived
            ? "Arşivlendi"
            : isArchiving
              ? "Arşivleniyor…"
              : "Arşivle"}
        </Button>
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
    </>
  );
}

