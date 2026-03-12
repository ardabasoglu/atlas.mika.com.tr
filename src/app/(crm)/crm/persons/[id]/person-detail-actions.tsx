"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archivePersonAction, unarchivePersonAction } from "@/modules/crm/server-actions";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface PersonDetailActionsProps {
  personId: string;
  archivedAt?: string;
}

const ARCHIVE_MESSAGE =
  "Bu kişiyi arşivlemek istediğinize emin misiniz? Arşivlenen kişi aktif listede gösterilmeyecektir.";

export function PersonDetailActions({
  personId,
  archivedAt,
}: PersonDetailActionsProps) {
  const router = useRouter();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const isArchived = Boolean(archivedAt);

  const handleArchiveConfirm = async () => {
    setIsArchiving(true);
    try {
      const result = await archivePersonAction(personId);
      if (result.success) {
        setArchiveDialogOpen(false);
        router.push("/crm/persons/archived");
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
      const result = await unarchivePersonAction(personId);
      if (result.success) {
        setUnarchiveDialogOpen(false);
        router.push("/crm/persons");
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
          <Link href={`/crm/persons/${personId}/edit`}>Düzenle</Link>
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
            disabled={isArchiving}
          >
            {isArchiving ? "Arşivleniyor…" : "Arşivle"}
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Kişiyi arşivle"
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
        title="Kişiyi arşivden çıkar"
        description="Bu kişiyi arşivden çıkarmak istediğinize emin misiniz? Kişi yeniden aktif listede gösterilecektir."
        confirmLabel="Arşivden çıkar"
        cancelLabel="İptal"
        confirmVariant="default"
        onConfirm={handleUnarchiveConfirm}
        isLoading={isUnarchiving}
      />
    </>
  );
}
