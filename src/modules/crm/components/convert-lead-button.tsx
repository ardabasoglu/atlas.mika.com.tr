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
import { crmServices } from "../services";
import { Lead } from "../types";
import { Loader2Icon, UserPlusIcon } from "lucide-react";

interface ConvertLeadButtonProps {
  lead: Lead;
}

export function ConvertLeadButton({ lead }: ConvertLeadButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createDeal, setCreateDeal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canConvert =
    lead.status !== "converted" && lead.status !== "disqualified";

  async function handleConvert() {
    setError(null);
    setLoading(true);
    try {
      const result = await crmServices.convertLead(lead.id, { createDeal });
      setOpen(false);
      router.push(`/crm/contacts/${result.contactId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dönüştürme başarısız");
    } finally {
      setLoading(false);
    }
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
          <SheetDescription>
            Bu aday için kişi (Contact) ve gerekiyorsa firma (Account)
            oluşturulacak. İsterseniz bir fırsat (gayrimenkul) da ekleyebilirsiniz.
          </SheetDescription>
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
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            İptal
          </Button>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? (
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
