"use client"

import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import SceneSettingsDialog from "./scene-settings-dialog"
import { UpdateSceneDataInput } from "@/convex/scenes"
import PublicEye from "@/components/ui/public-eye"
import { Separator } from "@/components/ui/separator"
import SceneInfoDialog from "./scene-info-dialog"
import ShareDialog from "./share-dialog"
import { ErrorBoundary } from "react-error-boundary"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ActionsProps {
  pathname: string
}

const Actions = ({ pathname }: ActionsProps) => {
  const [open, setOpen] = useState(false)

  const { user } = useUser()
  const updateScene = useMutation(api.scenes.updateScene)

  const isView = pathname.includes("/view/")
  const isMyScenes = pathname.includes("/my-scenes")

  const sceneId = isView ? (pathname.split("/")[2] as Id<"scenes">) : undefined

  const sceneData = useQuery(
    api.scenes.getScene,
    sceneId ? { sceneId } : "skip"
  )

  const handleSubmit = async (sceneData: UpdateSceneDataInput) => {
    if (!user || !user.username) return
    const toastId = toast.loading("Saving...")
    try {
      await updateScene({
        sceneId,
        data: sceneData,
        username: user.username,
      })
      toast.success("Saved!", { id: toastId })
      setOpen(false)
    } catch {
      toast.error("Failed to save", { id: toastId })
    }
  }

  const toggleLikeScene = useMutation(api.scenes.toggleLikeScene)

  const handleLike = async () => {
    if (!user) return
    const toastId = toast.loading("Loading...")
    try {
      const result = await toggleLikeScene({
        userId: user.id,
        sceneId: sceneId!,
      })
      toast.success(`${result ? "Liked" : "Unliked"} scene!`, { id: toastId })
    } catch {
      toast.error("Something went wrong", { id: toastId })
    }
  }

  const hasLiked = useQuery(
    api.scenes.getUserLikedScene,
    user?.id && sceneId ? { userId: user.id, sceneId: sceneId } : "skip"
  )

  if (isMyScenes)
    return (
      <Link href={`/user/${user?.username}`}>
        <Button size="sm">
          <Globe /> Public Profile
        </Button>
      </Link>
    )

  if (!isView) return null

  return (
    <div className="flex items-center gap-2">
      {user?.id && sceneId && (
        <Button onClick={handleLike} variant="ghost" size="icon">
          <Heart className={cn("h-4 w-4", { "fill-white": hasLiked })} />
        </Button>
      )}
      {sceneData && !sceneData.readOnly && (
        <>
          <PublicEye isPublic={!!sceneData.public} />
          <div className="line-clamp-1 max-w-xs pr-2 text-xs">
            {sceneData.name}
          </div>
          <SceneSettingsDialog
            sceneData={sceneData}
            onSubmit={handleSubmit}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      )}
      {sceneData?.readOnly && (
        <>
          <div className="line-clamp-1 max-w-xs pr-2 text-xs">
            {sceneData.name}
          </div>
          <SceneInfoDialog sceneData={sceneData} />
        </>
      )}
      {sceneData && (
        <ShareDialog sceneId={sceneId!} isPublic={sceneData.public} />
      )}
      <Separator orientation="vertical" />
    </div>
  )
}

export default function HeaderActions() {
  const pathname = usePathname()
  return (
    <ErrorBoundary fallback={<></>} key={pathname}>
      <Actions pathname={pathname} />
    </ErrorBoundary>
  )
}
