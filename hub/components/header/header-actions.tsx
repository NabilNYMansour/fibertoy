"use client"

import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import SceneSettingsDialog from "./scene-settings-dialog"
import { UpdateSceneDataInput } from "@/convex/scenes"
import { Separator } from "../ui/separator"
import PublicEye from "../ui/public-eye"
import ErrorRedirect from "../errors/error-redirect"

const Actions = () => {
  const { user } = useUser()
  const updateScene = useMutation(api.scenes.updateScene)

  const pathname = usePathname()
  const isView = pathname.includes("/view/")
  const isNew = pathname.includes("/new")

  const sceneId = isView ? (pathname.split("/")[2] as Id<"scenes">) : undefined

  const sceneData = useQuery(
    api.scenes.getScene,
    sceneId && user?.id ? { sceneId, ownerId: user?.id } : "skip"
  )

  const handleSubmit = async (sceneData: UpdateSceneDataInput) => {
    if (!user) return
    const toastId = toast.loading("Saving...")
    try {
      await updateScene({ sceneId, ownerId: user.id, data: sceneData })
      toast.success("Saved!", { id: toastId })
    } catch {
      toast.error("Failed to save", { id: toastId })
    }
  }

  if (!user || !(isView || isNew)) return null

  return (
    <div className="flex items-center gap-2">
      {sceneData && (
        <>
          <PublicEye isPublic={sceneData.public} />
          <div className="line-clamp-1 max-w-xs pr-2 text-xs">
            {sceneData.name}
          </div>
          <SceneSettingsDialog sceneData={sceneData} onSubmit={handleSubmit} />
        </>
      )}
      <Separator orientation="vertical" />
    </div>
  )
}

export default function HeaderActions() {
  return (
    <ErrorRedirect>
      <Actions />
    </ErrorRedirect>
  )
}
