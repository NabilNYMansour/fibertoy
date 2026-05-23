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
import { useMutation, useQuery } from "convex/react"
import { ExternalLink, Trash } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import PublicEye from "@/components/ui/public-eye"

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

const MyScenesPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()

  const scenes = useQuery(
    api.scenes.getUserScenes,
    user?.id ? { ownerId: user?.id } : "skip"
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

  if (!isLoaded || !scenes) {
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

  if (scenes?.length === 0) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Last updated</TableHead>
          <TableHead className="hidden sm:table-cell">Created at</TableHead>
          <TableHead className="hidden md:table-cell">Visibility</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
  )
}

export default function Page() {
  return (
    <ErrorRedirect>
      <MyScenesPage />
    </ErrorRedirect>
  )
}
