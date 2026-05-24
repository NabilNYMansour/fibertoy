export type BrowseSortColumn = "name" | "updatedAt" | "createdAt"

export type SortDirection = "asc" | "desc"

export function defaultBrowseSortDirection(
  column: BrowseSortColumn
): SortDirection {
  return column === "name" ? "asc" : "desc"
}
