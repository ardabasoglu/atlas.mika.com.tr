"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { archiveLeadAction } from "@/modules/crm/server-actions";
import { useState } from "react";
import Link from "next/link";

interface LeadDetailActionsProps {
  leadId: string;
  status: "new" | "contacted" | "qualified" | "lost" | "converted";
  archivedAt?: string;
}

export function LeadDetailActions({
  leadId,
  status,
  archivedAt,
}: LeadDetailActionsProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  const isConverted = status === "converted";
  const isArchived = Boolean(archivedAt);
  const canArchive = !isConverted && !isArchived;

  const handleArchive = async () => {
    if (!canArchive) return;
    const confirmed = window.confirm(
      "Bu adayı arşivlemek istediğinize emin misiniz? Arşivlenen aday listelerde gösterilmeyecektir.",
    );
    if (!confirmed) return;

    setIsArchiving(true);
    try {
      const result = await archiveLeadAction(leadId);
      if (result.success) {
        router.push("/crm/leads");
        router.refresh();
      } else if (result.message) {
        window.alert(result.message);
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

