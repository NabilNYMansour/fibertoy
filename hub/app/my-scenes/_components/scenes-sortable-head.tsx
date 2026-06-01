"use client"

import { TableHead } from "@/components/ui/table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { MyScenesSortColumn } from "./scenes-utils"
import { SortDirection } from "@/lib/consts"

export function ScenesSortableHead({
  column,
  label,
  className,
  sortBy,
  sortDirection,
  onSort,
}: {
  column: MyScenesSortColumn
  label: string
  className?: string
  sortBy: MyScenesSortColumn
  sortDirection: SortDirection
  onSort: (column: MyScenesSortColumn) => void
}) {
  const active = sortBy === column
  const ariaSort = active
    ? sortDirection === "asc"
      ? "ascending"
      : "descending"
    : "none"

  return (
    <TableHead aria-sort={ariaSort} scope="col" className={className}>
      <button
        type="button"
        className="-mx-3 -my-2 inline-flex cursor-pointer touch-manipulation items-center gap-1.5 px-3 py-2 font-medium hover:text-foreground"
        onClick={() => onSort(column)}
      >
        <span>{label}</span>
        {active ? (
          sortDirection === "asc" ? (
            <ArrowUp className="size-4 opacity-70" aria-hidden />
          ) : (
            <ArrowDown className="size-4 opacity-70" aria-hidden />
          )
        ) : (
          <ArrowUpDown className="size-4 opacity-35" aria-hidden />
        )}
      </button>
    </TableHead>
  )
}

export const SCENES_TABLE_HEADERS: {
  label: string
  column: MyScenesSortColumn
  className?: string
}[] = [
  { label: "Name", column: "name" },
  {
    label: "Updated At",
    column: "updatedAt",
    className: "hidden sm:table-cell",
  },
  {
    label: "Created At",
    column: "createdAt",
    className: "hidden sm:table-cell",
  },
  {
    label: "Views",
    column: "views",
    className: "hidden sm:table-cell text-right tabular-nums",
  },
  {
    label: "Likes",
    column: "likes",
    className: "hidden sm:table-cell text-right tabular-nums",
  },
  { label: "Public", column: "public", className: "hidden sm:table-cell" },
]
