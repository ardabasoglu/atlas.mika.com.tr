"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/currency";
import { PaymentPlanForm } from "./payment-plan-form";
import type { Deal } from "../types";

interface DealPaymentPlanCardProps {
  deal: Deal;
}

export function DealPaymentPlanCard({ deal }: DealPaymentPlanCardProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSaved = () => {
    setSheetOpen(false);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ödeme planı</CardTitle>
      </CardHeader>
      <CardContent>
        {deal.paymentPlan ? (
          <>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">
                  Peşinat
                </dt>
                <dd>
                  {formatMoney(
                    deal.paymentPlan.downPaymentAmount,
                    deal.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  Taksit
                </dt>
                <dd>
                  {deal.paymentPlan.installmentCount} x{" "}
                  {formatMoney(
                    deal.paymentPlan.installmentAmount,
                    deal.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  Balon
                </dt>
                <dd>
                  {formatMoney(
                    deal.paymentPlan.balloonAmount,
                    deal.currency,
                  )}
                  {deal.paymentPlan.balloonDueMonth === null
                    ? " (Vade sonu)"
                    : deal.paymentPlan.balloonDueMonth === 0
                      ? " (İmzada)"
                      : ` (Ay ${deal.paymentPlan.balloonDueMonth})`}
                </dd>
              </div>
              <div className="border-t pt-2 mt-2">
                <dt className="font-medium text-muted-foreground">
                  Toplam
                </dt>
                <dd>{formatMoney(deal.value, deal.currency)}</dd>
              </div>
            </dl>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="mt-3">
                  Düzenle
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Ödeme planını düzenle</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <PaymentPlanForm
                    dealId={deal.id}
                    existingPlan={deal.paymentPlan}
                    currency={deal.currency}
                    onSaved={handleSaved}
                    onCancel={() => setSheetOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Ödeme planı yok.
            </p>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="mt-3">
                  Plan ekle
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Ödeme planı ekle</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <PaymentPlanForm
                    dealId={deal.id}
                    existingPlan={null}
                    currency={deal.currency}
                    onSaved={handleSaved}
                    onCancel={() => setSheetOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </CardContent>
    </Card>
  );
}
