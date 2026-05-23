"use client"

import BasicLoader from "@/components/loaders/basic-loader"
import ErrorRedirect from "@/layout/error/error-redirect"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { usePaginatedQuery } from "convex/react"
import { ArrowDown, ArrowUp, ArrowUpDown, Box } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

const PAGE_SIZE = 8

type BrowseSortColumn = "name" | "updatedAt" | "createdAt"
type SortDirection = "asc" | "desc"

type BrowseSceneRow = Omit<Doc<"scenes">, "ownerId">

function defaultSortDirection(column: BrowseSortColumn): SortDirection {
  return column === "name" ? "asc" : "desc"
}

function formatUpdatedAt(updatedAt: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt))
}

const SORT_LABELS: { column: BrowseSortColumn; label: string }[] = [
  { column: "name", label: "Name" },
  { column: "updatedAt", label: "Updated" },
  { column: "createdAt", label: "Created" },
]

function SortToggle({
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

function SceneCard({ scene }: { scene: BrowseSceneRow }) {
  return (
    <Link
      href={`/view/${scene._id}`}
      className="block overflow-hidden rounded-lg border bg-muted/40 transition-colors outline-none hover:border-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="relative flex aspect-video items-center justify-center bg-muted">
        <Box
          strokeWidth={1.25}
          className="size-14 text-muted-foreground"
          aria-hidden
        />
        <span className="sr-only">Scene preview placeholder</span>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div>
          <span className="line-clamp-1 leading-snug font-semibold">
            {scene.name}
          </span>
          <span className="line-clamp-1 text-xs leading-snug font-semibold text-muted-foreground">
            by <span className="text-foreground">{scene.username}</span>
          </span>
        </div>
        <span className="pt-1 text-[11px] text-muted-foreground">
          Updated {formatUpdatedAt(scene.updatedAt)}
        </span>
      </div>
    </Link>
  )
}

const BrowseScenesPage = () => {
  const [sortBy, setSortBy] = useState<BrowseSortColumn>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultSortDirection("updatedAt")
  )

  const {
    results: scenes,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.scenes.listBrowseScenesPaginated,
    { sortBy, sortDirection },
    { initialNumItems: PAGE_SIZE }
  )

  const onSortColumn = useCallback(
    (column: BrowseSortColumn) => {
      if (sortBy === column) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortBy(column)
        setSortDirection(defaultSortDirection(column))
      }
    },
    [sortBy]
  )

  const rows = scenes as BrowseSceneRow[]

  if (status === "LoadingFirstPage") {
    return <BasicLoader />
  }

  if (rows.length === 0 && status === "Exhausted") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">No public scenes yet</h1>
          <p className="text-sm text-muted-foreground">
            When creators mark a scene public, it will show up here.
          </p>
          <Link href="/new">
            <Button>Create a scene</Button>
          </Link>
        </div>
      </div>
    )
  }

  const showLoadMore = status === "CanLoadMore" || status === "LoadingMore"

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-10 sm:px-6">
      <SortToggle
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSortColumn}
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((scene) => (
          <li key={scene._id}>
            <SceneCard scene={scene} />
          </li>
        ))}
      </ul>

      {showLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => loadMore(PAGE_SIZE)}
            disabled={isLoading || status !== "CanLoadMore"}
          >
            {status === "LoadingMore" ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <ErrorRedirect>
      <BrowseScenesPage />
    </ErrorRedirect>
  )
}
