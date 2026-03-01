"use client";

import React from "react";
import Link from "next/link";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  disabled?: boolean;
}

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
          if (item.href) {
            return (
              <DropdownMenuItem key={index} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
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
  );
}
