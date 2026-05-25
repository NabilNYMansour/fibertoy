import type { Doc } from "@/convex/_generated/dataModel"
import { formatSceneDateTime } from "@/lib/format-scene-datetime"
import { Box, Eye, Heart } from "lucide-react"
import Link from "next/link"

export type SceneCardProps = Omit<Doc<"scenes">, "ownerId">

export function SceneCard({ scene }: { scene: SceneCardProps }) {
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
        <div className="flex items-center justify-between">
          <span className="pt-1 text-[11px] text-muted-foreground">
            Updated {formatSceneDateTime(scene.updatedAt)}
          </span>
          <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Eye className="size-4" aria-hidden /> {scene.views}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Heart className="size-4" aria-hidden /> {scene.likes}
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
