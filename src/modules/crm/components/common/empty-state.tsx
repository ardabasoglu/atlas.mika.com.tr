import React from "react";
import { IconInbox } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({
  title = "Sonuç bulunamadı",
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className ?? ""}`}>
      <div className="text-muted-foreground mb-4">
        {icon ?? <IconInbox className="mx-auto h-12 w-12" />}
      </div>
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      {description && (
        <p className="text-muted-foreground mt-1 text-sm max-w-md">
          {description}
        </p>
      )}
      {action && (
        <Button
          className="mt-4"
          variant={action.variant}
          size={action.size}
          onClick={action.onClick}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
}
