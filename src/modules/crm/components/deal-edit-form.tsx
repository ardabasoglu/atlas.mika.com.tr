"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Deal, Lifecycle } from "../types";
import { crmServices } from "../services";
import { projectServices } from "@/modules/project/services";
import type { Project } from "@/modules/project/types";
import type { Unit } from "@/modules/project/types";

interface DealEditFormProps {
  deal: Deal;
  initialProjectId?: string;
}

export function DealEditForm({ deal, initialProjectId }: DealEditFormProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
  const [projectId, setProjectId] = useState<string>(initialProjectId ?? "");
  const [unitId, setUnitId] = useState<string>(deal.unitId ?? "");
  const [lifecycleId, setLifecycleId] = useState<string>(deal.lifecycleId ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectServices.getProjects().then(setProjects);
  }, []);

  useEffect(() => {
    crmServices.getLifecycles().then(setLifecycles);
  }, []);

  useEffect(() => {
    if (initialProjectId && !projectId) {
      setProjectId(initialProjectId);
    }
  }, [initialProjectId, projectId]);

  useEffect(() => {
    if (!projectId) {
      setUnits([]);
      setUnitId("");
      return;
    }
    projectServices.getUnitsByProjectId(projectId).then((list) => {
      setUnits(list);
      const currentUnitInList = list.some((unit) => unit.id === unitId);
      if (unitId && !currentUnitInList) {
        setUnitId("");
      }
    });
  }, [projectId, unitId]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await crmServices.updateDeal(deal.id, {
        lifecycleId: lifecycleId || null,
        unitId: unitId || null,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydetme başarısız");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    (lifecycleId || "") !== (deal.lifecycleId ?? "") ||
    (unitId || "") !== (deal.unitId ?? "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fırsatı Düzenle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Yaşam döngüsü (Aşama)</Label>
          <Select
            value={lifecycleId || undefined}
            onValueChange={setLifecycleId}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Aşama seçin" />
            </SelectTrigger>
            <SelectContent>
              {lifecycles.map((lifecycle) => (
                <SelectItem key={lifecycle.id} value={lifecycle.id}>
                  {lifecycle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Proje</Label>
          <Select
            value={projectId || undefined}
            onValueChange={(value) => {
              setProjectId(value);
              setUnitId("");
            }}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Proje seçin" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Birim</Label>
          <Select
            value={unitId || undefined}
            onValueChange={setUnitId}
            disabled={!projectId}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Birim seçin" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.code} · {unit.sizeSqm} m²
                  {unit.status !== "available"
                    ? ` (${unit.status === "reserved" ? "Rezerve" : "Satıldı"})`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
}
