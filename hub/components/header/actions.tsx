"use client"

import { Save } from "lucide-react"
import { Button } from "../ui/button"
import { useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getSceneCode } from "@/hooks/use-scene-store"
import { toast } from "sonner"
import SceneInfoDialog from "./scene-info-dialog"
import { UpdateSceneDataInput } from "@/convex/scenes"
import { Separator } from "../ui/separator"
import PublicEye from "../ui/public-eye"

const Actions = () => {
  const { user } = useUser()
  const updateScene = useMutation(api.scenes.updateScene)
  const router = useRouter()

  const pathname = usePathname()
  const isView = pathname.includes("/view/")
  const isNew = pathname.includes("/new")

  const sceneId = isView ? (pathname.split("/")[2] as Id<"scenes">) : undefined

  const sceneData = useQuery(
    api.scenes.getScene,
    sceneId && user?.id ? { sceneId, ownerId: user?.id } : "skip"
  )

  if (!user || !(isView || isNew)) return null

  const handleSave = async () => {
    const toastId = toast.loading("Saving...")
    const newSceneId = await updateScene({
      sceneId,
      ownerId: user.id,
      data: {
        code: getSceneCode(),
      },
    })
    toast.success("Saved!", { id: toastId })
    if (!sceneId) {
      router.push(`/view/${newSceneId}`)
    }
  }

  const handleSubmit = async (sceneData: UpdateSceneDataInput) => {
    const toastId = toast.loading("Saving...")
    await updateScene({ sceneId, ownerId: user.id, data: sceneData })
    toast.success("Saved!", { id: toastId })
  }

  return (
    <div className="flex items-center gap-2">
      {sceneData && (
        <>
          <PublicEye isPublic={sceneData.public} />
          <div className="line-clamp-1 max-w-xs pr-2 text-xs">
            {sceneData.name}
          </div>
          <SceneInfoDialog sceneData={sceneData} onSubmit={handleSubmit} />
        </>
      )}
      <Button size="sm" onClick={handleSave}>
        <Save />
        Save
      </Button>
      <Separator orientation="vertical" />
    </div>
  )
}

export default Actions
