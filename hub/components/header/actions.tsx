"use client"

import { Save } from "lucide-react"
import { Button } from "../ui/button"
import { useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getSceneCode } from "@/hooks/use-scene-store"
import { toast } from "sonner"

const Actions = () => {
  const { user } = useUser()
  const pathname = usePathname()
  const updateScene = useMutation(api.scenes.updateScene)
  const router = useRouter()

  const isView = pathname.includes("/view/")
  const isNew = pathname.includes("/new/")

  const onSaveCode = async () => {
    const toastId = toast.loading("Saving...")
    if (!user?.id) return
    const sceneId = isView
      ? (pathname.split("/")[2] as Id<"scenes">)
      : undefined
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

  if (!user || !(isView || isNew)) return null

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={onSaveCode}>
        <Save />
        Save
      </Button>
    </div>
  )
}

export default Actions
