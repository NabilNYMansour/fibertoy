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
  fork?: boolean
}

const useMessageHandler = ({
  sceneId,
  code,
  iframeRef,
  fork,
}: UseMessageHandlerProps) => {
  const [ready, setReady] = useState(false)

  const router = useRouter()
  const updateScene = useMutation(api.scenes.updateScene)
  const { user } = useUser()

  const handleSave = useCallback(
    async (code: string) => {
      if (!user?.id || !user.username) return
      const toastId = toast.loading("Saving...")
      try {
        const newSceneId = await updateScene({
          sceneId,
          ownerId: user.id,
          username: user.username,
          data: { code },
        })
        toast.success("Saved!", { id: toastId })
        if (sceneId !== newSceneId) router.push(`/view/${newSceneId}`)
      } catch (error) {
        const rawErrorMessage =
          error instanceof Error ? error.message : String(error)
        const errorMessage = rawErrorMessage
          .toLowerCase()
          .includes("code too long")
          ? "Code too long"
          : "Failed to save"
        toast.error(errorMessage, { id: toastId })
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
    win.postMessage(
      { type: "initialize", code, userExists: !!user?.id, fork },
      "*"
    )
    win.postMessage({ type: "code", code }, "*")
  }, [code, ready, iframeRef, user, fork])
}

export default useMessageHandler
