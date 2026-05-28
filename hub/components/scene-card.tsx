import type { Doc } from "@/convex/_generated/dataModel"
import { formatSceneDateTime } from "@/lib/format-scene-datetime"
import { Box, Eye, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export type SceneCardScene = Omit<Doc<"scenes">, "ownerId"> & {
  username: string
  thumbnailUrl?: string
}

export function SceneCard({ scene }: { scene: SceneCardScene }) {
  return (
    <div className="block max-w-lg overflow-hidden rounded-lg border bg-muted/40 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
      <Link
        href={`/view/${scene._id}`}
        className="relative flex aspect-video items-center justify-center border border-transparent transition-colors hover:border-primary"
      >
        {scene.thumbnailUrl ? (
          <Image
            src={scene.thumbnailUrl}
            alt="Scene preview"
            width={512}
            height={288}
          />
        ) : (
          <Box
            strokeWidth={1.25}
            className="size-14 text-muted-foreground"
            aria-hidden
          />
        )}
        <span className="sr-only">Scene preview placeholder</span>
      </Link>
      <div className="flex flex-col gap-1 p-3">
        <div>
          <Link
            href={`/view/${scene._id}`}
            className="line-clamp-1 leading-snug font-semibold hover:underline"
          >
            {scene.name}
          </Link>
          <span className="line-clamp-1 text-xs leading-snug font-semibold text-muted-foreground">
            by{" "}
            <Link
              href={`/user/${scene.username}`}
              target="_blank"
              className="text-foreground hover:underline"
            >
              {scene.username}
            </Link>
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
    </div>
  )
}
