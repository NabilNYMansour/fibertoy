import { SortDirection } from "@/lib/consts"

export type MyScenesSortColumn =
  | "name"
  | "updatedAt"
  | "createdAt"
  | "public"
  | "views"
  | "likes"

export function defaultMyScenesSortDirection(
  column: MyScenesSortColumn
): SortDirection {
  return column === "name" || column === "public" ? "asc" : "desc"
}
