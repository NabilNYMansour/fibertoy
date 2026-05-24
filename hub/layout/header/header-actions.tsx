"use client"

import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import SceneSettingsDialog from "./scene-settings-dialog"
import { UpdateSceneDataInput } from "@/convex/scenes"
import PublicEye from "@/components/ui/public-eye"
import { Separator } from "@/components/ui/separator"
import SceneInfoDialog from "./scene-info-dialog"
import { ErrorBoundary } from "react-error-boundary"
import { useState } from "react"

const Actions = () => {
  const [open, setOpen] = useState(false)

  const { user } = useUser()
  const updateScene = useMutation(api.scenes.updateScene)

  const pathname = usePathname()
  const isView = pathname.includes("/view/")
  const isNew = pathname.includes("/new")

  const sceneId = isView ? (pathname.split("/")[2] as Id<"scenes">) : undefined

  const sceneData = useQuery(
    api.scenes.getScene,
    sceneId ? { sceneId, ownerId: user?.id } : "skip"
  )

  const handleSubmit = async (sceneData: UpdateSceneDataInput) => {
    if (!user || !user.username) return
    const toastId = toast.loading("Saving...")
    try {
      await updateScene({
        sceneId,
        ownerId: user.id,
        data: sceneData,
        username: user.username,
      })
      toast.success("Saved!", { id: toastId })
      setOpen(false)
    } catch {
      toast.error("Failed to save", { id: toastId })
    }
  }

  if (!isView && isNew) return null

  return (
    <div className="flex items-center gap-2">
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
      <Separator orientation="vertical" />
    </div>
  )
}

export default function HeaderActions() {
  return (
    <ErrorBoundary fallback={<></>}>
      <Actions />
    </ErrorBoundary>
  )
}
