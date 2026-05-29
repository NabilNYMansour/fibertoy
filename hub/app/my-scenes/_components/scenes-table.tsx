"use client"

import BasicLoader from "@/components/loaders/basic-loader"
import { LoadMoreFooter } from "@/components/pagination/load-more-footer"
import { Button } from "@/components/ui/button"
import PublicEye from "@/components/ui/public-eye"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatSceneDateTime } from "@/lib/format-scene-datetime"
import { useUser } from "@clerk/nextjs"
import { useMutation, usePaginatedQuery } from "convex/react"
import Link from "next/link"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import {
  SCENES_TABLE_HEADERS,
  ScenesSortableHead,
} from "./scenes-sortable-head"
import { SceneRowActions } from "./scene-row-actions"
import {
  defaultMyScenesSortDirection,
  type MyScenesSortColumn,
  type SortDirection,
} from "./scenes-utils"

const PAGE_SIZE = 20

export function ScenesTable() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [sortBy, setSortBy] = useState<MyScenesSortColumn>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultMyScenesSortDirection("updatedAt")
  )

  const {
    results: scenes,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.scenes.listMyScenesPaginated,
    user?.id ? { sortBy, sortDirection } : "skip",
    { initialNumItems: PAGE_SIZE }
  )

  const deleteScene = useMutation(api.scenes.deleteScene)

  const handleDelete = async (sceneId: Id<"scenes">) => {
    if (!user?.id) return
    const toastId = toast.loading("Deleting scene...")
    try {
      await deleteScene({ sceneId })
      toast.success("Scene deleted", { id: toastId })
    } catch {
      toast.error("Failed to delete scene", { id: toastId })
    }
  }

  const onSortColumn = useCallback(
    (column: MyScenesSortColumn) => {
      if (sortBy === column) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortBy(column)
        setSortDirection(defaultMyScenesSortDirection(column))
      }
    },
    [sortBy]
  )

  if (!isLoaded) {
    return <BasicLoader />
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2">
        <p>You must be signed in to view this page.</p>
        <Link href="/sign-in?redirectUrl=/my-scenes">
          <Button>Sign in</Button>
        </Link>
      </div>
    )
  }

  if (status === "LoadingFirstPage") {
    return <BasicLoader />
  }

  if (scenes.length === 0 && status === "Exhausted") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl">No scenes found</h1>
          <p className="text-sm text-muted-foreground">Make a new one ᕕ(ᐛ)ᕗ</p>
          <Link href="/new">
            <Button>New Scene</Button>
          </Link>
        </div>
      </div>
    )
  }

  const showLoadMore = status === "CanLoadMore" || status === "LoadingMore"

  return (
    <div className="flex flex-col gap-4 pb-8">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {SCENES_TABLE_HEADERS.map((header) => (
              <ScenesSortableHead
                key={header.column}
                column={header.column}
                label={header.label}
                className={header.className}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSortColumn}
              />
            ))}
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenes.map((scene) => (
            <TableRow key={scene._id}>
              <TableCell className="max-w-48 font-medium sm:max-w-none">
                <Link
                  href={`/view/${scene._id}`}
                  className="hover:text-primary hover:underline"
                >
                  <div className="flex items-center gap-1">
                    <div className="sm:hidden">
                      <PublicEye isPublic={scene.public} />
                    </div>
                    {scene.name}
                  </div>
                </Link>
                <div className="text-xs text-muted-foreground sm:hidden">
                  {formatSceneDateTime(scene.updatedAt)}
                  {" - "}
                  {scene.views} views
                  {" - "}
                  {scene.likes} likes
                </div>
              </TableCell>
              <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                {formatSceneDateTime(scene.updatedAt)}
              </TableCell>
              <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                {formatSceneDateTime(scene.createdAt)}
              </TableCell>
              <TableCell className="hidden text-right text-xs tabular-nums sm:table-cell">
                {scene.views}
              </TableCell>
              <TableCell className="hidden text-right text-xs tabular-nums sm:table-cell">
                {scene.likes}
              </TableCell>
              <TableCell className="hidden text-xs md:table-cell">
                <div className="flex items-center gap-1">
                  <PublicEye isPublic={scene.public} />
                  {scene.public ? "Public" : "Private"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <SceneRowActions scene={scene} onDelete={handleDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
