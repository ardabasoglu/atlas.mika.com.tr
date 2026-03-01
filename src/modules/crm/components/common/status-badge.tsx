import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  XCircle,
  UserPlus,
  Sparkles,
  Target,
  UserSearch,
  ClipboardCheck,
  FileText,
  Handshake,
  Trophy,
} from "lucide-react";

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

type StatusType =
  | "lead"
  | "customer"
  | "deal"
  | "activity"
  | "generic";

interface StatusConfig {
  label: string;
  variant: BadgeProps["variant"];
  icon?: LucideIcon;
  iconClassName?: string;
}

const statusConfigs: Record<StatusType, Record<string, StatusConfig>> = {
  lead: {
    new: {
      label: "Yeni",
      variant: "secondary",
      icon: Sparkles,
      iconClassName: "text-muted-foreground",
    },
    qualified: {
      label: "Nitelikli",
      variant: "secondary",
      icon: Target,
      iconClassName: "text-blue-600",
    },
    converted: {
      label: "Dönüştürüldü",
      variant: "default",
      icon: CheckCircle,
      iconClassName: "text-green-600",
    },
    disqualified: {
      label: "Elendi",
      variant: "destructive",
      icon: XCircle,
      iconClassName: "text-destructive",
    },
  },
  customer: {
    active: {
      label: "Aktif",
      variant: "default",
      icon: CheckCircle,
      iconClassName: "text-green-600",
    },
    inactive: {
      label: "Pasif",
      variant: "destructive",
      icon: XCircle,
      iconClassName: "text-destructive",
    },
    prospect: {
      label: "Potansiyel",
      variant: "secondary",
      icon: UserPlus,
      iconClassName: "text-muted-foreground",
    },
  },
  deal: {
    prospecting: {
      label: "Aday Müşteri",
      variant: "secondary",
      icon: UserSearch,
      iconClassName: "text-muted-foreground",
    },
    qualification: {
      label: "Nitelik",
      variant: "secondary",
      icon: ClipboardCheck,
      iconClassName: "text-blue-600",
    },
    proposal: {
      label: "Teklif",
      variant: "outline",
      icon: FileText,
      iconClassName: "text-muted-foreground",
    },
    negotiation: {
      label: "Müzakere",
      variant: "secondary",
      icon: Handshake,
      iconClassName: "text-amber-600",
    },
    "closed-won": {
      label: "Kazanıldı",
      variant: "default",
      icon: Trophy,
      iconClassName: "text-green-600",
    },
    "closed-lost": {
      label: "Kaybedildi",
      variant: "destructive",
      icon: XCircle,
      iconClassName: "text-destructive",
    },
  },
  activity: {
    completed: { label: "Tamamlandı", variant: "default" },
    pending: { label: "Beklemede", variant: "secondary" },
  },
  generic: {},
};

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export function StatusBadge({ status, type = "generic", className }: StatusBadgeProps) {
  const config = statusConfigs[type]?.[status];

  const label = config?.label ?? formatStatusLabel(status);
  const Icon = config?.icon;

  return (
    <Badge variant="outline" className={className}>
      {Icon && (
        <Icon
          data-icon="inline-start"
          className={config.iconClassName}
          aria-hidden
        />
      )}
      {label}
    </Badge>
  );
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
