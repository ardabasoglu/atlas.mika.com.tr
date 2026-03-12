"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useConvertLead } from "../hooks";
import { Lead } from "../types";
import { Loader2Icon, UserPlusIcon } from "lucide-react";

interface ConvertLeadButtonProps {
  lead: Lead;
}

export function ConvertLeadButton({ lead }: ConvertLeadButtonProps) {
  const router = useRouter();
  const convertLead = useConvertLead();
  const [open, setOpen] = useState(false);
  const [createDeal, setCreateDeal] = useState(false);

  const hasPersonForLead = Boolean(lead.personId);
  const canConvert = lead.status !== "lost" && !(lead.status === "converted" && hasPersonForLead);
  const sheetDescription = hasPersonForLead
    ? "Bu aday zaten bir kişi (Person) ile ilişkilendirilmiş. İsterseniz bir fırsat (Deal) ekleyebilirsiniz."
    : "Bu aday için kişi (Person) oluşturulacak. İsterseniz bir fırsat (Deal) da ekleyebilirsiniz.";

  function handleConvert() {
    convertLead.mutate(
      { leadId: lead.id, createDeal },
      {
        onSuccess: (result) => {
          setOpen(false);
          router.push(`/crm/persons/${result.personId}`);
        },
      }
    );
  }

  if (!canConvert) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Dönüştür
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adayı dönüştür</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createDeal"
              checked={createDeal}
              onCheckedChange={(checked) =>
                setCreateDeal(checked === true)
              }
            />
            <Label htmlFor="createDeal" className="cursor-pointer">
              Fırsat (gayrimenkul) oluştur
            </Label>
          </div>
          {convertLead.error && (
            <p className="text-sm text-destructive">
              {convertLead.error instanceof Error
                ? convertLead.error.message
                : "Dönüştürme başarısız"}
            </p>
          )}
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={convertLead.isPending}
          >
            İptal
          </Button>
          <Button onClick={handleConvert} disabled={convertLead.isPending}>
            {convertLead.isPending ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlusIcon className="mr-2 h-4 w-4" />
            )}
            Dönüştür
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
