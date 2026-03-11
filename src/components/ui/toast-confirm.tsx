"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ToastConfirmOptions = {
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
};

export function toastConfirm(message: ReactNode, options: ToastConfirmOptions = {}) {
  const {
    confirmLabel = "Onayla",
    cancelLabel = "İptal",
    confirmVariant = "default",
  } = options;

  return new Promise<boolean>((resolve) => {
    let toastIdentifier: string | number | undefined;

    const resolveAndDismiss = (isConfirmed: boolean) => {
      if (toastIdentifier !== undefined) toast.dismiss(toastIdentifier);
      resolve(isConfirmed);
    };

    toastIdentifier = toast(
      <div className="flex flex-col gap-3">
        <div className="text-sm">{message}</div>
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => resolveAndDismiss(false)}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={confirmVariant}
            onClick={() => resolveAndDismiss(true)}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>,
      { duration: Infinity },
    );
  });
}

