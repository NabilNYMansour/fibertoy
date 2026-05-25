"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { BrowseSortColumn, SortDirection } from "./browse-utils"

const SORT_LABELS: { column: BrowseSortColumn; label: string }[] = [
  { column: "name", label: "Name" },
  { column: "updatedAt", label: "Updated" },
  { column: "createdAt", label: "Created" },
  { column: "views", label: "Views" },
  { column: "likes", label: "Likes" },
]

export function BrowseSortToggle({
  sortBy,
  sortDirection,
  onSort,
}: {
  sortBy: BrowseSortColumn
  sortDirection: SortDirection
  onSort: (column: BrowseSortColumn) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sort scenes">
      {SORT_LABELS.map(({ column, label }) => {
        const active = sortBy === column
        const asc = active && sortDirection === "asc"
        return (
          <Button
            key={column}
            type="button"
            size="sm"
            variant={active ? "secondary" : "outline"}
            aria-pressed={active}
            className={cn("gap-1.5")}
            onClick={() => onSort(column)}
          >
            <span>{label}</span>
            {active ? (
              asc ? (
                <ArrowUp className="size-3.5 opacity-80" aria-hidden />
              ) : (
                <ArrowDown className="size-3.5 opacity-80" aria-hidden />
              )
            ) : (
              <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />
            )}
          </Button>
        )
      })}
    </div>
  )
}
