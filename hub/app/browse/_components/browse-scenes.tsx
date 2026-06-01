"use client"

import BasicLoader from "@/components/loaders/basic-loader"
import { LoadMoreFooter } from "@/components/pagination/load-more-footer"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { usePaginatedQuery } from "convex/react"
import Link from "next/link"
import { Suspense, useCallback, useState } from "react"
import { BrowseSortToggle } from "./browse-sort-toggle"
import {
  type BrowseSortColumn,
  defaultBrowseSortDirection,
} from "./browse-utils"
import { SceneCard } from "@/components/scene-card"
import { useSearchParams } from "next/navigation"
import { SortDirection } from "@/lib/consts"

const PAGE_SIZE = 8

function BrowseScenesMain() {
  const searchParams = useSearchParams()
  const search = searchParams.get("q") ?? ""

  const [sortBy, setSortBy] = useState<BrowseSortColumn>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultBrowseSortDirection("updatedAt")
  )

  const {
    results: scenes,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.scenes.listBrowseScenesPaginated,
    { sortBy, sortDirection, search },
    { initialNumItems: PAGE_SIZE }
  )

  const onSortColumn = useCallback(
    (column: BrowseSortColumn) => {
      if (sortBy === column) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortBy(column)
        setSortDirection(defaultBrowseSortDirection(column))
      }
    },
    [sortBy]
  )

  const rows = scenes

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
    <div className="flex flex-col gap-2 p-2">
      <BrowseSortToggle
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSortColumn}
        disabled={!!search}
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((scene) => (
          <li key={scene._id}>
            <SceneCard scene={scene} />
          </li>
        ))}
      </ul>

      <LoadMoreFooter
        visible={showLoadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        queryIsLoading={isLoading}
        onLoadMore={() => loadMore(PAGE_SIZE)}
      />
    </div>
  )
}

export function BrowseScenes() {
  return (
    <Suspense>
      <BrowseScenesMain />
    </Suspense>
  )
}
