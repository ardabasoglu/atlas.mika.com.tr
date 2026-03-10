"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteLeadSourceAction } from "@/modules/crm/server-actions";
import { useState } from "react";

interface LeadSourceDetailActionsProps {
  leadSourceId: string;
}

export function LeadSourceDetailActions({
  leadSourceId,
}: LeadSourceDetailActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu kaynağı silmek istediğinize emin misiniz? Adaylardaki kaynak bilgisi boşalacaktır.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const result = await deleteLeadSourceAction(leadSourceId);
      if (result.success) {
        router.push("/crm/lead-sources");
        router.refresh();
      } else {
        alert(result.message ?? "Silinirken hata oluştu.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Siliniyor…" : "Sil"}
    </Button>
  );
}
