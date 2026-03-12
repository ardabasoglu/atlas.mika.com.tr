"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionMenuItem =
  | {
      type?: "item";
      label: string;
      href?: string;
      onClick?: () => void;
      variant?: "default" | "destructive";
      icon?: React.ReactNode;
      disabled?: boolean;
    }
  | { type: "separator" };

interface EntityActionMenuProps {
  entityId: string;
  basePath: string;
  actions?: ActionMenuItem[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function EntityActionMenu({
  entityId,
  basePath,
  actions = [],
  onView,
  onEdit,
  onDelete,
  className,
}: EntityActionMenuProps) {
  const router = useRouter();
  const defaultActions: ActionMenuItem[] = [];

  if (onView) {
    defaultActions.push({
      label: "Görüntüle",
      onClick: () => onView(entityId),
    });
  } else {
    defaultActions.push({
      label: "Görüntüle",
      href: `${basePath}/${entityId}`,
    });
  }

  if (onEdit) {
    defaultActions.push({
      label: "Düzenle",
      onClick: () => onEdit(entityId),
    });
  }

  if (onDelete) {
    defaultActions.push({
      label: "Sil",
      variant: "destructive",
      onClick: () => onDelete(entityId),
    });
  }

  const menuItems = actions.length > 0 ? actions : defaultActions;

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground data-[state=open]:bg-muted flex size-8"
          >
            <IconDotsVertical />
            <span className="sr-only">Menüyü aç</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={className}>
          {menuItems.map((item, index) => {
            if (item.type === "separator") {
              return <DropdownMenuSeparator key={index} />;
            }

            const handleSelect = item.href
              ? () => router.push(item.href!)
              : item.onClick;

            return (
              <DropdownMenuItem
                key={index}
                onSelect={() => {
                  handleSelect?.();
                }}
                disabled={item.disabled}
                className={
                  item.variant === "destructive"
                    ? "text-destructive focus:text-destructive"
                    : undefined
                }
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
