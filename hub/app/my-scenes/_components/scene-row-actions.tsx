"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { ExternalLink, Trash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function SceneRowActions({
  scene,
  onDelete,
}: {
  scene: Doc<"scenes">
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
