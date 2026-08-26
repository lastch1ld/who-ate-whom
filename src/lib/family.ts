import { CompanyNode } from "@/data/types";

/**
 * Walks parentId links up to the ultimate root (a surviving company, or the
 * node itself if it has none) so every company in a merger chain can share
 * one lane color.
 */
export function familyRootId(company: CompanyNode, byId: Map<string, CompanyNode>): string {
  let current = company;
  const seen = new Set<string>();
  while (current.parentId && byId.has(current.parentId) && !seen.has(current.id)) {
    seen.add(current.id);
    current = byId.get(current.parentId)!;
  }
  return current.id;
}

// Muted, brand-adjacent colors per surviving carrier, plus one neutral for
// companies that never got absorbed by a survivor.
export const FAMILY_COLORS: Record<string, string> = {
  american: "#6E7B8B",
  united: "#3E6591",
  delta: "#A23B3B",
  southwest: "#D97B29",
  alaska: "#2C7A73",
  default: "#8A8578",
};

export function familyColor(rootId: string): string {
  return FAMILY_COLORS[rootId] ?? FAMILY_COLORS.default;
}
