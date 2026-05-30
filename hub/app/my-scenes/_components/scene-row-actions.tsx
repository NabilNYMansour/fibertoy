"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { ExternalLink, ImageIcon, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function SceneRowActions({
  scene,
  thumbnailUrl,
  onDelete,
}: {
  scene: Omit<Doc<"scenes">, "ownerId">
  thumbnailUrl: string | undefined
  onDelete: (sceneId: Id<"scenes">) => void | Promise<void>
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(scene._id)
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger>
          <Badge variant="ghost" className="hidden cursor-help sm:block">
            <ImageIcon data-icon="inline-start" />
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent>
          {thumbnailUrl ? (
            <Image
              width={512}
              height={288}
              src={thumbnailUrl}
              alt={scene.name}
            />
          ) : (
            <div className="text-center">No thumbnail yet</div>
          )}
        </HoverCardContent>
      </HoverCard>

      <Button size="icon-sm" variant="outline" asChild>
        <Link href={`/view/${scene._id}`}>
          <ExternalLink data-icon="inline-start" />
        </Link>
      </Button>

      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => setDeleteDialogOpen(true)}
        aria-label={`Delete ${scene.name}`}
      >
        <Trash />
      </Button>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete scene?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{scene.name}&rdquo;? This
              action cannot be undone
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
