"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
interface UseMessageHandlerProps {
  sceneId?: Id<"scenes">
  code?: string | null
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}
const useMessageHandler = ({
  sceneId,
  code,
  iframeRef,
}: UseMessageHandlerProps) => {
  const [ready, setReady] = useState(false)

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
      } else if (event.data.type === "ready") {
        setReady(true)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [handleSave])

  useEffect(() => {
    if (!iframeRef.current || !ready || code === undefined || code === null) {
      return
    }
    const win = iframeRef.current.contentWindow
    if (!win) return
    win.postMessage({ type: "initialize", code }, "*")
    win.postMessage({ type: "code", code }, "*")
  }, [code, ready, iframeRef])
}

export default useMessageHandler
