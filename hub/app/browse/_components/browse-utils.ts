import { SortDirection } from "@/lib/consts"

export type BrowseSortColumn =
  | "name"
  | "updatedAt"
  | "createdAt"
  | "views"
  | "likes"

export function defaultBrowseSortDirection(
  column: BrowseSortColumn
): SortDirection {
  return column === "name" ? "asc" : "desc"
}
