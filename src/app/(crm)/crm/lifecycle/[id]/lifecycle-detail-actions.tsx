"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteLifecycleAction } from "@/modules/crm/server-actions";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface LifecycleDetailActionsProps {
  lifecycleId: string;
}

const DELETE_MESSAGE =
  "Bu yaşam döngüsünü silmek istediğinize emin misiniz? Bu döngüyü kullanan aday veya fırsat varsa silme işlemi yapılamaz.";

export function LifecycleDetailActions({
  lifecycleId,
}: LifecycleDetailActionsProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLifecycleAction(lifecycleId);
      if (result.success) {
        setDeleteDialogOpen(false);
        router.push("/crm/lifecycle");
        router.refresh();
      } else if (result.message) {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setDeleteDialogOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? "Siliniyor…" : "Sil"}
      </Button>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Yaşam döngüsünü sil"
        description={DELETE_MESSAGE}
        confirmLabel="Sil"
        cancelLabel="İptal"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
}
