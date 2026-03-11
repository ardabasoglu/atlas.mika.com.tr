export function toIdMap<T extends { id: string }>(
  items: T[] | undefined | null,
): Map<string, T> | null {
  if (!items || items.length === 0) {
    return null;
  }

  return new Map(items.map((item) => [item.id, item]));
}

