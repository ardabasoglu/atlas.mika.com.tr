import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Maximize2, Banknote, Layers, FileText, User } from "lucide-react";
import { formatMoney } from "@/lib/currency";
import { Unit } from "../types";
import { unitTypeLabels, unitStatusLabels } from "../unit-labels";

interface UnitCardProps {
  unit: Unit;
  projectName?: string;
  dealTitle?: string;
  personName?: string;
}

export function UnitCard({
  unit,
  projectName,
  dealTitle,
  personName,
}: UnitCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{unit.code}</CardTitle>
        <CardDescription>
          {unitTypeLabels[unit.type]} · {unitStatusLabels[unit.status]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <span>{unit.sizeSqm} m²</span>
          </div>

          {unit.price != null && (
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span>{formatMoney(unit.price, unit.currency)}</span>
            </div>
          )}

          {unit.floor != null && (
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span>Kat {unit.floor}</span>
            </div>
          )}

          {(unit.dealId || unit.personId) && (
            <div className="flex flex-col gap-2 pt-2 border-t">
              {unit.dealId && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Link
                    href={`/crm/deals/${unit.dealId}`}
                    className="text-sm hover:underline"
                  >
                    {dealTitle ?? `Fırsat ${unit.dealId}`}
                  </Link>
                </div>
              )}
              {unit.personId && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Link
                    href={`/crm/persons/${unit.personId}`}
                    className="text-sm hover:underline"
                  >
                    {personName ?? `Alıcı ${unit.personId}`}
                  </Link>
                </div>
              )}
            </div>
          )}

          {projectName && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Link
                href={`/project/projects/${unit.projectId}`}
                className="text-sm hover:underline"
              >
                {projectName}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
