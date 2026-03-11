"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveLeadAction } from "@/modules/crm/server-actions";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toast-confirm";

interface LeadDetailActionsProps {
  leadId: string;
  isConvertedToPerson: boolean;
  archivedAt?: string;
}

export function LeadDetailActions({
  leadId,
  isConvertedToPerson,
  archivedAt,
}: LeadDetailActionsProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  const isArchived = Boolean(archivedAt);
  const canArchive = !isConvertedToPerson && !isArchived;

  const handleArchive = async () => {
    if (!canArchive) return;
    const isConfirmed = await toastConfirm(
      "Bu adayı arşivlemek istediğinize emin misiniz? Arşivlenen aday listelerde gösterilmeyecektir.",
      { confirmLabel: "Arşivle", confirmVariant: "destructive" },
    );
    if (!isConfirmed) return;

    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(leadId);
      if (result.success) {
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
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link href={`/crm/leads/${leadId}/edit`}>Düzenle</Link>
      </Button>
      <Button
        variant="outline"
        onClick={handleArchive}
        disabled={!canArchive || isArchiving}
      >
        {isArchived
          ? "Arşivlendi"
          : isArchiving
            ? "Arşivleniyor…"
            : "Arşivle"}
      </Button>
    </div>
  );
}

