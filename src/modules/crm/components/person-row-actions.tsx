"use client";

import type { Person } from "../types";
import { EntityActionMenu, type ActionMenuItem } from "./common/entity-action-menu";

interface PersonRowActionsProps {
  person: Person;
}

export function PersonRowActions({ person }: PersonRowActionsProps) {
  const actions: ActionMenuItem[] = [
    {
      label: "Görüntüle",
      href: `/crm/persons/${person.id}`,
    },
    {
      label: "Düzenle",
      href: `/crm/persons/${person.id}/edit`,
    },
  ];

  return (
    <EntityActionMenu
      entityId={person.id}
      basePath="/crm/persons"
      actions={actions}
    />
  );
}

