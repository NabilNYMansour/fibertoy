"use client"

import { Button } from "@/components/ui/button"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { ExternalLink, Trash } from "lucide-react"
import Link from "next/link"

export function SceneRowActions({
  scene,
  onDelete,
}: {
  scene: Doc<"scenes">
  onDelete: (sceneId: Id<"scenes">) => void | Promise<void>
}) {
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
