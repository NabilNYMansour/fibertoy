export type MyScenesSortColumn =
  | "name"
  | "updatedAt"
  | "createdAt"
  | "public"
  | "views"

export type SortDirection = "asc" | "desc"

export function defaultMyScenesSortDirection(
  column: MyScenesSortColumn
): SortDirection {
  return column === "name" || column === "public" ? "asc" : "desc"
}
