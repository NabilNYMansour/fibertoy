"use client"

import BasicLoader from "@/components/loaders/basic-loader"
import ErrorRedirect from "@/layout/error/error-redirect"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useMutation, usePaginatedQuery } from "convex/react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Trash,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import PublicEye from "@/components/ui/public-eye"

const PAGE_SIZE = 20

type SortColumn = "name" | "updatedAt" | "createdAt" | "public"
type SortDirection = "asc" | "desc"

function defaultSortDirection(column: SortColumn): SortDirection {
  return column === "name" || column === "public" ? "asc" : "desc"
}

function formatUpdatedAt(updatedAt: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt))
}

const SceneRowActions = ({
  scene,
  onDelete,
}: {
  scene: Doc<"scenes">
  onDelete: (sceneId: Id<"scenes">) => void | Promise<void>
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button size="icon-sm" variant="outline" asChild>
        <Link href={`/view/${scene._id}`}>
          <ExternalLink data-icon="inline-start" />
        </Link>
      </Button>
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => onDelete(scene._id)}
        aria-label={`Delete ${scene.name}`}
      >
        <Trash />
      </Button>
    </div>
  )
}

function SortableHead({
  column,
  label,
  className,
  sortBy,
  sortDirection,
  onSort,
}: {
  column: SortColumn
  label: string
  className?: string
  sortBy: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
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

const HEADERS: { label: string; column: SortColumn; className?: string }[] = [
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
  { label: "Public", column: "public", className: "hidden sm:table-cell" },
]

const MyScenesPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const [sortBy, setSortBy] = useState<SortColumn>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const {
    results: scenes,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.scenes.listMyScenesPaginated,
    user?.id ? { ownerId: user.id, sortBy, sortDirection } : "skip",
    { initialNumItems: PAGE_SIZE }
  )

  const deleteScene = useMutation(api.scenes.deleteScene)

  const handleDelete = async (sceneId: Id<"scenes">) => {
    if (!user?.id) return
    const toastId = toast.loading("Deleting scene...")
    try {
      await deleteScene({ sceneId, ownerId: user.id })
      toast.success("Scene deleted", { id: toastId })
    } catch {
      toast.error("Failed to delete scene", { id: toastId })
    }
  }

  const onSortColumn = useCallback(
    (column: SortColumn) => {
      if (sortBy === column) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortBy(column)
        setSortDirection(defaultSortDirection(column))
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
          <p>Make a new one ᕕ(ᐛ)ᕗ</p>
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
            {HEADERS.map((header) => (
              <SortableHead
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
                  {formatUpdatedAt(scene.updatedAt)}
                </div>
              </TableCell>
              <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                {formatUpdatedAt(scene.updatedAt)}
              </TableCell>
              <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                {formatUpdatedAt(scene.createdAt)}
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
      <MyScenesPage />
    </ErrorRedirect>
  )
}
