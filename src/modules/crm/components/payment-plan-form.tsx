"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PaymentPlan } from "../types";
import { crmServices } from "../services";

export interface PaymentPlanFormPayload {
  downPaymentAmount: number;
  installmentCount: number;
  installmentAmount: number;
  balloonAmount: number;
  balloonDueMonth: number | null;
}

interface PaymentPlanFormProps {
  dealId: string;
  existingPlan?: PaymentPlan | null;
  currency?: string;
  onSaved: () => void;
  onCancel?: () => void;
}

const BALLOON_DUE_OPTIONS: { value: string; label: string }[] = [
  { value: "end", label: "Vade sonu" },
  { value: "0", label: "İmzada" },
  ...Array.from({ length: 60 }, (_, index) => ({
    value: String(index + 1),
    label: `Ay ${index + 1}`,
  })),
];

function parseBalloonDueMonth(value: string): number | null {
  if (value === "end" || value === "") return null;
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? null : number;
}

export function PaymentPlanForm({
  dealId,
  existingPlan,
  onSaved,
  onCancel,
}: PaymentPlanFormProps) {
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>(
    existingPlan ? String(existingPlan.downPaymentAmount) : ""
  );
  const [installmentCount, setInstallmentCount] = useState<string>(
    existingPlan ? String(existingPlan.installmentCount) : ""
  );
  const [installmentAmount, setInstallmentAmount] = useState<string>(
    existingPlan ? String(existingPlan.installmentAmount) : ""
  );
  const [balloonAmount, setBalloonAmount] = useState<string>(
    existingPlan ? String(existingPlan.balloonAmount) : "0"
  );
  const [balloonDueMonth, setBalloonDueMonth] = useState<string>(
    existingPlan
      ? existingPlan.balloonDueMonth === null
        ? "end"
        : String(existingPlan.balloonDueMonth)
      : "end"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const down = Number(downPaymentAmount);
    const count = Number(installmentCount);
    const installment = Number(installmentAmount);
    const balloon = Number(balloonAmount);
    if (
      Number.isNaN(down) ||
      Number.isNaN(count) ||
      Number.isNaN(installment) ||
      Number.isNaN(balloon)
    ) {
      setError("Tüm alanlar sayı olmalıdır.");
      return;
    }
    if (down < 0 || installment < 0 || balloon < 0) {
      setError("Tutarlar negatif olamaz.");
      return;
    }
    if (count < 0) {
      setError("Taksit sayısı negatif olamaz.");
      return;
    }
    setSaving(true);
    try {
      await crmServices.savePaymentPlan(dealId, {
        downPaymentAmount: down,
        installmentCount: count,
        installmentAmount: installment,
        balloonAmount: balloon,
        balloonDueMonth: parseBalloonDueMonth(balloonDueMonth),
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydetme başarısız");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="downPaymentAmount">Peşinat</Label>
        <Input
          id="downPaymentAmount"
          type="number"
          min={0}
          step={1}
          value={downPaymentAmount}
          onChange={(event) => setDownPaymentAmount(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="installmentCount">Taksit sayısı</Label>
        <Input
          id="installmentCount"
          type="number"
          min={0}
          step={1}
          value={installmentCount}
          onChange={(event) => setInstallmentCount(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="installmentAmount">Taksit tutarı</Label>
        <Input
          id="installmentAmount"
          type="number"
          min={0}
          step={1}
          value={installmentAmount}
          onChange={(event) => setInstallmentAmount(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="balloonAmount">Balon tutar</Label>
        <Input
          id="balloonAmount"
          type="number"
          min={0}
          step={1}
          value={balloonAmount}
          onChange={(event) => setBalloonAmount(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Balon vadesi</Label>
        <Select
          value={balloonDueMonth}
          onValueChange={setBalloonDueMonth}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Seçin" />
          </SelectTrigger>
          <SelectContent>
            {BALLOON_DUE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
        )}
      </div>
    </form>
  );
}
