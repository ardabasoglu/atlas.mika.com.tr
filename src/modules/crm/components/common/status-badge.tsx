import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  XCircle,
  Sparkles,
  Target,
  UserSearch,
  ClipboardCheck,
  FileText,
  Handshake,
  Trophy,
  Phone,
} from "lucide-react";

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

type StatusType =
  | "lead"
  | "deal"
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
    contacted: {
      label: "İletişime Geçildi",
      variant: "secondary",
      icon: Phone,
      iconClassName: "text-blue-600",
    },
    qualified: {
      label: "Nitelikli",
      variant: "secondary",
      icon: Target,
      iconClassName: "text-blue-600",
    },
    lost: {
      label: "Kaybedildi",
      variant: "destructive",
      icon: XCircle,
      iconClassName: "text-destructive",
    },
    converted: {
      label: "Dönüştürüldü",
      variant: "default",
      icon: CheckCircle,
      iconClassName: "text-green-600",
    },
  },
  deal: {
    inquiry: {
      label: "Sorgulama",
      variant: "secondary",
      icon: UserSearch,
      iconClassName: "text-muted-foreground",
    },
    meeting: {
      label: "Toplantı",
      variant: "secondary",
      icon: ClipboardCheck,
      iconClassName: "text-blue-600",
    },
    offer: {
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
    won: {
      label: "Kazanıldı",
      variant: "default",
      icon: Trophy,
      iconClassName: "text-green-600",
    },
    lost: {
      label: "Kaybedildi",
      variant: "destructive",
      icon: XCircle,
      iconClassName: "text-destructive",
    },
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
