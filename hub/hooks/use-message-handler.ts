"use client"

import { useCallback, useEffect } from "react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"

const useMessageHandler = (sceneId?: Id<"scenes">) => {
  const router = useRouter()
  const updateScene = useMutation(api.scenes.updateScene)
  const { user } = useUser()

  const handleSave = useCallback(
    async (code: string) => {
      if (!user?.id) return
      const toastId = toast.loading("Saving...")
      try {
        const newSceneId = await updateScene({
          sceneId,
          ownerId: user.id,
          data: { code },
        })
        toast.success("Saved!", { id: toastId })
        if (!sceneId) router.push(`/view/${newSceneId}`)
      } catch {
        toast.error("Failed to save", { id: toastId })
      }
    },
    [sceneId, user, updateScene, router]
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "code") {
        handleSave(event.data.code)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [handleSave])
}

export default useMessageHandler
