"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LeadSource } from "../types";
import { createLeadSourceAction, updateLeadSourceAction } from "../server-actions";

interface LeadSourceFormProps {
  mode: "create" | "edit";
  initialData?: Pick<LeadSource, "id" | "name" | "description" | "order" | "color">;
}

export function LeadSourceForm({ mode, initialData }: LeadSourceFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [order, setOrder] = useState(
    initialData?.order ?? 0,
  );
  const [color, setColor] = useState(initialData?.color ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const result = await createLeadSourceAction({
          name,
          description: description || undefined,
          order,
          color: color || undefined,
        });
        if (result.success && result.id) {
          window.location.href = `/crm/lead-sources/${result.id}`;
          return;
        }
        setMessage(result.message ?? "Kayıt başarısız.");
      } else if (initialData?.id) {
        const result = await updateLeadSourceAction(initialData.id, {
          name,
          description: description || null,
          order,
          color: color || null,
        });
        if (result.success) {
          window.location.href = `/crm/lead-sources/${initialData.id}`;
          return;
        }
        setMessage(result.message ?? "Güncelleme başarısız.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Yeni lead kaynağı" : "Lead kaynağını düzenle"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <p className="text-sm text-destructive" role="alert">
              {message}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Google Ads"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="İsteğe bağlı"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Sıra</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(event) =>
                setOrder(Number.parseInt(event.target.value, 10) || 0)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Renk (hex)</Label>
            <Input
              id="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="#3b82f6"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Kaydediliyor…"
              : mode === "create"
                ? "Oluştur"
                : "Güncelle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
