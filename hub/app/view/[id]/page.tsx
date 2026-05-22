"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useQuery_experimental as useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { usePathname, notFound } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { setSceneCode } from "@/hooks/use-scene-store"

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const sceneId = useMemo(
    () => pathname.split("/")[2] as Id<"scenes">,
    [pathname]
  )

  const result = useQuery({
    query: api.codes.getCode,
    args: sceneId ? { sceneId, ownerId: user?.id } : "skip",
  })

  if (result.status === "error") {
    notFound()
  }

  const code = result.status === "success" ? result.data : undefined

  useEffect(() => {
    if (!iframeRef.current || !iframeLoaded || !code) return
    const win = iframeRef.current.contentWindow
    if (!win) return
    win.postMessage({ type: "initialize" }, "*")
    win.postMessage({ type: "code", code }, "*")
  }, [code, iframeLoaded])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type !== "code") return
      setSceneCode(event.data.code)
    }
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="flex flex-1">
      <iframe
        src="http://localhost:5173"
        className="flex-1 bg-transparent"
        sandbox="allow-scripts"
        onLoad={() => setIframeLoaded(true)}
        ref={iframeRef}
      />
    </div>
  )
}
